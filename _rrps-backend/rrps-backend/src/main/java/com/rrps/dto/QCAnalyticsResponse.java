package com.rrps.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class QCAnalyticsResponse {

    private long totalInspections;

    private long passedFunctionalTests;

    private long failedFunctionalTests;

    private long complaintValidated;

    private long restocked;

    private long refurbished;

    private long liquidated;

    private long rtm;

    private long disposed;
}