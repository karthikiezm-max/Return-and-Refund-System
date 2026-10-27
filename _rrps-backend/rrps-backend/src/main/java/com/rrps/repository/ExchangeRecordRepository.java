package com.rrps.repository;

import com.rrps.entity.ExchangeRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ExchangeRecordRepository
        extends JpaRepository<ExchangeRecord, UUID> {

    List<ExchangeRecord> findByReturnRequestReturnId(UUID returnId);

    boolean existsByReturnRequestReturnIdAndOrderItemOrderItemId(
            UUID returnId,
            UUID orderItemId
    );

    List<ExchangeRecord> findByOrderItemOrderItemId(UUID orderItemId);
}