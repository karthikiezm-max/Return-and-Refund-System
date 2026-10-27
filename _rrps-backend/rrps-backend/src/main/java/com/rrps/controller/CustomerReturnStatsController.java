package com.rrps.controller;

import com.rrps.dto.CustomerReturnStatsRequest;
import com.rrps.entity.CustomerReturnStats;
import com.rrps.service.CustomerReturnStatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.UUID;

@RestController
@PreAuthorize("hasAnyRole('ADMIN')")
@RequestMapping("/api/v1/customer-return-stats")
@CrossOrigin(origins = "http://localhost:8081")
public class CustomerReturnStatsController {

    private final CustomerReturnStatsService service;

    public CustomerReturnStatsController(CustomerReturnStatsService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<CustomerReturnStats>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerReturnStats> getById(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<CustomerReturnStats> getByCustomerId(
            @PathVariable UUID customerId
    ) {
        return ResponseEntity.ok(service.getByCustomerId(customerId));
    }

    @PostMapping
    public ResponseEntity<CustomerReturnStats> createOrUpdate(
            @RequestBody CustomerReturnStatsRequest request
    ) {
        return ResponseEntity.ok(service.createOrUpdate(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerReturnStats> update(
            @PathVariable UUID id,
            @RequestBody CustomerReturnStatsRequest request
    ) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id
    ) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}