package com.rrps.repository;

import com.rrps.entity.RestockedItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RestockedItemRepository
        extends JpaRepository<RestockedItem, UUID> {

    List<RestockedItem> findByQcInspectionQcId(UUID qcId);

    List<RestockedItem> findBySkuSkuId(UUID skuId);
}