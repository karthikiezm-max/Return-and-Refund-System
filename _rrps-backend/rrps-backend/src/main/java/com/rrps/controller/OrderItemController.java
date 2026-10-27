package com.rrps.controller;

import com.rrps.entity.OrderItem;
import com.rrps.repository.OrderItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.UUID;

@RestController
@PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
@RequestMapping("/api/v1/order-items")
@CrossOrigin(origins = "http://localhost:8081")
public class OrderItemController {

    private final OrderItemRepository orderItemRepository;

    public OrderItemController(OrderItemRepository orderItemRepository) {
        this.orderItemRepository = orderItemRepository;
    }

    @GetMapping
    public ResponseEntity<List<OrderItem>> getAll() {
        return ResponseEntity.ok(orderItemRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderItem> getById(@PathVariable UUID id) {
        return orderItemRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<OrderItem> create(@RequestBody OrderItem orderItem) {
        return ResponseEntity.ok(orderItemRepository.save(orderItem));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderItem> update(
            @PathVariable UUID id,
            @RequestBody OrderItem orderItem
    ) {
        return orderItemRepository.findById(id)
                .map(existing -> {
                    existing.setQuantity(orderItem.getQuantity());
                    existing.setUnitPrice(orderItem.getUnitPrice());
                    existing.setSku(orderItem.getSku());
                    existing.setOrder(orderItem.getOrder());

                    return ResponseEntity.ok(
                            orderItemRepository.save(existing)
                    );
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {

        if (!orderItemRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        orderItemRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}