package com.rrps.service;

import com.rrps.entity.RestockedItem;
import com.rrps.enums.Disposition;
import com.rrps.exception.RestockValidationException;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class RestockValidator {

    public void validate(RestockedItem item) {

        if (item == null) {
            throw new RestockValidationException(
                    "Restocked item is required"
            );
        }

        if (item.getQcInspection() == null) {
            throw new RestockValidationException(
                    "QC inspection is required"
            );
        }

        if (item.getSku() == null) {
            throw new RestockValidationException(
                    "SKU is required"
            );
        }

        if (item.getQuantity() == null ||
                item.getQuantity() <= 0) {

            throw new RestockValidationException(
                    "Restock quantity must be greater than zero"
            );
        }

        if (item.getRestockType() == null) {
            throw new RestockValidationException(
                    "Restock type is required"
            );
        }

        Disposition disposition =
                item.getQcInspection().getDisposition();

        if (disposition != Disposition.RESTOCK_NEW &&
                disposition != Disposition.RESTOCK_REFURB) {

            throw new RestockValidationException(
                    "QC disposition does not allow restocking"
            );
        }

        if (disposition == Disposition.RESTOCK_NEW &&
                item.getRestockType().name()
                        .equals("REFURBISHED")) {

            throw new RestockValidationException(
                    "RESTOCK_NEW disposition requires NEW restock type"
            );
        }

        if (disposition == Disposition.RESTOCK_REFURB &&
                item.getRestockType().name()
                        .equals("NEW")) {

            throw new RestockValidationException(
                    "RESTOCK_REFURB disposition requires REFURBISHED restock type"
            );
        }

        BigDecimal listingPrice =
                item.getNewListingPrice();

        if (listingPrice != null &&
                listingPrice.compareTo(
                        BigDecimal.ZERO
                ) < 0) {

            throw new RestockValidationException(
                    "New listing price cannot be negative"
            );
        }
    }
}