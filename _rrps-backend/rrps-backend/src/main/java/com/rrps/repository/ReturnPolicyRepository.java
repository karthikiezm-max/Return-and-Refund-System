package com.rrps.repository;

import com.rrps.entity.ReturnPolicy;
import com.rrps.enums.PolicyEntityType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReturnPolicyRepository extends JpaRepository<ReturnPolicy, UUID> {

    List<ReturnPolicy> findByEntityType(PolicyEntityType entityType);

    List<ReturnPolicy> findByEntityTypeAndEntityId(
            PolicyEntityType entityType,
            UUID entityId
    );
}