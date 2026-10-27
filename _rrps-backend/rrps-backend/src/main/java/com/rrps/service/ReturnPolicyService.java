package com.rrps.service;

import com.rrps.entity.ReturnPolicy;
import com.rrps.enums.PolicyEntityType;
import com.rrps.repository.ReturnPolicyRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class ReturnPolicyService {

    private final ReturnPolicyRepository returnPolicyRepository;

    public ReturnPolicyService(
            ReturnPolicyRepository returnPolicyRepository
    ) {
        this.returnPolicyRepository = returnPolicyRepository;
    }

    public List<ReturnPolicy> getAll() {
        return returnPolicyRepository.findAll();
    }

    public ReturnPolicy getById(UUID id) {
        return returnPolicyRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Return policy not found with id: " + id
                        )
                );
    }

    public List<ReturnPolicy> getByEntityType(
            PolicyEntityType entityType
    ) {
        return returnPolicyRepository.findByEntityType(entityType);
    }

    public List<ReturnPolicy> getByEntity(
            PolicyEntityType entityType,
            UUID entityId
    ) {
        return returnPolicyRepository
                .findByEntityTypeAndEntityId(
                        entityType,
                        entityId
                );
    }

    public ReturnPolicy create(ReturnPolicy policy) {

        validate(policy);

        if (policy.getEffectiveFrom() == null) {
            policy.setEffectiveFrom(LocalDate.now());
        }

        if (policy.getFreeReturn() == null) {
            policy.setFreeReturn(true);
        }

        if (policy.getExchangeEligible() == null) {
            policy.setExchangeEligible(true);
        }

        return returnPolicyRepository.save(policy);
    }

    public ReturnPolicy update(
            UUID id,
            ReturnPolicy policy
    ) {

        ReturnPolicy existing = getById(id);

        validate(policy);

        existing.setEntityType(policy.getEntityType());
        existing.setEntityId(policy.getEntityId());
        existing.setReturnWindowDays(
                policy.getReturnWindowDays()
        );
        existing.setFreeReturn(
                policy.getFreeReturn()
        );
        existing.setExchangeEligible(
                policy.getExchangeEligible()
        );
        existing.setNonReturnableSkus(
                policy.getNonReturnableSkus()
        );
        existing.setEffectiveFrom(
                policy.getEffectiveFrom()
        );

        return returnPolicyRepository.save(existing);
    }

    public void delete(UUID id) {

        if (!returnPolicyRepository.existsById(id)) {
            throw new RuntimeException(
                    "Return policy not found with id: " + id
            );
        }

        returnPolicyRepository.deleteById(id);
    }

    private void validate(ReturnPolicy policy) {

        if (policy == null) {
            throw new RuntimeException(
                    "Return policy is required"
            );
        }

        if (policy.getEntityType() == null) {
            throw new RuntimeException(
                    "Policy entity type is required"
            );
        }

        if (policy.getReturnWindowDays() == null
                || policy.getReturnWindowDays() < 0) {
            throw new RuntimeException(
                    "Return window days must be zero or greater"
            );
        }
    }
}