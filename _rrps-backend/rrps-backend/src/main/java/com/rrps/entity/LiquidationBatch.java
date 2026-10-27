package com.rrps.entity;

import com.rrps.enums.LiquidationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "liquidation_batches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LiquidationBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "liq_id")
    private UUID liqId;

    @Column(nullable = false)
    private String partnerName;

    @Column(columnDefinition = "TEXT")
    private String items;

    @Column(nullable = false)
    private LocalDate batchDate;

    @Column(precision = 10, scale = 2)
    private BigDecimal payoutAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LiquidationStatus status = LiquidationStatus.PREPARED;
}