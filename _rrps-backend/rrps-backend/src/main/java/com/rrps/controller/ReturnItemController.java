package com.rrps.controller;

import com.rrps.entity.ReturnItem;
import com.rrps.service.ReturnItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.UUID;

@RestController
@PreAuthorize("hasAnyRole('ADMIN')")
@RequestMapping("/api/v1/return-items")
@CrossOrigin(origins = "http://localhost:8081")
public class ReturnItemController {

    private final ReturnItemService returnItemService;

    public ReturnItemController(ReturnItemService returnItemService) {
        this.returnItemService = returnItemService;
    }

    @GetMapping
    public ResponseEntity<List<ReturnItem>> getAll() {
        return ResponseEntity.ok(
                returnItemService.getAll()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReturnItem> getById(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                returnItemService.getById(id)
        );
    }

    @GetMapping("/return/{returnId}")
    public ResponseEntity<List<ReturnItem>> getByReturnId(
            @PathVariable UUID returnId
    ) {
        return ResponseEntity.ok(
                returnItemService.getByReturnId(returnId)
        );
    }

    @GetMapping("/sku/{skuId}")
    public ResponseEntity<List<ReturnItem>> getBySkuId(
            @PathVariable UUID skuId
    ) {
        return ResponseEntity.ok(
                returnItemService.getBySkuId(skuId)
        );
    }

    @PostMapping
    public ResponseEntity<ReturnItem> create(
            @RequestBody ReturnItem returnItem
    ) {
        return ResponseEntity.ok(
                returnItemService.create(returnItem)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReturnItem> update(
            @PathVariable UUID id,
            @RequestBody ReturnItem returnItem
    ) {
        return ResponseEntity.ok(
                returnItemService.update(id, returnItem)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id
    ) {
        returnItemService.delete(id);

        return ResponseEntity.noContent().build();
    }
}