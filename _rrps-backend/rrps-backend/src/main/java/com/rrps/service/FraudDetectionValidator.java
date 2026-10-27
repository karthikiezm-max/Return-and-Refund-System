package com.rrps.service;

import com.rrps.entity.ReturnRequest;
import org.springframework.stereotype.Component;

@Component
public class FraudDetectionValidator {

    public void validate(ReturnRequest returnRequest) {

        if (returnRequest == null) {
            throw new IllegalArgumentException(
                    "Return request is required for fraud detection"
            );
        }

        if (returnRequest.getCustomer() == null) {
            throw new IllegalArgumentException(
                    "Customer is required for fraud detection"
            );
        }

        if (returnRequest.getReturnId() == null) {
            throw new IllegalArgumentException(
                    "Return ID is required for fraud detection"
            );
        }
    }
}