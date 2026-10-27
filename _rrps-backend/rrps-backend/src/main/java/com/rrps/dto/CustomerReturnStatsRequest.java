package com.rrps.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerReturnStatsRequest {

    private UUID customerId;

    private Integer totalOrders;

    private Integer totalReturns;

    private BigDecimal returnRate;

    private Integer mindChangeReturns;

    private Boolean isFlagged;
}