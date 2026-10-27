package com.rrps.entity;

import com.rrps.enums.CommunicationChannel;
import com.rrps.enums.CommunicationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "return_communications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReturnCommunication {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "comm_id")
    private UUID commId;

    @ManyToOne
    @JoinColumn(name = "return_id", nullable = false)
    private ReturnRequest returnRequest;

    @Column(nullable = false)
    private String eventType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CommunicationChannel channel;

    @Column(nullable = false)
    private LocalDateTime sentAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CommunicationStatus status = CommunicationStatus.SENT;
}