package com.rrps.entity;

import com.rrps.enums.FraudFlagStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "fraud_flags")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FraudFlag {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "flag_id")
    private UUID flagId;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(nullable = false)
    private String flagType;

    @ManyToOne
    @JoinColumn(name = "return_id")
    private ReturnRequest returnRequest;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FraudFlagStatus status = FraudFlagStatus.OPEN;

    @Column(nullable = false)
    private LocalDateTime flaggedAt;
}