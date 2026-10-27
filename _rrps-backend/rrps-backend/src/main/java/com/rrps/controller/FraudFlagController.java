package com.rrps.controller;

import com.rrps.entity.FraudFlag;
import com.rrps.enums.FraudFlagStatus;
import com.rrps.service.FraudFlagService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.UUID;

@RestController
@PreAuthorize("hasAnyRole('FINANCE', 'CUSTOMER_SUPPORT', 'ADMIN')")
@RequestMapping("/api/v1/fraud")
@CrossOrigin(origins = "http://localhost:8081")
public class FraudFlagController {

    private final FraudFlagService fraudFlagService;

    public FraudFlagController(FraudFlagService fraudFlagService) {
        this.fraudFlagService = fraudFlagService;
    }

    @GetMapping
    public ResponseEntity<List<FraudFlag>> getAll() {
        return ResponseEntity.ok(
                fraudFlagService.getAll()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<FraudFlag> getById(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                fraudFlagService.getById(id)
        );
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<FraudFlag>> getByStatus(
            @PathVariable FraudFlagStatus status
    ) {
        return ResponseEntity.ok(
                fraudFlagService.getByStatus(status)
        );
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<FraudFlag>> getByCustomerId(
            @PathVariable UUID customerId
    ) {
        return ResponseEntity.ok(
                fraudFlagService.getByCustomerId(customerId)
        );
    }

    @GetMapping("/return/{returnId}")
    public ResponseEntity<List<FraudFlag>> getByReturnId(
            @PathVariable UUID returnId
    ) {
        return ResponseEntity.ok(
                fraudFlagService.getByReturnId(returnId)
        );
    }

    @PostMapping
    public ResponseEntity<FraudFlag> create(
            @RequestBody FraudFlag fraudFlag
    ) {
        return ResponseEntity.ok(
                fraudFlagService.create(fraudFlag)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<FraudFlag> update(
            @PathVariable UUID id,
            @RequestBody FraudFlag fraudFlag
    ) {
        return ResponseEntity.ok(
                fraudFlagService.update(id, fraudFlag)
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<FraudFlag> updateStatus(
            @PathVariable UUID id,
            @RequestParam FraudFlagStatus status
    ) {
        return ResponseEntity.ok(
                fraudFlagService.updateStatus(id, status)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id
    ) {
        fraudFlagService.delete(id);

        return ResponseEntity.noContent().build();
    }
}