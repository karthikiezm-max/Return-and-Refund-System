package com.rrps.repository;

import com.rrps.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, UUID> {

    List<Order> findByCustomerCustomerId(UUID customerId);

    Optional<Order> findByOrderNumber(String orderNumber);

}

