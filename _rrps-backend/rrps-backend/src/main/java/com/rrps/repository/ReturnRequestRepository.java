package com.rrps.repository;

import com.rrps.entity.ReturnRequest;
import com.rrps.enums.ReturnStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReturnRequestRepository extends JpaRepository<ReturnRequest, UUID> {

    List<ReturnRequest> findByCustomerCustomerId(UUID customerId);

    List<ReturnRequest> findByOrderOrderId(UUID orderId);

    List<ReturnRequest> findByStatus(ReturnStatus status);

}
