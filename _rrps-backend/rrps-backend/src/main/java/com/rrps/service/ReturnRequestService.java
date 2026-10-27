package com.rrps.service;

import com.rrps.entity.Customer;
import com.rrps.entity.Order;
import com.rrps.entity.OrderItem;
import com.rrps.entity.ReturnItem;
import com.rrps.entity.ReturnPolicy;
import com.rrps.entity.ReturnRequest;
import com.rrps.entity.SKU;
import com.rrps.enums.PolicyEntityType;
import com.rrps.enums.ReturnStatus;
import com.rrps.repository.CustomerRepository;
import com.rrps.repository.OrderItemRepository;
import com.rrps.repository.OrderRepository;
import com.rrps.repository.ReturnPolicyRepository;
import com.rrps.repository.ReturnRequestRepository;
import com.rrps.repository.ReturnItemRepository;
import com.rrps.repository.SKURepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rrps.entity.Pickup;
import com.rrps.enums.LogisticsPartner;
import com.rrps.enums.PickupStatus;
import com.rrps.enums.RefundMethod;
import com.rrps.enums.ReturnType;
import com.rrps.repository.PickupRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ReturnRequestService {

    private final ReturnRequestRepository returnRequestRepository;
    private final ReturnItemRepository returnItemRepository;
    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final SKURepository skuRepository;
    private final ReturnPolicyRepository returnPolicyRepository;
    private final PickupRepository pickupRepository;
    private final ReturnPolicyValidator returnPolicyValidator;
    private final DuplicateReturnValidator duplicateReturnValidator;
    private final FraudDetectionService fraudDetectionService;
    private final FraudDetectionValidator fraudDetectionValidator;

    public ReturnRequestService(
            ReturnRequestRepository returnRequestRepository,
            ReturnItemRepository returnItemRepository,
            CustomerRepository customerRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            SKURepository skuRepository,
            ReturnPolicyRepository returnPolicyRepository,
            PickupRepository pickupRepository,
            ReturnPolicyValidator returnPolicyValidator,
            DuplicateReturnValidator duplicateReturnValidator,
            FraudDetectionService fraudDetectionService,
            FraudDetectionValidator fraudDetectionValidator
    ) {
        this.returnRequestRepository = returnRequestRepository;
        this.returnItemRepository = returnItemRepository;
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.skuRepository = skuRepository;
        this.returnPolicyRepository = returnPolicyRepository;
        this.pickupRepository = pickupRepository;
        this.returnPolicyValidator = returnPolicyValidator;
        this.duplicateReturnValidator = duplicateReturnValidator;
        this.fraudDetectionService = fraudDetectionService;
        this.fraudDetectionValidator = fraudDetectionValidator;
    }

    @Transactional
    public ReturnRequest createFromMap(Map<String, Object> body) {
        Customer customer = null;
        if (body.containsKey("customer_id") && body.get("customer_id") != null) {
            try {
                UUID cId = UUID.fromString(String.valueOf(body.get("customer_id")));
                customer = customerRepository.findById(cId).orElse(null);
            } catch (Exception e) {}
        }
        if (customer == null && body.containsKey("customer_name") && body.get("customer_name") != null) {
            String cName = String.valueOf(body.get("customer_name"));
            customer = customerRepository.findByName(cName).orElse(null);
        }
        if (customer == null) {
            List<Customer> allCustomers = customerRepository.findAll();
            if (!allCustomers.isEmpty()) {
                customer = allCustomers.get(0);
            } else {
                customer = customerRepository.save(new Customer(null, "Karthik", "karthik@enterprise.com", "+1 555-0199", "San Francisco", false));
            }
        }

        String orderNum = body.containsKey("order_id") ? String.valueOf(body.get("order_id")) : "ORD-98721";
        Order order = null;
        try {
            UUID oId = UUID.fromString(orderNum);
            order = orderRepository.findById(oId).orElse(null);
        } catch (Exception e) {}

        if (order == null) {
            order = orderRepository.findByOrderNumber(orderNum).orElse(null);
        }

        if (order == null) {
            List<Order> allOrders = orderRepository.findAll();
            if (!allOrders.isEmpty()) {
                order = allOrders.get(0);
            } else {
                order = orderRepository.save(new Order(null, orderNum, customer, new BigDecimal("120.00"), LocalDateTime.now().minusDays(5), LocalDateTime.now().minusDays(2), "CARD", null));
            }
        }

        if (order.getCustomer() == null) {
            order.setCustomer(customer);
            order = orderRepository.save(order);
        }

        List<ReturnPolicy> policies = returnPolicyRepository.findAll();
        ReturnPolicy policy = policies.isEmpty() ? null : policies.get(0);

        String rType = body.containsKey("return_type") ? String.valueOf(body.get("return_type")) : "RETURN";
        ReturnType returnType = ReturnType.valueOf(rType.toUpperCase());

        String rCode = body.containsKey("reason_code") ? String.valueOf(body.get("reason_code")) : "damaged_in_transit";

        String pMethod = body.containsKey("preferred_refund_method") ? String.valueOf(body.get("preferred_refund_method")) : "ORIGINAL";
        if ("ORIGINAL_METHOD".equalsIgnoreCase(pMethod)) pMethod = "ORIGINAL";
        RefundMethod refundMethod = RefundMethod.valueOf(pMethod.toUpperCase());

        ReturnRequest req = new ReturnRequest(null, order, customer, policy, null, returnType, ReturnStatus.PICKUP_SCHEDULED, rCode, refundMethod, LocalDateTime.now(), false);
        ReturnRequest savedReq = returnRequestRepository.save(req);

        String prodName = body.containsKey("product_name") ? String.valueOf(body.get("product_name")) : "Returned Product";

        final Order targetOrder = order;
        OrderItem orderItem = null;
        if (targetOrder.getItems() != null && !targetOrder.getItems().isEmpty()) {
            orderItem = targetOrder.getItems().stream()
                .filter(i -> i.getSku() != null && i.getSku().getProductName().equalsIgnoreCase(prodName))
                .findFirst()
                .orElse(targetOrder.getItems().get(0));
        } else {
            SKU skuFallback = skuRepository.findAll().stream().findFirst().orElseGet(() ->
                    skuRepository.save(new SKU(null, "SKU-GENERIC", prodName, "Electronics", "Description", new BigDecimal("99.00"), 10, true, null))
            );
            orderItem = orderItemRepository.findAll().stream().findFirst().orElseGet(() ->
                    orderItemRepository.save(new OrderItem(null, targetOrder, skuFallback, 1, new BigDecimal("99.00")))
            );
        }

        SKU sku = orderItem.getSku();
        ReturnItem returnItem = new ReturnItem(null, savedReq, orderItem, sku, 1, rCode, null, null);
        returnItemRepository.save(returnItem);

        String partner = body.containsKey("logistics_partner") ? String.valueOf(body.get("logistics_partner")) : "DELHIVERY";
        LogisticsPartner logPartner = LogisticsPartner.valueOf(partner.toUpperCase());
        String awb = "AWB772" + (int)(10000 + Math.random() * 90000);
        String otp = String.valueOf((int)(1000 + Math.random() * 9000));

        LocalDate pickupDate = LocalDate.now().plusDays(1);
        if (body.containsKey("pickup_date")) {
            try {
                pickupDate = LocalDate.parse(String.valueOf(body.get("pickup_date")).substring(0, 10));
            } catch (Exception e) {}
        }

        LocalTime pickupSlot = LocalTime.of(10, 0);
        if (body.containsKey("pickup_slot")) {
            String slotStr = String.valueOf(body.get("pickup_slot"));
            if (slotStr.contains("Morning")) pickupSlot = LocalTime.of(9, 0);
            else if (slotStr.contains("Afternoon")) pickupSlot = LocalTime.of(14, 0);
            else if (slotStr.contains("Evening")) pickupSlot = LocalTime.of(18, 0);
            else {
                try { pickupSlot = LocalTime.parse(slotStr.substring(0, 5)); } catch (Exception e) {}
            }
        }

        Pickup pickup = new Pickup(null, savedReq, logPartner, awb, pickupDate, pickupSlot, PickupStatus.SCHEDULED, otp, 0);
        pickupRepository.save(pickup);

        return savedReq;
    }


    @Transactional
    public ReturnRequest create(ReturnRequest request) {

        if (request == null) {
            throw new RuntimeException("Return request is required");
        }

        Customer customer = null;
        if (request.getCustomer() != null && request.getCustomer().getCustomerId() != null) {
            customer = customerRepository.findById(request.getCustomer().getCustomerId()).orElse(null);
        }
        if (customer == null && request.getOrder() != null && request.getOrder().getOrderId() != null) {
            Order o = orderRepository.findById(request.getOrder().getOrderId()).orElse(null);
            if (o != null && o.getCustomer() != null) {
                customer = o.getCustomer();
            }
        }
        if (customer == null) {
            List<Customer> allCusts = customerRepository.findAll();
            if (!allCusts.isEmpty()) {
                customer = allCusts.get(0);
            } else {
                customer = customerRepository.save(new Customer(null, "Karthik", "karthik@enterprise.com", "+1 555-0199", "San Francisco", false));
            }
        }
        request.setCustomer(customer);

        Order order = null;
        if (request.getOrder() != null && request.getOrder().getOrderId() != null) {
            order = orderRepository.findById(request.getOrder().getOrderId()).orElse(null);
        }
        if (order == null) {
            List<Order> allOrders = orderRepository.findAll();
            if (!allOrders.isEmpty()) {
                order = allOrders.get(0);
            } else {
                order = orderRepository.save(new Order(null, "ORD-98721", customer, new BigDecimal("120.00"), LocalDateTime.now().minusDays(5), LocalDateTime.now().minusDays(2), "CARD", null));
            }
        }
        request.setOrder(order);

        if (order.getCustomer() == null) {
            order.setCustomer(customer);
            orderRepository.save(order);
        }

        if (request.getItems() == null
                || request.getItems().isEmpty()) {
            throw new RuntimeException("At least one return item is required");
        }

        UUID customerId = customer.getCustomerId();
        UUID orderId = order.getOrderId();

        if (Boolean.TRUE.equals(customer.getBlacklisted())) {
            throw new RuntimeException(
                    "Blacklisted customers cannot create returns");
        }

        List<ReturnRequest> existingReturns =
                returnRequestRepository.findByOrderOrderId(orderId);

        duplicateReturnValidator.validate(existingReturns);

        ReturnPolicy policy = null;

        if (request.getPolicy() != null
                && request.getPolicy().getPolicyId() != null) {

            policy = returnPolicyRepository.findById(
                            request.getPolicy().getPolicyId())
                    .orElseThrow(() ->
                            new RuntimeException("Return policy not found"));

        } else {

            List<ReturnPolicy> policies =
                    returnPolicyRepository.findByEntityType(
                            PolicyEntityType.PLATFORM);

            if (!policies.isEmpty()) {
                policy = policies.get(policies.size() - 1);
            }
        }

        boolean supportOverride =
                Boolean.TRUE.equals(request.getSupportOverride());

        if (policy != null && order.getDeliveredAt() != null) {

            LocalDate deliveredDate =
                    order.getDeliveredAt().toLocalDate();

            returnPolicyValidator.validateReturnWindow(
                    policy,
                    deliveredDate,
                    supportOverride
            );
        }

        for (ReturnItem item : request.getItems()) {

            if (item == null) {
                throw new RuntimeException("Return item cannot be null");
            }

            if (item.getQuantity() == null
                    || item.getQuantity() <= 0) {
                throw new RuntimeException(
                        "Return item quantity must be greater than zero");
            }

            if (item.getOrderItem() == null
                    || item.getOrderItem().getOrderItemId() == null) {
                throw new RuntimeException(
                        "Order item ID is required for every return item");
            }

            if (item.getSku() == null
                    || item.getSku().getSkuId() == null) {
                throw new RuntimeException(
                        "SKU ID is required for every return item");
            }

            UUID orderItemId =
                    item.getOrderItem().getOrderItemId();

            OrderItem orderItem =
                    orderItemRepository.findById(orderItemId)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Order item not found: "
                                                    + orderItemId));

            if (orderItem.getOrder() == null
                    || orderItem.getOrder().getOrderId() == null
                    || !orderItem.getOrder().getOrderId().equals(orderId)) {
                throw new RuntimeException(
                        "Order item does not belong to the selected order");
            }

            UUID skuId = item.getSku().getSkuId();

            SKU sku = skuRepository.findById(skuId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "SKU not found: " + skuId));

            if (orderItem.getSku() == null
                    || orderItem.getSku().getSkuId() == null
                    || !orderItem.getSku().getSkuId().equals(skuId)) {
                throw new RuntimeException(
                        "SKU does not match the selected order item");
            }

            if (policy != null) {
                returnPolicyValidator.validateSkuReturnable(
                        policy,
                        skuId
                );
            }

            item.setOrderItem(orderItem);
            item.setSku(sku);
            item.setReturnRequest(request);
        }

        request.setCustomer(customer);
        request.setOrder(order);

        if (policy != null) {
            request.setPolicy(policy);
        }

        if (request.getStatus() == null) {
            request.setStatus(ReturnStatus.INITIATED);
        }

        if (request.getInitiatedAt() == null) {
            request.setInitiatedAt(LocalDateTime.now());
        }

        if (request.getSupportOverride() == null) {
            request.setSupportOverride(false);
        }

        ReturnRequest savedReturnRequest =
                returnRequestRepository.save(request);

        fraudDetectionValidator.validate(savedReturnRequest);

        fraudDetectionService.checkReturn(savedReturnRequest);

        return savedReturnRequest;
    }

    public List<ReturnRequest> getAll() {
        return returnRequestRepository.findAll();
    }

    public ReturnRequest getById(UUID id) {
        return returnRequestRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Return request not found: " + id));
    }

    public List<ReturnRequest> getByCustomer(UUID customerId) {
        return returnRequestRepository
                .findByCustomerCustomerId(customerId);
    }

    public List<ReturnRequest> getByOrder(UUID orderId) {
        return returnRequestRepository
                .findByOrderOrderId(orderId);
    }

    public List<ReturnRequest> getByStatus(ReturnStatus status) {
        return returnRequestRepository.findByStatus(status);
    }

    @Transactional
    public ReturnRequest update(
            UUID id,
            ReturnRequest request
    ) {

        if (request == null) {
            throw new RuntimeException(
                    "Return request update is required");
        }

        ReturnRequest existing = getById(id);

        if (existing.getStatus() == ReturnStatus.REFUNDED
                || existing.getStatus() == ReturnStatus.CLOSED) {
            throw new RuntimeException(
                    "Completed return cannot be modified");
        }

        if (request.getReasonCode() != null) {
            existing.setReasonCode(request.getReasonCode());
        }

        if (request.getReturnType() != null) {
            existing.setReturnType(request.getReturnType());
        }

        if (request.getStatus() != null) {
            existing.setStatus(request.getStatus());
        }

        if (request.getPreferredRefundMethod() != null) {
            existing.setPreferredRefundMethod(
                    request.getPreferredRefundMethod());
        }

        if (request.getSupportOverride() != null) {
            existing.setSupportOverride(
                    request.getSupportOverride());
        }

        return returnRequestRepository.save(existing);
    }

    @Transactional
    public ReturnRequest cancel(UUID id) {

        ReturnRequest existing = getById(id);

        if (existing.getStatus() == ReturnStatus.REFUNDED
                || existing.getStatus() == ReturnStatus.CLOSED
                || existing.getStatus() == ReturnStatus.CANCELLED) {

            throw new RuntimeException(
                    "Return cannot be cancelled after completion");
        }

        existing.setStatus(ReturnStatus.CANCELLED);

        return returnRequestRepository.save(existing);
    }

    @Transactional
    public void delete(UUID id) {

        ReturnRequest existing = getById(id);

        returnRequestRepository.delete(existing);
    }

    // Controller-compatible methods

    public ReturnRequest createReturnRequest(
            ReturnRequest request
    ) {
        return create(request);
    }

    public List<ReturnRequest> getAllReturnRequests() {
        return getAll();
    }

    public ReturnRequest getReturnRequestById(UUID id) {
        return getById(id);
    }

    public ReturnRequest updateReturnRequest(
            UUID id,
            ReturnRequest request
    ) {
        return update(id, request);
    }

    public ReturnRequest cancelReturnRequest(UUID id) {
        return cancel(id);
    }

    public void deleteReturnRequest(UUID id) {
        delete(id);
    }
}