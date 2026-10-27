package com.rrps.dto;

import com.rrps.enums.RefundStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RefundStatusRequest {

    private RefundStatus status;

    private String failureReason;

    private String razorpayRefundId;
}