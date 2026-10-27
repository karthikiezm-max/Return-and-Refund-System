package com.rrps.repository;

import com.rrps.entity.ReturnRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.UUID;

public interface FraudDetectionRepository
        extends JpaRepository<ReturnRequest, UUID> {

    @Query("""
            SELECT COUNT(r)
            FROM ReturnRequest r
            WHERE r.customer.customerId = :customerId
            """)
    long countReturnsByCustomer(
            @Param("customerId") UUID customerId
    );

    @Query("""
            SELECT COUNT(r)
            FROM ReturnRequest r
            WHERE r.customer.customerId = :customerId
              AND LOWER(r.reasonCode) = 'changed_mind'
              AND r.initiatedAt >= :fromDate
            """)
    long countChangedMindReturns(
            @Param("customerId") UUID customerId,
            @Param("fromDate") LocalDateTime fromDate
    );
}