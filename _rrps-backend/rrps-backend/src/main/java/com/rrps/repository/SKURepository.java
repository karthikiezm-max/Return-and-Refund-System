package com.rrps.repository;

import com.rrps.entity.SKU;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SKURepository extends JpaRepository<SKU, UUID> {
    Optional<SKU> findBySkuCode(String skuCode);
}