package com.rrps.service;

import com.rrps.entity.Customer;
import com.rrps.entity.FraudFlag;
import com.rrps.entity.ReturnRequest;
import com.rrps.enums.FraudFlagStatus;
import com.rrps.repository.CustomerRepository;
import com.rrps.repository.FraudFlagRepository;
import com.rrps.repository.ReturnRequestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FraudFlagService {

    private final FraudFlagRepository fraudFlagRepository;
    private final CustomerRepository customerRepository;
    private final ReturnRequestRepository returnRequestRepository;

    public FraudFlagService(
            FraudFlagRepository fraudFlagRepository,
            CustomerRepository customerRepository,
            ReturnRequestRepository returnRequestRepository
    ) {
        this.fraudFlagRepository = fraudFlagRepository;
        this.customerRepository = customerRepository;
        this.returnRequestRepository = returnRequestRepository;
    }

    public List<FraudFlag> getAll() {
        return fraudFlagRepository.findAll();
    }

    public FraudFlag getById(UUID id) {
        return fraudFlagRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Fraud flag not found with id: " + id
                        )
                );
    }

    public List<FraudFlag> getByStatus(FraudFlagStatus status) {
        return fraudFlagRepository.findByStatus(status);
    }

    // FRAUD QUEUE
    public List<FraudFlag> getFraudQueue() {

        List<FraudFlag> fraudQueue = new ArrayList<>();

        fraudQueue.addAll(
                fraudFlagRepository.findByStatus(
                        FraudFlagStatus.OPEN
                )
        );

        fraudQueue.addAll(
                fraudFlagRepository.findByStatus(
                        FraudFlagStatus.INVESTIGATING
                )
        );

        return fraudQueue;
    }

    public List<FraudFlag> getByCustomerId(UUID customerId) {
        return fraudFlagRepository.findByCustomerCustomerId(customerId);
    }

    public List<FraudFlag> getByReturnId(UUID returnId) {
        return fraudFlagRepository.findByReturnRequestReturnId(returnId);
    }

    public FraudFlag create(FraudFlag fraudFlag) {

        if (fraudFlag == null) {
            throw new RuntimeException("Fraud flag is required");
        }

        if (fraudFlag.getFlagType() == null
                || fraudFlag.getFlagType().isBlank()) {
            throw new RuntimeException("Flag type is required");
        }

        Customer customer = null;

        if (fraudFlag.getCustomer() != null
                && fraudFlag.getCustomer().getCustomerId() != null) {

            customer = customerRepository.findById(
                    fraudFlag.getCustomer().getCustomerId()
            ).orElseThrow(() ->
                    new RuntimeException("Customer not found")
            );

            fraudFlag.setCustomer(customer);
        }

        ReturnRequest returnRequest = null;

        if (fraudFlag.getReturnRequest() != null
                && fraudFlag.getReturnRequest().getReturnId() != null) {

            returnRequest = returnRequestRepository.findById(
                    fraudFlag.getReturnRequest().getReturnId()
            ).orElseThrow(() ->
                    new RuntimeException("Return request not found")
            );

            fraudFlag.setReturnRequest(returnRequest);
        }

        if (fraudFlag.getStatus() == null) {
            fraudFlag.setStatus(FraudFlagStatus.OPEN);
        }

        if (fraudFlag.getFlaggedAt() == null) {
            fraudFlag.setFlaggedAt(LocalDateTime.now());
        }

        /*
         * Prevent duplicate active fraud flags for the same
         * return and flag type.
         */
        if (returnRequest != null) {

            List<FraudFlag> existingFlags =
                    fraudFlagRepository.findByReturnRequestReturnId(
                            returnRequest.getReturnId()
                    );

            boolean duplicate = existingFlags.stream()
                    .anyMatch(existing ->
                            fraudFlag.getFlagType().equalsIgnoreCase(
                                    existing.getFlagType()
                            )
                                    &&
                                    isActive(existing.getStatus())
                    );

            if (duplicate) {
                throw new RuntimeException(
                        "Active fraud flag already exists for this return and flag type"
                );
            }
        }

        return fraudFlagRepository.save(fraudFlag);
    }

    public FraudFlag update(
            UUID id,
            FraudFlag fraudFlag
    ) {

        FraudFlag existing = getById(id);

        if (fraudFlag.getCustomer() != null
                && fraudFlag.getCustomer().getCustomerId() != null) {

            Customer customer = customerRepository.findById(
                    fraudFlag.getCustomer().getCustomerId()
            ).orElseThrow(() ->
                    new RuntimeException("Customer not found")
            );

            existing.setCustomer(customer);
        }

        if (fraudFlag.getReturnRequest() != null
                && fraudFlag.getReturnRequest().getReturnId() != null) {

            ReturnRequest returnRequest = returnRequestRepository.findById(
                    fraudFlag.getReturnRequest().getReturnId()
            ).orElseThrow(() ->
                    new RuntimeException("Return request not found")
            );

            existing.setReturnRequest(returnRequest);
        }

        if (fraudFlag.getFlagType() != null) {
            existing.setFlagType(fraudFlag.getFlagType());
        }

        if (fraudFlag.getStatus() != null) {
            existing.setStatus(fraudFlag.getStatus());
        }

        return fraudFlagRepository.save(existing);
    }

    public FraudFlag updateStatus(
            UUID id,
            FraudFlagStatus status
    ) {

        FraudFlag existing = getById(id);

        if (status == null) {
            throw new RuntimeException(
                    "Fraud flag status is required"
            );
        }

        existing.setStatus(status);

        return fraudFlagRepository.save(existing);
    }

    public boolean hasActiveFraudFlag(UUID returnId) {

        return fraudFlagRepository
                .existsByReturnRequestReturnIdAndStatus(
                        returnId,
                        FraudFlagStatus.OPEN
                )
                ||
                fraudFlagRepository
                        .existsByReturnRequestReturnIdAndStatus(
                                returnId,
                                FraudFlagStatus.INVESTIGATING
                        );
    }

    private boolean isActive(FraudFlagStatus status) {

        return status == FraudFlagStatus.OPEN
                || status == FraudFlagStatus.INVESTIGATING;
    }

    public void delete(UUID id) {

        if (!fraudFlagRepository.existsById(id)) {
            throw new RuntimeException(
                    "Fraud flag not found with id: " + id
            );
        }

        fraudFlagRepository.deleteById(id);
    }
}