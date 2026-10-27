package com.rrps.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExchangeRequest {

    private UUID returnId;

    private UUID orderItemId;

    private UUID exchangeSkuId;
}