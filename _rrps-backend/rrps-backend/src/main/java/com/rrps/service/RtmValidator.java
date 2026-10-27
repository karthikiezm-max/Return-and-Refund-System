package com.rrps.service;

import com.rrps.entity.RtmBatch;
import com.rrps.exception.RtmValidationException;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class RtmValidator {

    public void validate(RtmBatch batch) {

        if (batch == null) {
            throw new RtmValidationException(
                    "RTM batch is required"
            );
        }

        if (batch.getSupplier() == null ||
                batch.getSupplier().getSupplierId() == null) {

            throw new RtmValidationException(
                    "Supplier is required"
            );
        }

        if (batch.getItems() == null ||
                batch.getItems().isBlank()) {

            throw new RtmValidationException(
                    "RTM items are required"
            );
        }

        BigDecimal creditNoteValue =
                batch.getCreditNoteValue();

        if (creditNoteValue != null &&
                creditNoteValue.compareTo(
                        BigDecimal.ZERO
                ) < 0) {

            throw new RtmValidationException(
                    "Credit note value cannot be negative"
            );
        }

        if (batch.getStatus() == null) {
            throw new RtmValidationException(
                    "RTM status is required"
            );
        }
    }
}