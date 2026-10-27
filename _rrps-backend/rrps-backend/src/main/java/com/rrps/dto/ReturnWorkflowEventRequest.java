package com.rrps.dto;

import com.rrps.enums.CommunicationChannel;
import com.rrps.enums.ReturnStatus;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReturnWorkflowEventRequest {

    private UUID returnId;

    private ReturnStatus status;

    private CommunicationChannel channel;
}