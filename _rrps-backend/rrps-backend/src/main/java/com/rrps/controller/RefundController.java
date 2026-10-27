package com.rrps.controller;

import com.rrps.entity.Refund;
import com.rrps.enums.RefundStatus;
import com.rrps.service.RefundService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.UUID;

@RestController
@PreAuthorize("hasAnyRole('CUSTOMER', 'CUSTOMER_SUPPORT', 'FINANCE', 'ADMIN')")
@RequestMapping("/api/v1/refunds")
@CrossOrigin(origins = "http://localhost:8081")
public class RefundController {

    private final RefundService refundService;

    public RefundController(RefundService refundService) {
        this.refundService = refundService;
    }

    @GetMapping
    public ResponseEntity<List<Refund>> getAll() {
        return ResponseEntity.ok(
                refundService.getAll()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Refund> getById(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                refundService.getById(id)
        );
    }

    @GetMapping("/return/{returnId}")
    public ResponseEntity<Refund> getByReturnId(
            @PathVariable UUID returnId
    ) {
        return ResponseEntity.ok(
                refundService.getByReturnId(returnId)
        );
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Refund>> getByStatus(
            @PathVariable RefundStatus status
    ) {
        return ResponseEntity.ok(
                refundService.getByStatus(status)
        );
    }

    @PostMapping
    public ResponseEntity<Refund> create(
            @RequestBody Refund refund
    ) {
        return ResponseEntity.ok(
                refundService.create(refund)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Refund> update(
            @PathVariable UUID id,
            @RequestBody Refund refund
    ) {
        return ResponseEntity.ok(
                refundService.update(id, refund)
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Refund> updateStatus(
            @PathVariable UUID id,
            @RequestParam RefundStatus status
    ) {
        return ResponseEntity.ok(
                refundService.updateStatus(id, status)
        );
    }

    @PostMapping("/{id}/disburse")
    public ResponseEntity<Refund> disbursePost(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                refundService.updateStatus(id, RefundStatus.CREDITED)
        );
    }

    @PutMapping("/{id}/disburse")
    public ResponseEntity<Refund> disbursePut(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                refundService.updateStatus(id, RefundStatus.CREDITED)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id
    ) {
        refundService.delete(id);

        return ResponseEntity.noContent().build();
    }
}