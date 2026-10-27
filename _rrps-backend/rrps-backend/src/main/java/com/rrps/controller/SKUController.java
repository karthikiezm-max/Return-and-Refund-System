package com.rrps.controller;

import com.rrps.entity.SKU;
import com.rrps.repository.SKURepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.UUID;

@RestController
@PreAuthorize("hasAnyRole('CUSTOMER', 'CUSTOMER_SUPPORT', 'WAREHOUSE_QC', 'FINANCE', 'SUPPLIER_MANAGER', 'ADMIN')")
@RequestMapping("/api/v1/skus")
@CrossOrigin(origins = "http://localhost:8081")
public class SKUController {

    private final SKURepository skuRepository;

    public SKUController(SKURepository skuRepository) {
        this.skuRepository = skuRepository;
    }

    @GetMapping
    public ResponseEntity<List<SKU>> getAll() {
        return ResponseEntity.ok(skuRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SKU> getById(@PathVariable UUID id) {
        return skuRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<SKU> create(@RequestBody SKU sku) {
        return ResponseEntity.ok(skuRepository.save(sku));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SKU> update(
            @PathVariable UUID id,
            @RequestBody SKU sku
    ) {
        return skuRepository.findById(id)
                .map(existing -> {
                    return ResponseEntity.ok(
                            skuRepository.save(sku)
                    );
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {

        if (!skuRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        skuRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}