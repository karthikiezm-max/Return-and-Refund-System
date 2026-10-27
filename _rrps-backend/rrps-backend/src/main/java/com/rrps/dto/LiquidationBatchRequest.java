package com.rrps.dto;

import com.rrps.enums.LiquidationStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LiquidationBatchRequest {

    private String partnerName;

    private String items;

    private LocalDate batchDate;

    private BigDecimal payoutAmount;

    private LiquidationStatus status;
}