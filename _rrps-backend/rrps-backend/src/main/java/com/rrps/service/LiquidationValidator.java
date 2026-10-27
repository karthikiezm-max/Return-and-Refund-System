package com.rrps.service;

import com.rrps.entity.LiquidationBatch;
import com.rrps.exception.LiquidationValidationException;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class LiquidationValidator {

    public void validate(
            LiquidationBatch batch
    ) {

        if (batch == null) {
            throw new LiquidationValidationException(
                    "Liquidation batch is required"
            );
        }

        if (batch.getPartnerName() == null ||
                batch.getPartnerName().isBlank()) {

            throw new LiquidationValidationException(
                    "Liquidation partner name is required"
            );
        }

        if (batch.getItems() == null ||
                batch.getItems().isBlank()) {

            throw new LiquidationValidationException(
                    "Liquidation items are required"
            );
        }

        if (batch.getBatchDate() == null) {
            throw new LiquidationValidationException(
                    "Batch date is required"
            );
        }

        BigDecimal payoutAmount =
                batch.getPayoutAmount();

        if (payoutAmount != null &&
                payoutAmount.compareTo(
                        BigDecimal.ZERO
                ) < 0) {

            throw new LiquidationValidationException(
                    "Payout amount cannot be negative"
            );
        }

        if (batch.getStatus() == null) {
            throw new LiquidationValidationException(
                    "Liquidation status is required"
            );
        }
    }
}