package com.rrps.repository;

import com.rrps.entity.Pickup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PickupRepository extends JpaRepository<Pickup, UUID> {

    Optional<Pickup> findByReturnRequestReturnId(UUID returnId);

    boolean existsByReturnRequestReturnId(UUID returnId);
}