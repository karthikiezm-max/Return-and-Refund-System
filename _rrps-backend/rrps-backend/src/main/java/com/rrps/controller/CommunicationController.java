package com.rrps.controller;

import com.rrps.dto.ReturnCommunicationRequest;
import com.rrps.entity.ReturnCommunication;
import com.rrps.enums.CommunicationStatus;
import com.rrps.service.ReturnCommunicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.UUID;

@RestController
@PreAuthorize("hasAnyRole('ADMIN')")
@RequestMapping("/api/v1/communications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:8081")
public class CommunicationController {

    private final ReturnCommunicationService communicationService;

    @PostMapping
    public ResponseEntity<ReturnCommunication> create(
            @RequestBody ReturnCommunicationRequest request
    ) {
        return ResponseEntity.ok(
                communicationService.create(request)
        );
    }

    @GetMapping
    public ResponseEntity<List<ReturnCommunication>> getAll() {
        return ResponseEntity.ok(
                communicationService.getAll()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReturnCommunication> getById(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                communicationService.getById(id)
        );
    }

    @GetMapping("/return/{returnId}")
    public ResponseEntity<List<ReturnCommunication>> getByReturn(
            @PathVariable UUID returnId
    ) {
        return ResponseEntity.ok(
                communicationService.getByReturn(returnId)
        );
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ReturnCommunication>> getByStatus(
            @PathVariable CommunicationStatus status
    ) {
        return ResponseEntity.ok(
                communicationService.getByStatus(status)
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ReturnCommunication> updateStatus(
            @PathVariable UUID id,
            @RequestParam CommunicationStatus status
    ) {
        return ResponseEntity.ok(
                communicationService.updateStatus(id, status)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(
            @PathVariable UUID id
    ) {
        communicationService.delete(id);

        return ResponseEntity.ok(
                "Communication deleted successfully"
        );
    }
}