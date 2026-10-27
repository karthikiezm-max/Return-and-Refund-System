package com.rrps.entity;

import com.rrps.enums.RtmStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "rtm_batches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RtmBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "rtm_id")
    private UUID rtmId;

    @ManyToOne
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @Column(columnDefinition = "TEXT")
    private String items;

    private String awbNumber;

    @Column(precision = 10, scale = 2)
    private BigDecimal creditNoteValue;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RtmStatus status = RtmStatus.ACCUMULATED;
}