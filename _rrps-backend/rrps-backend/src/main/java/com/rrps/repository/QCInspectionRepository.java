package com.rrps.repository;

import com.rrps.entity.QCInspection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface QCInspectionRepository extends JpaRepository<QCInspection, UUID> {

    Optional<QCInspection> findByReturnRequestReturnId(UUID returnId);

    boolean existsByReturnRequestReturnId(UUID returnId);
}