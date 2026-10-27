package com.rrps.repository;

import com.rrps.entity.RtmBatch;
import com.rrps.enums.RtmStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RtmBatchRepository extends JpaRepository<RtmBatch, UUID> {

    List<RtmBatch> findByStatus(RtmStatus status);

    List<RtmBatch> findBySupplierSupplierId(UUID supplierId);
}