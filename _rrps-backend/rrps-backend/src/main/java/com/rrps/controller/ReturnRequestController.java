package com.rrps.controller;

import com.rrps.entity.ReturnRequest;
import com.rrps.enums.ReturnStatus;
import com.rrps.service.FraudFlagService;
import com.rrps.service.ReturnRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.UUID;

@RestController
@PreAuthorize("hasAnyRole('CUSTOMER', 'CUSTOMER_SUPPORT', 'WAREHOUSE_QC', 'FINANCE', 'SUPPLIER_MANAGER', 'ADMIN')")
@RequestMapping("/api/v1/returns")
@CrossOrigin(origins = "http://localhost:8081")
public class ReturnRequestController {

    private final ReturnRequestService returnRequestService;
    private final FraudFlagService fraudFlagService;

    public ReturnRequestController(
            ReturnRequestService returnRequestService,
            FraudFlagService fraudFlagService) {

        this.returnRequestService = returnRequestService;
        this.fraudFlagService = fraudFlagService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<ReturnRequest> createReturn(
            @RequestBody java.util.Map<String, Object> body) {

        return ResponseEntity.ok(
                returnRequestService.createFromMap(body)
        );
    }

    // READ - ALL
    @GetMapping
    public ResponseEntity<List<ReturnRequest>> getAllReturns() {

        return ResponseEntity.ok(
                returnRequestService.getAllReturnRequests()
        );
    }

    // FRAUD QUEUE
    // IMPORTANT: This must be before /{id}
    @GetMapping("/fraud-queue")
    public ResponseEntity<?> getFraudQueue() {

        return ResponseEntity.ok(
                fraudFlagService.getFraudQueue()
        );
    }

    // READ - ONE
    @GetMapping("/{id}")
    public ResponseEntity<ReturnRequest> getReturnById(
            @PathVariable UUID id) {

        return ResponseEntity.ok(
                returnRequestService.getReturnRequestById(id)
        );
    }

    // READ - BY CUSTOMER
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<ReturnRequest>> getByCustomer(
            @PathVariable UUID customerId) {

        return ResponseEntity.ok(
                returnRequestService.getByCustomer(customerId)
        );
    }

    // READ - BY ORDER
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<ReturnRequest>> getByOrder(
            @PathVariable UUID orderId) {

        return ResponseEntity.ok(
                returnRequestService.getByOrder(orderId)
        );
    }

    // READ - BY STATUS
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ReturnRequest>> getByStatus(
            @PathVariable ReturnStatus status) {

        return ResponseEntity.ok(
                returnRequestService.getByStatus(status)
        );
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<ReturnRequest> updateReturn(
            @PathVariable UUID id,
            @RequestBody ReturnRequest request) {

        return ResponseEntity.ok(
                returnRequestService.updateReturnRequest(id, request)
        );
    }

    // CANCEL
    @PutMapping("/{id}/cancel")
    public ResponseEntity<ReturnRequest> cancelReturn(
            @PathVariable UUID id) {

        return ResponseEntity.ok(
                returnRequestService.cancelReturnRequest(id)
        );
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReturn(
            @PathVariable UUID id) {

        returnRequestService.deleteReturnRequest(id);

        return ResponseEntity.noContent().build();
    }
}