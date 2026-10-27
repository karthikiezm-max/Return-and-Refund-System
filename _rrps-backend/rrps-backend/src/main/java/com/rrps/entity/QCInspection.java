package com.rrps.entity;

import com.rrps.enums.ConditionGrade;
import com.rrps.enums.Disposition;
import com.rrps.enums.FunctionalTest;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
        name = "qc_inspections",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "return_id")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QCInspection {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "qc_id")
    private UUID qcId;

    @OneToOne
    @JoinColumn(name = "return_id", nullable = false, unique = true)
    private ReturnRequest returnRequest;

    @ManyToOne
    @JoinColumn(name = "inspector_id")
    private User inspector;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConditionGrade conditionGrade;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FunctionalTest functionalTest;

    @Column(nullable = false)
    private Boolean complaintValidated = false;

    @Column(columnDefinition = "TEXT")
    private String images;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Disposition disposition;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "status")
    private String status = "PENDING";

    @Column(nullable = false)
    private LocalDateTime inspectedAt;
}