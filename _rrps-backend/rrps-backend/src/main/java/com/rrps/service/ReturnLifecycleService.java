package com.rrps.service;

import com.rrps.entity.ReturnCommunication;
import com.rrps.enums.CommunicationChannel;
import com.rrps.enums.ReturnEventType;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ReturnLifecycleService {

    private final CommunicationEventService eventService;

    public ReturnLifecycleService(
            CommunicationEventService eventService
    ) {
        this.eventService = eventService;
    }

    public ReturnCommunication recordEvent(
            UUID returnId,
            ReturnEventType eventType,
            CommunicationChannel channel
    ) {

        if (returnId == null) {
            throw new RuntimeException(
                    "Return ID is required"
            );
        }

        if (eventType == null) {
            throw new RuntimeException(
                    "Return event type is required"
            );
        }

        if (channel == null) {
            throw new RuntimeException(
                    "Communication channel is required"
            );
        }

        var request =
                new com.rrps.dto.CommunicationEventRequest();

        request.setReturnId(returnId);

        // CommunicationEventRequest expects String
        request.setEventType(
                eventType.name()
        );

        request.setChannel(channel);

        return eventService.recordEvent(request);
    }
}