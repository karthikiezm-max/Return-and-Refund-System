package com.rrps.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "return_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReturnItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID itemId;

    @ManyToOne
    @JoinColumn(name = "return_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private ReturnRequest returnRequest;

    @ManyToOne
    @JoinColumn(name = "order_line_id", nullable = false)
    private OrderItem orderItem;

    @ManyToOne
    @JoinColumn(name = "sku_id", nullable = false)
    private SKU sku;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private String returnReason;

    @Column(columnDefinition = "TEXT")
    private String evidenceUrls;

    @ManyToOne
    @JoinColumn(name = "exchange_sku_id")
    private SKU exchangeSku;
}