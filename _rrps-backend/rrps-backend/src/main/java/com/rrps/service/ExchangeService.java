package com.rrps.service;

import com.rrps.dto.ExchangeRequest;
import com.rrps.entity.ExchangeRecord;
import com.rrps.entity.OrderItem;
import com.rrps.entity.ReturnRequest;
import com.rrps.entity.SKU;
import com.rrps.enums.ReturnStatus;
import com.rrps.enums.ReturnType;
import com.rrps.repository.ExchangeRecordRepository;
import com.rrps.repository.OrderItemRepository;
import com.rrps.repository.ReturnRequestRepository;
import com.rrps.repository.SKURepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExchangeService {

    private final ExchangeRecordRepository exchangeRecordRepository;
    private final ReturnRequestRepository returnRequestRepository;
    private final OrderItemRepository orderItemRepository;
    private final SKURepository skuRepository;
    private final ExchangeLimitValidator exchangeLimitValidator;
    private final OrderItemReturnValidator orderItemReturnValidator;
    private final ExchangeValidator exchangeValidator;

    @Transactional
    public ExchangeRecord create(ExchangeRequest request) {

        if (request == null) {
            throw new RuntimeException("Exchange request is required");
        }

        if (request.getReturnId() == null) {
            throw new RuntimeException("Return ID is required");
        }

        if (request.getOrderItemId() == null) {
            throw new RuntimeException("Order item ID is required");
        }

        if (request.getExchangeSkuId() == null) {
            throw new RuntimeException("Exchange SKU ID is required");
        }

        ReturnRequest returnRequest =
                returnRequestRepository.findById(request.getReturnId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Return request not found: "
                                                + request.getReturnId()
                                ));

        // Validate exchange request and return status
        exchangeValidator.validate(returnRequest);

        // Additional explicit return type validation
        if (returnRequest.getReturnType() != ReturnType.EXCHANGE) {
            throw new RuntimeException(
                    "This return request is not an exchange request"
            );
        }

        // Find the original order item
        OrderItem orderItem =
                orderItemRepository.findById(request.getOrderItemId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order item not found: "
                                                + request.getOrderItemId()
                                ));

        // Make sure the order item belongs to this return's order
        orderItemReturnValidator.validate(
                returnRequest,
                orderItem
        );

        // SRS: one exchange per order line
        exchangeLimitValidator.validate(
                request.getReturnId(),
                request.getOrderItemId()
        );

        // Find the requested replacement SKU
        SKU exchangeSku =
                skuRepository.findById(request.getExchangeSkuId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Exchange SKU not found: "
                                                + request.getExchangeSkuId()
                                ));

        ExchangeRecord exchange = new ExchangeRecord();

        exchange.setReturnRequest(returnRequest);
        exchange.setOrderItem(orderItem);
        exchange.setExchangeSku(exchangeSku);
        exchange.setCreatedAt(LocalDateTime.now());
        exchange.setDispatched(false);

        return exchangeRecordRepository.save(exchange);
    }

    public List<ExchangeRecord> getAll() {

        return exchangeRecordRepository.findAll();
    }

    public ExchangeRecord getById(UUID exchangeId) {

        return exchangeRecordRepository.findById(exchangeId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Exchange record not found: "
                                        + exchangeId
                        ));
    }

    public List<ExchangeRecord> getByReturn(UUID returnId) {

        return exchangeRecordRepository
                .findByReturnRequestReturnId(returnId);
    }

    @Transactional
    public ExchangeRecord updateDispatched(
            UUID exchangeId,
            boolean dispatched
    ) {

        ExchangeRecord exchange = getById(exchangeId);

        exchange.setDispatched(dispatched);

        if (dispatched) {

            ReturnRequest returnRequest =
                    exchange.getReturnRequest();

            returnRequest.setStatus(
                    ReturnStatus.EXCHANGE_DISPATCHED
            );

            returnRequestRepository.save(returnRequest);
        }

        return exchangeRecordRepository.save(exchange);
    }

    @Transactional
    public void delete(UUID exchangeId) {

        ExchangeRecord exchange = getById(exchangeId);

        exchangeRecordRepository.delete(exchange);
    }
}