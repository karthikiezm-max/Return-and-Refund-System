package com.rrps.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FraudFlagRequest {

    private UUID customerId;

    private UUID returnId;

    private String flagType;
}