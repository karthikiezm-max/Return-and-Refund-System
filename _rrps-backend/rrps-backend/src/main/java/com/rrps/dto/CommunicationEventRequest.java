package com.rrps.dto;

import com.rrps.enums.CommunicationChannel;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommunicationEventRequest {

    private UUID returnId;

    private String eventType;

    private CommunicationChannel channel;
}