package com.rrps.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
        name = "exchange_records",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"return_id", "order_item_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExchangeRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "exchange_id")
    private UUID exchangeId;

    @ManyToOne
    @JoinColumn(name = "return_id", nullable = false)
    private ReturnRequest returnRequest;

    @ManyToOne
    @JoinColumn(name = "order_item_id", nullable = false)
    private OrderItem orderItem;

    @ManyToOne
    @JoinColumn(name = "exchange_sku_id", nullable = false)
    private SKU exchangeSku;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private Boolean dispatched = false;
}