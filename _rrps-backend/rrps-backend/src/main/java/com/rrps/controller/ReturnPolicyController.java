package com.rrps.controller;

import com.rrps.entity.ReturnPolicy;
import com.rrps.enums.PolicyEntityType;
import com.rrps.service.ReturnPolicyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.UUID;

@RestController
@PreAuthorize("hasAnyRole('CUSTOMER', 'CUSTOMER_SUPPORT', 'WAREHOUSE_QC', 'FINANCE', 'SUPPLIER_MANAGER', 'ADMIN')")
@RequestMapping("/api/v1/return-policies")
@CrossOrigin(origins = "http://localhost:8081")
public class ReturnPolicyController {

    private final ReturnPolicyService returnPolicyService;

    public ReturnPolicyController(
            ReturnPolicyService returnPolicyService
    ) {
        this.returnPolicyService = returnPolicyService;
    }

    @GetMapping
    public ResponseEntity<List<ReturnPolicy>> getAll() {
        return ResponseEntity.ok(
                returnPolicyService.getAll()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReturnPolicy> getById(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                returnPolicyService.getById(id)
        );
    }

    @GetMapping("/type/{entityType}")
    public ResponseEntity<List<ReturnPolicy>> getByEntityType(
            @PathVariable PolicyEntityType entityType
    ) {
        return ResponseEntity.ok(
                returnPolicyService.getByEntityType(entityType)
        );
    }

    @GetMapping("/entity/{entityType}/{entityId}")
    public ResponseEntity<List<ReturnPolicy>> getByEntity(
            @PathVariable PolicyEntityType entityType,
            @PathVariable UUID entityId
    ) {
        return ResponseEntity.ok(
                returnPolicyService.getByEntity(
                        entityType,
                        entityId
                )
        );
    }

    @PostMapping
    public ResponseEntity<ReturnPolicy> create(
            @RequestBody ReturnPolicy policy
    ) {
        return ResponseEntity.ok(
                returnPolicyService.create(policy)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReturnPolicy> update(
            @PathVariable UUID id,
            @RequestBody ReturnPolicy policy
    ) {
        return ResponseEntity.ok(
                returnPolicyService.update(id, policy)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id
    ) {
        returnPolicyService.delete(id);

        return ResponseEntity.noContent().build();
    }
}