package com.rrps.controller;

import com.rrps.entity.Supplier;
import com.rrps.repository.SupplierRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.UUID;

@RestController
@PreAuthorize("hasAnyRole('SUPPLIER_MANAGER', 'ADMIN')")
@RequestMapping("/api/v1/suppliers")
@CrossOrigin(origins = "http://localhost:8081")
public class SupplierController {

    private final SupplierRepository supplierRepository;

    public SupplierController(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @GetMapping
    public ResponseEntity<List<Supplier>> getAll() {
        return ResponseEntity.ok(supplierRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getById(@PathVariable UUID id) {
        return supplierRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Supplier> create(@RequestBody Supplier supplier) {
        return ResponseEntity.ok(supplierRepository.save(supplier));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Supplier> update(
            @PathVariable UUID id,
            @RequestBody Supplier supplier
    ) {
        return supplierRepository.findById(id)
                .map(existing -> ResponseEntity.ok(
                        supplierRepository.save(supplier)
                ))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {

        if (!supplierRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        supplierRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}