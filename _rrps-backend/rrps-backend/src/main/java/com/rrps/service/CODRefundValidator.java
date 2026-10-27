package com.rrps.service;

import com.rrps.entity.Order;
import com.rrps.entity.Refund;
import com.rrps.enums.RefundMethod;
import org.springframework.stereotype.Service;

@Service
public class CODRefundValidator {

    public void validate(
            Order order,
            Refund refund
    ) {

        if (order == null) {
            throw new RuntimeException(
                    "Order is required for refund validation"
            );
        }

        if (refund == null) {
            throw new RuntimeException(
                    "Refund is required"
            );
        }

        if (!"COD".equalsIgnoreCase(order.getPaymentMethod())) {
            return;
        }

        if (refund.getMethod() == null) {
            throw new RuntimeException(
                    "Refund method is required for COD orders"
            );
        }

        /*
         * COD orders cannot automatically return money
         * to an original online payment method.
         */
        if (refund.getMethod() == RefundMethod.ORIGINAL) {
            throw new RuntimeException(
                    "COD refunds require BANK_TRANSFER or STORE_CREDIT"
            );
        }

        /*
         * For BANK_TRANSFER, bank details are required.
         *
         * The current Refund entity does not contain a dedicated
         * bank-details field. Therefore this validation will be
         * expanded when the refund DTO/data model is enhanced.
         */
        if (refund.getMethod() == RefundMethod.BANK_TRANSFER) {

            if (refund.getFailureReason() == null ||
                    refund.getFailureReason().isBlank()) {

                throw new RuntimeException(
                        "Bank details are required for COD bank transfer refund"
                );
            }
        }
    }
}