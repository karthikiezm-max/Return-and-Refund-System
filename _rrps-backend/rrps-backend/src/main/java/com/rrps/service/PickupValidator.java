package com.rrps.service;

import com.rrps.entity.Pickup;
import org.springframework.stereotype.Component;

@Component
public class PickupValidator {

    public void validate(Pickup pickup) {

        if (pickup == null) {
            throw new com.rrps.exception.PickupValidationException(
                    "Pickup is required"
            );
        }

        if (pickup.getReturnRequest() == null ||
                pickup.getReturnRequest().getReturnId() == null) {

            throw new com.rrps.exception.PickupValidationException(
                    "Return request is required"
            );
        }

        if (pickup.getLogisticsPartner() == null) {
            throw new com.rrps.exception.PickupValidationException(
                    "Logistics partner is required"
            );
        }

        if (pickup.getPickupDate() == null) {
            throw new com.rrps.exception.PickupValidationException(
                    "Pickup date is required"
            );
        }

        if (pickup.getPickupSlot() == null) {
            throw new com.rrps.exception.PickupValidationException(
                    "Pickup slot is required"
            );
        }

        if (pickup.getStatus() == null) {
            throw new com.rrps.exception.PickupValidationException(
                    "Pickup status is required"
            );
        }

        if (pickup.getRescheduleCount() == null) {
            pickup.setRescheduleCount(0);
        }

        if (pickup.getRescheduleCount() < 0 ||
                pickup.getRescheduleCount() > 2) {

            throw new com.rrps.exception.PickupValidationException(
                    "Pickup can be rescheduled a maximum of 2 times"
            );
        }
    }
}