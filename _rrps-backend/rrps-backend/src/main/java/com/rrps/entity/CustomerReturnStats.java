package com.rrps.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "customer_return_stats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerReturnStats {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "stats_id")
    private UUID statsId;

    @OneToOne
    @JoinColumn(
            name = "customer_id",
            nullable = false,
            unique = true
    )
    private Customer customer;

    @Column(nullable = false)
    private Integer totalOrders = 0;

    @Column(nullable = false)
    private Integer totalReturns = 0;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal returnRate = BigDecimal.ZERO;

    @Column(nullable = false)
    private Integer mindChangeReturns = 0;

    @Column(nullable = false)
    private Boolean isFlagged = false;
}