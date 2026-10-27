package com.rrps.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class ReturnItemRequest {

    private UUID orderItemId;

    private UUID skuId;

    private Integer quantity;

    private String returnReason;

    private String evidenceUrls;

    private UUID exchangeSkuId;
}