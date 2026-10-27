package com.rrps.controller;

import com.rrps.entity.Order;
import com.rrps.repository.OrderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.UUID;

@RestController
@PreAuthorize("hasAnyRole('CUSTOMER', 'CUSTOMER_SUPPORT', 'WAREHOUSE_QC', 'FINANCE', 'SUPPLIER_MANAGER', 'ADMIN')")
@RequestMapping("/api/v1/orders")
@CrossOrigin(origins = "http://localhost:8081")
public class OrderController {

    private final OrderRepository orderRepository;

    public OrderController(
            OrderRepository orderRepository
    ) {
        this.orderRepository = orderRepository;
    }

    @PostMapping
    public ResponseEntity<Order> create(
            @RequestBody Order order
    ) {
        return ResponseEntity.ok(
                orderRepository.save(order)
        );
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAll() {
        return ResponseEntity.ok(
                orderRepository.findAll()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getById(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                orderRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found"
                                )
                        )
        );
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Order>> getByCustomer(
            @PathVariable UUID customerId
    ) {
        return ResponseEntity.ok(
                orderRepository
                        .findByCustomerCustomerId(
                                customerId
                        )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> update(
            @PathVariable UUID id,
            @RequestBody Order request
    ) {

        Order order =
                orderRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found"
                                )
                        );

        if (request.getOrderNumber() != null) {
            order.setOrderNumber(
                    request.getOrderNumber()
            );
        }

        if (request.getCustomer() != null) {
            order.setCustomer(
                    request.getCustomer()
            );
        }

        if (request.getTotalAmount() != null) {
            order.setTotalAmount(
                    request.getTotalAmount()
            );
        }

        if (request.getOrderDate() != null) {
            order.setOrderDate(
                    request.getOrderDate()
            );
        }

        if (request.getDeliveredAt() != null) {
            order.setDeliveredAt(
                    request.getDeliveredAt()
            );
        }

        if (request.getPaymentMethod() != null) {
            order.setPaymentMethod(
                    request.getPaymentMethod()
            );
        }

        return ResponseEntity.ok(
                orderRepository.save(order)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id
    ) {

        if (!orderRepository.existsById(id)) {
            throw new RuntimeException(
                    "Order not found"
            );
        }

        orderRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}