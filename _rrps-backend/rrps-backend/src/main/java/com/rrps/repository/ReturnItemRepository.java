package com.rrps.repository;

import com.rrps.entity.ReturnItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReturnItemRepository extends JpaRepository<ReturnItem, UUID> {

    List<ReturnItem> findByReturnRequestReturnId(UUID returnId);

    List<ReturnItem> findBySkuSkuId(UUID skuId);
}