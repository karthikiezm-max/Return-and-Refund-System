package com.rrps.repository;

import com.rrps.entity.CustomerReturnStats;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CustomerReturnStatsRepository
        extends JpaRepository<CustomerReturnStats, UUID> {

    Optional<CustomerReturnStats> findByCustomerCustomerId(UUID customerId);

    boolean existsByCustomerCustomerId(UUID customerId);
}