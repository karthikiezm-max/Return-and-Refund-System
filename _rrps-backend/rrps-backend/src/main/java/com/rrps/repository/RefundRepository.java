package com.rrps.repository;

import com.rrps.entity.Refund;
import com.rrps.enums.RefundStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RefundRepository extends JpaRepository<Refund, UUID> {

    Optional<Refund> findByReturnRequestReturnId(UUID returnId);

    boolean existsByReturnRequestReturnId(UUID returnId);

    List<Refund> findByStatus(RefundStatus status);
}