package com.rrps.controller;

import com.rrps.dto.ExchangeRequest;
import com.rrps.entity.ExchangeRecord;
import com.rrps.service.ExchangeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.UUID;

@RestController
@PreAuthorize("hasAnyRole('CUSTOMER', 'CUSTOMER_SUPPORT', 'WAREHOUSE_QC', 'ADMIN')")
@RequestMapping("/api/v1/exchanges")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:8081")
public class ExchangeController {

    private final ExchangeService exchangeService;

    @PostMapping
    public ResponseEntity<ExchangeRecord> create(
            @RequestBody ExchangeRequest request
    ) {
        return ResponseEntity.ok(
                exchangeService.create(request)
        );
    }

    @GetMapping
    public ResponseEntity<List<ExchangeRecord>> getAll() {
        return ResponseEntity.ok(
                exchangeService.getAll()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExchangeRecord> getById(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                exchangeService.getById(id)
        );
    }

    @GetMapping("/return/{returnId}")
    public ResponseEntity<List<ExchangeRecord>> getByReturn(
            @PathVariable UUID returnId
    ) {
        return ResponseEntity.ok(
                exchangeService.getByReturn(returnId)
        );
    }

    @PutMapping("/{id}/dispatch")
    public ResponseEntity<ExchangeRecord> updateDispatched(
            @PathVariable UUID id,
            @RequestParam boolean dispatched
    ) {
        return ResponseEntity.ok(
                exchangeService.updateDispatched(id, dispatched)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(
            @PathVariable UUID id
    ) {
        exchangeService.delete(id);

        return ResponseEntity.ok(
                "Exchange record deleted successfully"
        );
    }
}