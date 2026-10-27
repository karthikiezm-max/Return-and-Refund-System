package com.rrps.service;

import com.rrps.entity.ReturnPolicy;
import com.rrps.exception.NonReturnableItemException;
import com.rrps.exception.ReturnWindowClosedException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class ReturnPolicyValidator {

    public void validateReturnWindow(
            ReturnPolicy policy,
            LocalDate deliveredDate,
            boolean supportOverride
    ) {

        if (policy == null) {
            throw new RuntimeException("Return policy is required");
        }

        if (deliveredDate == null) {
            throw new RuntimeException("Order delivery date is required");
        }

        if (policy.getReturnWindowDays() == null ||
                policy.getReturnWindowDays() < 0) {

            throw new RuntimeException(
                    "Invalid return window configuration"
            );
        }

        long daysSinceDelivery =
                ChronoUnit.DAYS.between(
                        deliveredDate,
                        LocalDate.now()
                );

        int allowedDays = policy.getReturnWindowDays();

        // SRS: support override can extend the window by maximum 7 days
        if (supportOverride) {
            allowedDays += 7;
        }

        if (daysSinceDelivery > allowedDays) {
            throw new ReturnWindowClosedException(
                    "Return window has expired. Allowed window: "
                            + allowedDays + " days"
            );
        }
    }

    public void validateSkuReturnable(
            ReturnPolicy policy,
            UUID skuId
    ) {

        if (policy == null || skuId == null) {
            return;
        }

        if (policy.getNonReturnableSkus() != null &&
                policy.getNonReturnableSkus().contains(skuId)) {

            throw new NonReturnableItemException(
                    "SKU is not eligible for return: " + skuId
            );
        }
    }
}