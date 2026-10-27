package com.rrps.controller;

import com.rrps.entity.Pickup;
import com.rrps.enums.PickupStatus;
import com.rrps.service.PickupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@PreAuthorize("hasAnyRole('CUSTOMER', 'CUSTOMER_SUPPORT', 'WAREHOUSE_QC', 'FINANCE', 'ADMIN')")
@RequestMapping("/api/v1/pickups")
@CrossOrigin(origins = "http://localhost:8081")
public class PickupController {

    private final PickupService pickupService;

    public PickupController(PickupService pickupService) {
        this.pickupService = pickupService;
    }

    @GetMapping
    public ResponseEntity<List<Pickup>> getAll() {
        return ResponseEntity.ok(
                pickupService.getAll()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pickup> getById(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                pickupService.getById(id)
        );
    }

    @GetMapping("/return/{returnId}")
    public ResponseEntity<Pickup> getByReturnId(
            @PathVariable UUID returnId
    ) {
        return ResponseEntity.ok(
                pickupService.getByReturnId(returnId)
        );
    }

    @PostMapping("/{returnId}")
    public ResponseEntity<Pickup> create(
            @PathVariable UUID returnId,
            @RequestBody Pickup pickup
    ) {
        return ResponseEntity.ok(
                pickupService.create(returnId, pickup)
        );
    }

    @PutMapping("/{id}/reschedule")
    public ResponseEntity<Pickup> rescheduleById(
            @PathVariable UUID id,
            @RequestBody Map<String, Object> body
    ) {
        LocalDate date = LocalDate.now().plusDays(1);
        if (body.containsKey("pickupDate")) {
            try { date = LocalDate.parse(String.valueOf(body.get("pickupDate")).substring(0, 10)); } catch (Exception e) {}
        }
        LocalTime slot = LocalTime.of(10, 0);
        if (body.containsKey("pickupSlot")) {
            String slotStr = String.valueOf(body.get("pickupSlot"));
            if (slotStr.contains("Morning")) slot = LocalTime.of(9, 0);
            else if (slotStr.contains("Afternoon")) slot = LocalTime.of(14, 0);
            else if (slotStr.contains("Evening")) slot = LocalTime.of(18, 0);
            else {
                try { slot = LocalTime.parse(slotStr.substring(0, 5)); } catch (Exception e) {}
            }
        }
        return ResponseEntity.ok(
                pickupService.reschedule(
                        id,
                        date,
                        slot
                )
        );
    }

    @PutMapping("/return/{returnId}/reschedule")
    public ResponseEntity<Pickup> reschedule(
            @PathVariable UUID returnId,
            @RequestParam LocalDate pickupDate,
            @RequestParam LocalTime pickupSlot
    ) {
        return ResponseEntity.ok(
                pickupService.reschedule(
                        returnId,
                        pickupDate,
                        pickupSlot
                )
        );
    }

    @PutMapping("/{pickupId}/status")
    public ResponseEntity<Pickup> updateStatus(
            @PathVariable UUID pickupId,
            @RequestParam PickupStatus status
    ) {
        return ResponseEntity.ok(
                pickupService.updateStatus(
                        pickupId,
                        status
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id
    ) {
        pickupService.delete(id);

        return ResponseEntity.noContent().build();
    }
}