package com.rrps.service;

import com.rrps.entity.Pickup;
import com.rrps.entity.ReturnRequest;
import com.rrps.enums.PickupStatus;
import com.rrps.repository.PickupRepository;
import com.rrps.repository.ReturnRequestRepository;
import com.rrps.exception.PickupValidationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
public class PickupService {

    private final PickupRepository pickupRepository;
    private final ReturnRequestRepository returnRequestRepository;

    public PickupService(
            PickupRepository pickupRepository,
            ReturnRequestRepository returnRequestRepository
    ) {
        this.pickupRepository = pickupRepository;
        this.returnRequestRepository = returnRequestRepository;
    }

    public List<Pickup> getAll() {
        return pickupRepository.findAll();
    }

    public Pickup getById(UUID id) {
        return pickupRepository.findById(id)
                .orElseThrow(() ->
                        new PickupValidationException(
                                "Pickup not found with id: " + id
                        )
                );
    }

    public Pickup getByReturnId(UUID returnId) {
        return pickupRepository.findByReturnRequestReturnId(returnId)
                .orElseThrow(() ->
                        new PickupValidationException(
                                "Pickup not found for return: " + returnId
                        )
                );
    }

    @Transactional
    public Pickup create(UUID returnId, Pickup pickup) {

        ReturnRequest returnRequest = returnRequestRepository.findById(returnId)
                .orElseThrow(() ->
                        new PickupValidationException(
                                "Return request not found with id: " + returnId
                        )
                );

        if (pickupRepository.existsByReturnRequestReturnId(returnId)) {
            throw new PickupValidationException(
                    "Pickup already exists for return: " + returnId
            );
        }

        if (pickup.getLogisticsPartner() == null) {
            throw new PickupValidationException(
                    "Logistics partner is required"
            );
        }

        if (pickup.getPickupDate() == null) {
            pickup.setPickupDate(LocalDate.now());
        }

        if (pickup.getPickupSlot() == null) {
            pickup.setPickupSlot(LocalTime.of(10, 0));
        }

        if (pickup.getStatus() == null) {
            pickup.setStatus(PickupStatus.SCHEDULED);
        }

        if (pickup.getRescheduleCount() == null) {
            pickup.setRescheduleCount(0);
        }

        pickup.setReturnRequest(returnRequest);

        Pickup saved = pickupRepository.save(pickup);

        returnRequest.setStatus(
                com.rrps.enums.ReturnStatus.PICKUP_SCHEDULED
        );

        returnRequestRepository.save(returnRequest);

        return saved;
    }

    @Transactional
    public Pickup reschedule(
            UUID returnId,
            LocalDate pickupDate,
            LocalTime pickupSlot
    ) {

        Pickup pickup = getByReturnId(returnId);

        int count = pickup.getRescheduleCount() == null
                ? 0
                : pickup.getRescheduleCount();

        if (count >= 2) {
            throw new PickupValidationException(
                    "Pickup can only be rescheduled a maximum of 2 times"
            );
        }

        if (pickupDate == null) {
            throw new PickupValidationException(
                    "Pickup date is required"
            );
        }

        if (pickupSlot == null) {
            throw new PickupValidationException(
                    "Pickup slot is required"
            );
        }

        pickup.setPickupDate(pickupDate);
        pickup.setPickupSlot(pickupSlot);
        pickup.setRescheduleCount(count + 1);
        pickup.setStatus(PickupStatus.SCHEDULED);

        return pickupRepository.save(pickup);
    }

    @Transactional
    public Pickup updateStatus(
            UUID pickupId,
            PickupStatus status
    ) {

        Pickup pickup = getById(pickupId);

        if (status == null) {
            throw new PickupValidationException(
                    "Pickup status is required"
            );
        }

        pickup.setStatus(status);

        Pickup saved = pickupRepository.save(pickup);

        ReturnRequest returnRequest = pickup.getReturnRequest();

        if (returnRequest != null) {

            switch (status) {

                case PICKED_UP:
                case IN_TRANSIT:
                    returnRequest.setStatus(
                            com.rrps.enums.ReturnStatus.IN_TRANSIT
                    );
                    break;

                case DELIVERED_TO_WAREHOUSE:
                    returnRequest.setStatus(
                            com.rrps.enums.ReturnStatus.RECEIVED
                    );
                    break;

                default:
                    break;
            }

            returnRequestRepository.save(returnRequest);
        }

        return saved;
    }

    public void delete(UUID id) {

        if (!pickupRepository.existsById(id)) {
            throw new PickupValidationException(
                    "Pickup not found with id: " + id
            );
        }

        pickupRepository.deleteById(id);
    }
}