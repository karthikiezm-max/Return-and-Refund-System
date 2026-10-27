package com.rrps.service;

import com.rrps.dto.CommunicationEventRequest;
import com.rrps.dto.ReturnCommunicationRequest;
import com.rrps.entity.ReturnCommunication;
import com.rrps.enums.CommunicationStatus;
import org.springframework.stereotype.Service;

@Service
public class CommunicationEventService {

    private final ReturnCommunicationService communicationService;

    public CommunicationEventService(
            ReturnCommunicationService communicationService
    ) {
        this.communicationService =
                communicationService;
    }

    public ReturnCommunication recordEvent(
            CommunicationEventRequest request
    ) {

        if (request == null) {
            throw new RuntimeException(
                    "Communication event request is required"
            );
        }

        ReturnCommunicationRequest communicationRequest =
                new ReturnCommunicationRequest();

        communicationRequest.setReturnId(
                request.getReturnId()
        );

        communicationRequest.setEventType(
                request.getEventType()
        );

        communicationRequest.setChannel(
                request.getChannel()
        );

        communicationRequest.setStatus(
                CommunicationStatus.SENT
        );

        return communicationService.create(
                communicationRequest
        );
    }
}