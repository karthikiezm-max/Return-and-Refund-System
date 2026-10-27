package com.rrps.dto;

import com.rrps.enums.CommunicationChannel;
import com.rrps.enums.CommunicationStatus;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReturnCommunicationRequest {

    private UUID returnId;

    private String eventType;

    private CommunicationChannel channel;

    private CommunicationStatus status;
}