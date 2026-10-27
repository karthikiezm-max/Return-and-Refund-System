package com.rrps.controller;

import com.rrps.entity.QCInspection;
import com.rrps.service.QCInspectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.UUID;

@RestController
@PreAuthorize("hasAnyRole('WAREHOUSE_QC', 'ADMIN')")
@RequestMapping("/api/v1/qc")
@CrossOrigin(origins = "http://localhost:8081")
public class QCInspectionController {

    private final QCInspectionService qcInspectionService;

    public QCInspectionController(QCInspectionService qcInspectionService) {
        this.qcInspectionService = qcInspectionService;
    }

    @GetMapping
    public ResponseEntity<List<QCInspection>> getAll() {
        return ResponseEntity.ok(qcInspectionService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<QCInspection> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(qcInspectionService.getById(id));
    }

    @GetMapping("/return/{returnId}")
    public ResponseEntity<QCInspection> getByReturnId(@PathVariable UUID returnId) {
        return ResponseEntity.ok(qcInspectionService.getByReturnId(returnId));
    }

    @PostMapping
    public ResponseEntity<QCInspection> create(@RequestBody java.util.Map<String, Object> body) {
        return ResponseEntity.ok(qcInspectionService.createFromMap(body));
    }

    @PutMapping("/{id}")
    public ResponseEntity<QCInspection> update(@PathVariable UUID id, @RequestBody QCInspection qcInspection) {
        return ResponseEntity.ok(qcInspectionService.update(id, qcInspection));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        qcInspectionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
