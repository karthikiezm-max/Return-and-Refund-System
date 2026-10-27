package com.rrps.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "skus")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SKU {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID skuId;

    @Column(nullable = false, unique = true)
    private String skuCode;

    @Column(nullable = false)
    private String productName;

    private String category;

    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    private Integer availableQuantity;

    private Boolean returnable = true;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;
}