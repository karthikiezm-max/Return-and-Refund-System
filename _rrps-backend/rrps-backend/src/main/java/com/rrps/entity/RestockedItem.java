package com.rrps.entity;

import com.rrps.enums.RestockType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "restocked_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RestockedItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "restock_id")
    private UUID restockId;

    @ManyToOne
    @JoinColumn(name = "qc_id", nullable = false)
    private QCInspection qcInspection;

    @ManyToOne
    @JoinColumn(name = "sku_id", nullable = false)
    private SKU sku;

    @Column(nullable = false)
    private Integer quantity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RestockType restockType;

    @Column(precision = 10, scale = 2)
    private BigDecimal newListingPrice;

    @Column(nullable = false)
    private LocalDateTime restockedAt;
}