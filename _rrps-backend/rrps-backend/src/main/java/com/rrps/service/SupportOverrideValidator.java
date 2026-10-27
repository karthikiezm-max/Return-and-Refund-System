package com.rrps.service;

import com.rrps.entity.ReturnRequest;
import com.rrps.exception.SupportOverrideException;
import org.springframework.stereotype.Component;

@Component
public class SupportOverrideValidator {

    public void validate(
            ReturnRequest returnRequest,
            String reason) {

        if (returnRequest == null) {
            throw new SupportOverrideException(
                    "Return request is required"
            );
        }

        if (reason == null || reason.isBlank()) {
            throw new SupportOverrideException(
                    "Support override reason is required"
            );
        }

        if (Boolean.TRUE.equals(returnRequest.getSupportOverride())) {
            throw new SupportOverrideException(
                    "Support override has already been applied"
            );
        }
    }
}