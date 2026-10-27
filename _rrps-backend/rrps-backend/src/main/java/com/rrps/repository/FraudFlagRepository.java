package com.rrps.repository;

import com.rrps.entity.FraudFlag;
import com.rrps.enums.FraudFlagStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FraudFlagRepository extends JpaRepository<FraudFlag, UUID> {

    List<FraudFlag> findByStatus(FraudFlagStatus status);

    List<FraudFlag> findByCustomerCustomerId(UUID customerId);

    List<FraudFlag> findByReturnRequestReturnId(UUID returnId);

    boolean existsByReturnRequestReturnIdAndStatus(
            UUID returnId,
            FraudFlagStatus status
    );
}