package com.rrps.controller;

import com.rrps.dto.RtmBatchRequest;
import com.rrps.entity.RtmBatch;
import com.rrps.enums.RtmStatus;
import com.rrps.service.RtmBatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.UUID;

@RestController
@PreAuthorize("hasAnyRole('SUPPLIER_MANAGER', 'WAREHOUSE_QC', 'ADMIN')")
@RequestMapping("/api/v1/rtm")
@CrossOrigin(origins = "http://localhost:8081")
public class RtmBatchController {

    private final RtmBatchService service;

    public RtmBatchController(
            RtmBatchService service
    ) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<RtmBatch> create(
            @RequestBody RtmBatchRequest request
    ) {
        return ResponseEntity.ok(
                service.create(request)
        );
    }

    @GetMapping
    public ResponseEntity<List<RtmBatch>> getAll() {
        return ResponseEntity.ok(
                service.getAll()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<RtmBatch> getById(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                service.getById(id)
        );
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<RtmBatch>> getByStatus(
            @PathVariable RtmStatus status
    ) {
        return ResponseEntity.ok(
                service.getByStatus(status)
        );
    }

    @GetMapping("/supplier/{supplierId}")
    public ResponseEntity<List<RtmBatch>> getBySupplier(
            @PathVariable UUID supplierId
    ) {
        return ResponseEntity.ok(
                service.getBySupplier(supplierId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<RtmBatch> update(
            @PathVariable UUID id,
            @RequestBody RtmBatchRequest request
    ) {
        return ResponseEntity.ok(
                service.update(id, request)
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<RtmBatch> updateStatus(
            @PathVariable UUID id,
            @RequestParam RtmStatus status
    ) {
        return ResponseEntity.ok(
                service.updateStatus(id, status)
        );
    }

    @PutMapping("/{id}/dispatch")
    public ResponseEntity<RtmBatch> dispatchBatch(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                service.updateStatus(id, RtmStatus.DISPATCHED)
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