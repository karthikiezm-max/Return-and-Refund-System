package com.rrps.service;

import com.rrps.entity.Customer;
import com.rrps.entity.FraudFlag;
import com.rrps.entity.ReturnRequest;
import com.rrps.enums.FraudFlagStatus;
import com.rrps.repository.FraudFlagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FraudDetectionService {

    private final FraudFlagRepository fraudFlagRepository;
    private final FraudDetectionRuleService fraudDetectionRuleService;

    public FraudDetectionService(
            FraudFlagRepository fraudFlagRepository,
            FraudDetectionRuleService fraudDetectionRuleService
    ) {
        this.fraudFlagRepository = fraudFlagRepository;
        this.fraudDetectionRuleService = fraudDetectionRuleService;
    }

    @Transactional
    public void checkReturn(ReturnRequest returnRequest) {

        if (returnRequest == null ||
                returnRequest.getCustomer() == null) {
            return;
        }

        Customer customer =
                returnRequest.getCustomer();

        // Rule 1: Blacklisted customer
        if (Boolean.TRUE.equals(customer.getBlacklisted())) {

            createFlag(
                    customer,
                    returnRequest,
                    "BLACKLISTED_CUSTOMER"
            );
        }

        // Rule 2: Return rate > 30%
        if (fraudDetectionRuleService
                .hasHighReturnRate(customer)) {

            createFlag(
                    customer,
                    returnRequest,
                    "HIGH_RETURN_RATE"
            );
        }

        // Rule 3: More than 5 changed-mind returns
        // within 30 days
        if (fraudDetectionRuleService
                .hasTooManyChangedMindReturns(customer)) {

            createFlag(
                    customer,
                    returnRequest,
                    "EXCESSIVE_CHANGED_MIND_RETURNS"
            );
        }
    }

    private void createFlag(
            Customer customer,
            ReturnRequest returnRequest,
            String flagType
    ) {

        List<FraudFlag> existingFlags =
                fraudFlagRepository
                        .findByReturnRequestReturnId(
                                returnRequest.getReturnId()
                        );

        boolean alreadyExists =
                existingFlags.stream()
                        .anyMatch(flag ->
                                flagType.equalsIgnoreCase(
                                        flag.getFlagType()
                                )
                                        &&
                                        (
                                                flag.getStatus() ==
                                                        FraudFlagStatus.OPEN
                                                        ||
                                                        flag.getStatus() ==
                                                                FraudFlagStatus.INVESTIGATING
                                        )
                        );

        if (alreadyExists) {
            return;
        }

        FraudFlag fraudFlag =
                new FraudFlag();

        fraudFlag.setCustomer(customer);
        fraudFlag.setReturnRequest(returnRequest);
        fraudFlag.setFlagType(flagType);
        fraudFlag.setStatus(FraudFlagStatus.OPEN);
        fraudFlag.setFlaggedAt(
                LocalDateTime.now()
        );

        fraudFlagRepository.save(
                fraudFlag
        );
    }
}