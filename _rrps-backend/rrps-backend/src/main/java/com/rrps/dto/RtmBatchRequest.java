package com.rrps.dto;

import com.rrps.enums.RtmStatus;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RtmBatchRequest {

    private UUID supplierId;

    private String items;

    private String awbNumber;

    private BigDecimal creditNoteValue;

    private RtmStatus status;
}