package com.rrps.controller;

import com.rrps.entity.ReturnCommunication;
import com.rrps.enums.CommunicationChannel;
import com.rrps.enums.ReturnEventType;
import com.rrps.service.ReturnLifecycleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.UUID;

@RestController
@PreAuthorize("hasAnyRole('CUSTOMER_SUPPORT', 'ADMIN')")
@RequestMapping("/api/v1/returns")
@CrossOrigin(origins = "http://localhost:8081")
public class ReturnLifecycleController {

    private final ReturnLifecycleService lifecycleService;

    public ReturnLifecycleController(
            ReturnLifecycleService lifecycleService
    ) {
        this.lifecycleService = lifecycleService;
    }

    @PostMapping("/{returnId}/communication")
    public ResponseEntity<ReturnCommunication> recordEvent(
            @PathVariable UUID returnId,
            @RequestParam ReturnEventType eventType,
            @RequestParam CommunicationChannel channel
    ) {

        return ResponseEntity.ok(
                lifecycleService.recordEvent(
                        returnId,
                        eventType,
                        channel
                )
        );
    }
}