package com.rrps.controller;

import com.rrps.dto.LiquidationBatchRequest;
import com.rrps.entity.LiquidationBatch;
import com.rrps.enums.LiquidationStatus;
import com.rrps.service.LiquidationBatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.UUID;

@RestController
@PreAuthorize("hasAnyRole('ADMIN')")
@RequestMapping("/api/v1/liquidation")
@CrossOrigin(origins = "http://localhost:8081")
public class LiquidationBatchController {

    private final LiquidationBatchService service;

    public LiquidationBatchController(
            LiquidationBatchService service
    ) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<LiquidationBatch> create(
            @RequestBody LiquidationBatchRequest request
    ) {
        return ResponseEntity.ok(service.create(request));
    }

    @GetMapping
    public ResponseEntity<List<LiquidationBatch>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LiquidationBatch> getById(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<LiquidationBatch>> getByStatus(
            @PathVariable LiquidationStatus status
    ) {
        return ResponseEntity.ok(
                service.getByStatus(status)
        );
    }

    @GetMapping("/partner/{partnerName}")
    public ResponseEntity<List<LiquidationBatch>> getByPartner(
            @PathVariable String partnerName
    ) {
        return ResponseEntity.ok(
                service.getByPartner(partnerName)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<LiquidationBatch> update(
            @PathVariable UUID id,
            @RequestBody LiquidationBatchRequest request
    ) {
        return ResponseEntity.ok(
                service.update(id, request)
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<LiquidationBatch> updateStatus(
            @PathVariable UUID id,
            @RequestParam LiquidationStatus status
    ) {
        return ResponseEntity.ok(
                service.updateStatus(id, status)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id
    ) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}