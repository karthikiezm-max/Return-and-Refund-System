package com.rrps.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FraudAnalyticsResponse {

    private Long totalFlags;

    private Long openFlags;

    private Long investigatingFlags;

    private Long clearedFlags;

    private Long confirmedFlags;
}