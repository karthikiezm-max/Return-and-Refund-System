package com.rrps.dto;

import java.math.BigDecimal;

public class RefundTatResponse {

    private long totalRefunds;
    private long creditedRefunds;
    private long failedRefunds;
    private BigDecimal averageTatHours;

    public RefundTatResponse() {
    }

    public long getTotalRefunds() {
        return totalRefunds;
    }

    public void setTotalRefunds(long totalRefunds) {
        this.totalRefunds = totalRefunds;
    }

    public long getCreditedRefunds() {
        return creditedRefunds;
    }

    public void setCreditedRefunds(long creditedRefunds) {
        this.creditedRefunds = creditedRefunds;
    }

    public long getFailedRefunds() {
        return failedRefunds;
    }

    public void setFailedRefunds(long failedRefunds) {
        this.failedRefunds = failedRefunds;
    }

    public BigDecimal getAverageTatHours() {
        return averageTatHours;
    }

    public void setAverageTatHours(BigDecimal averageTatHours) {
        this.averageTatHours = averageTatHours;
    }
}