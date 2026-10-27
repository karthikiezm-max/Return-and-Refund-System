package com.rrps.controller;

import com.rrps.dto.SupportOverrideRequest;
import com.rrps.entity.ReturnRequest;
import com.rrps.service.SupportOverrideService;
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
public class SupportOverrideController {

    private final SupportOverrideService supportOverrideService;

    @PutMapping("/{returnId}/support-override")
    public ResponseEntity<ReturnRequest> applyOverride(
            @PathVariable UUID returnId,
            @RequestBody SupportOverrideRequest request
    ) {

        return ResponseEntity.ok(
                supportOverrideService.applyOverride(
                        returnId,
                        request
                )
        );
    }
}