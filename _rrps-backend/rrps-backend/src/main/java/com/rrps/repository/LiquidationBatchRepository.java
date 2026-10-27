package com.rrps.repository;

import com.rrps.entity.LiquidationBatch;
import com.rrps.enums.LiquidationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LiquidationBatchRepository
        extends JpaRepository<LiquidationBatch, UUID> {

    List<LiquidationBatch> findByStatus(LiquidationStatus status);

    List<LiquidationBatch> findByPartnerNameIgnoreCase(String partnerName);
}