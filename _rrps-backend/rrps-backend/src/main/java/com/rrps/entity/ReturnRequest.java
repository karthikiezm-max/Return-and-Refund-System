package com.rrps.entity;

import com.rrps.enums.RefundMethod;
import com.rrps.enums.ReturnStatus;
import com.rrps.enums.ReturnType;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "return_requests")
public class ReturnRequest {

    @Id
    @GeneratedValue
    @Column(name = "return_id")
    private UUID returnId;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "policy_id")
    private ReturnPolicy policy;

    @OneToMany(
            mappedBy = "returnRequest",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.EAGER
    )
    private List<ReturnItem> items = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReturnType returnType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReturnStatus status = ReturnStatus.INITIATED;

    @Column(nullable = false)
    private String reasonCode;

    @Enumerated(EnumType.STRING)
    private RefundMethod preferredRefundMethod;

    @Column(nullable = false)
    private LocalDateTime initiatedAt;

    private Boolean supportOverride = false;

    public ReturnRequest() {
    }

    public ReturnRequest(
            UUID returnId,
            Order order,
            Customer customer,
            ReturnPolicy policy,
            List<ReturnItem> items,
            ReturnType returnType,
            ReturnStatus status,
            String reasonCode,
            RefundMethod preferredRefundMethod,
            LocalDateTime initiatedAt,
            Boolean supportOverride
    ) {
        this.returnId = returnId;
        this.order = order;
        this.customer = customer;
        this.policy = policy;
        this.items = items;
        this.returnType = returnType;
        this.status = status;
        this.reasonCode = reasonCode;
        this.preferredRefundMethod = preferredRefundMethod;
        this.initiatedAt = initiatedAt;
        this.supportOverride = supportOverride;
    }

    public UUID getReturnId() {
        return returnId;
    }

    public void setReturnId(UUID returnId) {
        this.returnId = returnId;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public ReturnPolicy getPolicy() {
        return policy;
    }

    public void setPolicy(ReturnPolicy policy) {
        this.policy = policy;
    }

    public List<ReturnItem> getItems() {
        return items;
    }

    public void setItems(List<ReturnItem> items) {
        this.items = items;
    }

    public ReturnType getReturnType() {
        return returnType;
    }

    public void setReturnType(ReturnType returnType) {
        this.returnType = returnType;
    }

    public ReturnStatus getStatus() {
        return status;
    }

    public void setStatus(ReturnStatus status) {
        this.status = status;
    }

    public String getReasonCode() {
        return reasonCode;
    }

    public void setReasonCode(String reasonCode) {
        this.reasonCode = reasonCode;
    }

    public RefundMethod getPreferredRefundMethod() {
        return preferredRefundMethod;
    }

    public void setPreferredRefundMethod(RefundMethod preferredRefundMethod) {
        this.preferredRefundMethod = preferredRefundMethod;
    }

    public LocalDateTime getInitiatedAt() {
        return initiatedAt;
    }

    public void setInitiatedAt(LocalDateTime initiatedAt) {
        this.initiatedAt = initiatedAt;
    }

    public Boolean getSupportOverride() {
        return supportOverride;
    }

    public void setSupportOverride(Boolean supportOverride) {
        this.supportOverride = supportOverride;
    }
}