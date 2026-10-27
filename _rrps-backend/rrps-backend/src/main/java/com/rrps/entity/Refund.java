package com.rrps.entity;

import com.rrps.enums.RefundMethod;
import com.rrps.enums.RefundStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "refunds")
public class Refund {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "refund_id")
    private UUID refundId;

    @OneToOne
    @JoinColumn(name = "return_id", nullable = false, unique = true)
    private ReturnRequest returnRequest;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RefundMethod method;

    private String razorpayRefundId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RefundStatus status;

    private LocalDateTime initiatedAt;

    private LocalDateTime creditedAt;

    @Column(columnDefinition = "TEXT")
    private String failureReason;

    public Refund() {
    }

    public Refund(
            UUID refundId,
            ReturnRequest returnRequest,
            BigDecimal amount,
            RefundMethod method,
            String razorpayRefundId,
            RefundStatus status,
            LocalDateTime initiatedAt,
            LocalDateTime creditedAt,
            String failureReason
    ) {
        this.refundId = refundId;
        this.returnRequest = returnRequest;
        this.amount = amount;
        this.method = method;
        this.razorpayRefundId = razorpayRefundId;
        this.status = status;
        this.initiatedAt = initiatedAt;
        this.creditedAt = creditedAt;
        this.failureReason = failureReason;
    }

    public UUID getRefundId() {
        return refundId;
    }

    public void setRefundId(UUID refundId) {
        this.refundId = refundId;
    }

    public ReturnRequest getReturnRequest() {
        return returnRequest;
    }

    public void setReturnRequest(ReturnRequest returnRequest) {
        this.returnRequest = returnRequest;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public RefundMethod getMethod() {
        return method;
    }

    public void setMethod(RefundMethod method) {
        this.method = method;
    }

    public String getRazorpayRefundId() {
        return razorpayRefundId;
    }

    public void setRazorpayRefundId(String razorpayRefundId) {
        this.razorpayRefundId = razorpayRefundId;
    }

    public RefundStatus getStatus() {
        return status;
    }

    public void setStatus(RefundStatus status) {
        this.status = status;
    }

    public LocalDateTime getInitiatedAt() {
        return initiatedAt;
    }

    public void setInitiatedAt(LocalDateTime initiatedAt) {
        this.initiatedAt = initiatedAt;
    }

    public LocalDateTime getCreditedAt() {
        return creditedAt;
    }

    public void setCreditedAt(LocalDateTime creditedAt) {
        this.creditedAt = creditedAt;
    }

    public String getFailureReason() {
        return failureReason;
    }

    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
    }
}