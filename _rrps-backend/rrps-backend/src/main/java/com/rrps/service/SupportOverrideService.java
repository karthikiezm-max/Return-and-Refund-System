package com.rrps.service;

import com.rrps.dto.SupportOverrideRequest;
import com.rrps.entity.ReturnRequest;
import com.rrps.exception.SupportOverrideException;
import com.rrps.repository.ReturnRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class SupportOverrideService {

    private final ReturnRequestRepository returnRequestRepository;
    private final SupportOverrideValidator supportOverrideValidator;

    public SupportOverrideService(
            ReturnRequestRepository returnRequestRepository,
            SupportOverrideValidator supportOverrideValidator) {

        this.returnRequestRepository = returnRequestRepository;
        this.supportOverrideValidator = supportOverrideValidator;
    }

    @Transactional
    public ReturnRequest applyOverride(
            UUID returnId,
            SupportOverrideRequest request) {

        if (request == null) {
            throw new SupportOverrideException(
                    "Support override request is required"
            );
        }

        if (!Boolean.TRUE.equals(request.getSupportOverride())) {
            throw new SupportOverrideException(
                    "Support override must be enabled"
            );
        }

        ReturnRequest returnRequest =
                returnRequestRepository.findById(returnId)
                        .orElseThrow(() ->
                                new SupportOverrideException(
                                        "Return request not found: "
                                                + returnId
                                ));

        supportOverrideValidator.validate(
                returnRequest,
                request.getReason()
        );

        returnRequest.setSupportOverride(true);

        return returnRequestRepository.save(returnRequest);
    }
}