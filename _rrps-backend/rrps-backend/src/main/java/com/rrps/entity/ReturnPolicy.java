package com.rrps.entity;

import com.rrps.enums.PolicyEntityType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "return_policies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReturnPolicy {

    @Id
    @GeneratedValue
    @Column(name = "policy_id")
    private UUID policyId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PolicyEntityType entityType;

    private UUID entityId;

    @Column(nullable = false)
    private Integer returnWindowDays;

    @Column(nullable = false)
    private Boolean freeReturn = true;

    @Column(nullable = false)
    private Boolean exchangeEligible = true;

    @ElementCollection
    @CollectionTable(
        name = "policy_non_returnable_skus",
        joinColumns = @JoinColumn(name = "policy_id")
    )
    @Column(name = "sku_id")
    private List<UUID> nonReturnableSkus;

    private LocalDate effectiveFrom;
}
