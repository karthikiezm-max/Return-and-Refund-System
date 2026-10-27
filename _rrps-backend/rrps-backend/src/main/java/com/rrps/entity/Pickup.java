package com.rrps.entity;

import com.rrps.enums.LogisticsPartner;
import com.rrps.enums.PickupStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(
        name = "pickups",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "return_id")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Pickup {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "pickup_id")
    private UUID pickupId;

    @OneToOne
    @JoinColumn(name = "return_id", nullable = false, unique = true)
    private ReturnRequest returnRequest;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LogisticsPartner logisticsPartner;

    private String awbNumber;

    private LocalDate pickupDate;

    private LocalTime pickupSlot;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PickupStatus status = PickupStatus.SCHEDULED;

    private String pickupOtp;

    private Integer rescheduleCount = 0;
}