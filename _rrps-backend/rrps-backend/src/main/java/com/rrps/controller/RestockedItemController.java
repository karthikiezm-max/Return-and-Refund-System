package com.rrps.controller;

import com.rrps.dto.RestockedItemRequest;
import com.rrps.entity.RestockedItem;
import com.rrps.service.RestockedItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.UUID;

@RestController
@PreAuthorize("hasAnyRole('ADMIN')")
@RequestMapping("/api/v1/restocked-items")
@CrossOrigin(origins = "http://localhost:8081")
public class RestockedItemController {

    private final RestockedItemService service;

    public RestockedItemController(
            RestockedItemService service
    ) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<RestockedItem> create(
            @RequestBody RestockedItemRequest request
    ) {
        return ResponseEntity.ok(
                service.create(request)
        );
    }

    @GetMapping
    public ResponseEntity<List<RestockedItem>> getAll() {
        return ResponseEntity.ok(
                service.getAll()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestockedItem> getById(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                service.getById(id)
        );
    }

    @GetMapping("/qc/{qcId}")
    public ResponseEntity<List<RestockedItem>> getByQcId(
            @PathVariable UUID qcId
    ) {
        return ResponseEntity.ok(
                service.getByQcId(qcId)
        );
    }

    @GetMapping("/sku/{skuId}")
    public ResponseEntity<List<RestockedItem>> getBySkuId(
            @PathVariable UUID skuId
    ) {
        return ResponseEntity.ok(
                service.getBySkuId(skuId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<RestockedItem> update(
            @PathVariable UUID id,
            @RequestBody RestockedItemRequest request
    ) {
        return ResponseEntity.ok(
                service.update(id, request)
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