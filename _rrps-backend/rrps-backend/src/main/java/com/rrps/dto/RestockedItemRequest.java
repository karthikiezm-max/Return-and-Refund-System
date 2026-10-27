package com.rrps.dto;

import com.rrps.enums.RestockType;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RestockedItemRequest {

    private UUID qcId;

    private UUID skuId;

    private Integer quantity;

    private RestockType restockType;

    private BigDecimal newListingPrice;
}