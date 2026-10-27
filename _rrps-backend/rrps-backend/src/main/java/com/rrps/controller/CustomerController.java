package com.rrps.controller;

import com.rrps.entity.Customer;
import com.rrps.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.UUID;

@RestController
@PreAuthorize("hasAnyRole('CUSTOMER', 'CUSTOMER_SUPPORT', 'WAREHOUSE_QC', 'FINANCE', 'ADMIN')")
@RequestMapping("/api/v1/customers")
@CrossOrigin(origins = "http://localhost:8081")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public ResponseEntity<List<Customer>> getAll() {
        return ResponseEntity.ok(
                customerService.getAll()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getById(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                customerService.getById(id)
        );
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Customer> getByEmail(
            @PathVariable String email
    ) {
        return ResponseEntity.ok(
                customerService.getByEmail(email)
        );
    }

    @PostMapping
    public ResponseEntity<Customer> create(
            @RequestBody Customer customer
    ) {
        return ResponseEntity.ok(
                customerService.create(customer)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> update(
            @PathVariable UUID id,
            @RequestBody Customer customer
    ) {
        return ResponseEntity.ok(
                customerService.update(id, customer)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id
    ) {
        customerService.delete(id);

        return ResponseEntity.noContent().build();
    }
}