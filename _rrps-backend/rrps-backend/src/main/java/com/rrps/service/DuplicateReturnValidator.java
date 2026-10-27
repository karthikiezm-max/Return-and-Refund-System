package com.rrps.service;

import com.rrps.entity.ReturnRequest;
import com.rrps.enums.ReturnStatus;
import com.rrps.exception.DuplicateReturnException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DuplicateReturnValidator {

    public void validate(List<ReturnRequest> existingReturns) {

        if (existingReturns == null) {
            return;
        }

        boolean activeReturn = existingReturns.stream()
                .anyMatch(returnRequest ->
                        returnRequest.getStatus() != ReturnStatus.CANCELLED
                                && returnRequest.getStatus() != ReturnStatus.REFUNDED
                                && returnRequest.getStatus() != ReturnStatus.CLOSED
                );

        if (activeReturn) {
            throw new DuplicateReturnException(
                    "An active return already exists for this order"
            );
        }
    }
}