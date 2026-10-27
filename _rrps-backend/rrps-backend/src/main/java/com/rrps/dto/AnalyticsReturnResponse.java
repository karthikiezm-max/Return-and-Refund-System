package com.rrps.dto;

import java.math.BigDecimal;

public class AnalyticsReturnResponse {

    private long totalReturns;
    private long initiatedReturns;
    private long completedReturns;
    private long cancelledReturns;
    private BigDecimal returnRate;
    private BigDecimal averageRefundAmount;

    public AnalyticsReturnResponse() {
    }

    public long getTotalReturns() {
        return totalReturns;
    }

    public void setTotalReturns(long totalReturns) {
        this.totalReturns = totalReturns;
    }

    public long getInitiatedReturns() {
        return initiatedReturns;
    }

    public void setInitiatedReturns(long initiatedReturns) {
        this.initiatedReturns = initiatedReturns;
    }

    public long getCompletedReturns() {
        return completedReturns;
    }

    public void setCompletedReturns(long completedReturns) {
        this.completedReturns = completedReturns;
    }

    public long getCancelledReturns() {
        return cancelledReturns;
    }

    public void setCancelledReturns(long cancelledReturns) {
        this.cancelledReturns = cancelledReturns;
    }

    public BigDecimal getReturnRate() {
        return returnRate;
    }

    public void setReturnRate(BigDecimal returnRate) {
        this.returnRate = returnRate;
    }

    public BigDecimal getAverageRefundAmount() {
        return averageRefundAmount;
    }

    public void setAverageRefundAmount(BigDecimal averageRefundAmount) {
        this.averageRefundAmount = averageRefundAmount;
    }
}