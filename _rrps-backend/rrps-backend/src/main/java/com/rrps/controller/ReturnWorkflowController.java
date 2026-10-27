package com.rrps.controller;

import com.rrps.entity.ReturnRequest;
import com.rrps.enums.ReturnStatus;
import com.rrps.service.ReturnWorkflowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.UUID;

@RestController
@PreAuthorize("hasAnyRole('CUSTOMER_SUPPORT', 'ADMIN')")
@RequestMapping("/api/v1/returns")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:8081")
public class ReturnWorkflowController {

    private final ReturnWorkflowService returnWorkflowService;

    @PutMapping("/{returnId}/status")
    public ResponseEntity<ReturnRequest> updateStatus(
            @PathVariable UUID returnId,
            @RequestParam ReturnStatus status
    ) {

        return ResponseEntity.ok(
                returnWorkflowService.updateStatus(
                        returnId,
                        status
                )
        );
    }
}