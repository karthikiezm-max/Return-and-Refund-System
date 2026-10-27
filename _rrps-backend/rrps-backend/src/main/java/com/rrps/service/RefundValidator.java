package com.rrps.service;

import com.rrps.entity.Refund;
import com.rrps.entity.ReturnRequest;
import com.rrps.enums.ReturnStatus;
import com.rrps.exception.RefundValidationException;
import org.springframework.stereotype.Component;

@Component
public class RefundValidator {

    public void validate(
            Refund refund,
            ReturnRequest returnRequest) {

        if (refund == null) {
            throw new RefundValidationException(
                    "Refund is required"
            );
        }

        if (returnRequest == null) {
            throw new RefundValidationException(
                    "Return request is required"
            );
        }

        if (returnRequest.getStatus() != ReturnStatus.QC_DONE) {
            throw new RefundValidationException(
                    "Refund cannot be processed before QC is completed"
            );
        }

        if (refund.getAmount() == null) {
            throw new RefundValidationException(
                    "Refund amount is required"
            );
        }

        if (refund.getAmount().signum() <= 0) {
            throw new RefundValidationException(
                    "Refund amount must be greater than zero"
            );
        }

        if (returnRequest.getOrder() == null ||
                returnRequest.getOrder().getTotalAmount() == null) {

            throw new RefundValidationException(
                    "Original payment amount is unavailable"
            );
        }

        if (refund.getAmount().compareTo(
                returnRequest.getOrder().getTotalAmount()) > 0) {

            throw new RefundValidationException(
                    "Refund amount cannot exceed original payment amount"
            );
        }

        if (refund.getMethod() == null) {
            throw new RefundValidationException(
                    "Refund method is required"
            );
        }
    }
}