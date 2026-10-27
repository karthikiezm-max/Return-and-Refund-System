package com.rrps.repository;

import com.rrps.entity.ReturnCommunication;
import com.rrps.enums.CommunicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReturnCommunicationRepository
        extends JpaRepository<ReturnCommunication, UUID> {

    List<ReturnCommunication> findByReturnRequestReturnId(UUID returnId);

    List<ReturnCommunication> findByStatus(CommunicationStatus status);
}