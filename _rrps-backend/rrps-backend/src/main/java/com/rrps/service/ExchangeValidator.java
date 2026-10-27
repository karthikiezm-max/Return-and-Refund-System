package com.rrps.service;

import com.rrps.entity.ReturnRequest;
import com.rrps.enums.ReturnStatus;
import com.rrps.exception.ExchangeValidationException;
import org.springframework.stereotype.Component;

@Component
public class ExchangeValidator {

    public void validate(ReturnRequest returnRequest) {

        if (returnRequest == null) {
            throw new ExchangeValidationException(
                    "Return request is required"
            );
        }

        if (returnRequest.getReturnType() == null ||
                !returnRequest.getReturnType().name().equals("EXCHANGE")) {

            throw new ExchangeValidationException(
                    "Return request is not an exchange request"
            );
        }

        ReturnStatus status = returnRequest.getStatus();

        if (status == ReturnStatus.CANCELLED ||
                status == ReturnStatus.CLOSED ||
                status == ReturnStatus.REFUNDED) {

            throw new ExchangeValidationException(
                    "Exchange cannot be processed for a completed or cancelled return"
            );
        }
    }
}