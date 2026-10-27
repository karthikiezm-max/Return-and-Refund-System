package com.rrps.dto;

import com.rrps.enums.RefundMethod;
import com.rrps.enums.ReturnType;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class CreateReturnRequest {

    private UUID orderId;

    private UUID customerId;

    private UUID policyId;

    private ReturnType returnType;

    private String reasonCode;

    private RefundMethod preferredRefundMethod;

    private Boolean supportOverride = false;

    private List<ReturnItemRequest> items;
}