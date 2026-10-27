package com.rrps.service;

import com.rrps.dto.LiquidationBatchRequest;
import com.rrps.entity.LiquidationBatch;
import com.rrps.enums.LiquidationStatus;
import com.rrps.repository.LiquidationBatchRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class LiquidationBatchService {

    private final LiquidationBatchRepository repository;
    private final LiquidationValidator liquidationValidator;

    public LiquidationBatchService(
            LiquidationBatchRepository repository,
            LiquidationValidator liquidationValidator
    ) {
        this.repository = repository;
        this.liquidationValidator = liquidationValidator;
    }

    @Transactional
    public LiquidationBatch create(
            LiquidationBatchRequest request
    ) {

        if (request == null) {
            throw new RuntimeException(
                    "Liquidation batch request is required"
            );
        }

        LiquidationBatch batch =
                new LiquidationBatch();

        batch.setPartnerName(
                request.getPartnerName()
        );

        batch.setItems(
                request.getItems()
        );

        batch.setBatchDate(
                request.getBatchDate() == null
                        ? LocalDate.now()
                        : request.getBatchDate()
        );

        batch.setPayoutAmount(
                request.getPayoutAmount()
        );

        batch.setStatus(
                request.getStatus() == null
                        ? LiquidationStatus.PREPARED
                        : request.getStatus()
        );

        liquidationValidator.validate(batch);

        return repository.save(batch);
    }

    public List<LiquidationBatch> getAll() {
        return repository.findAll();
    }

    public LiquidationBatch getById(UUID id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Liquidation batch not found"
                        )
                );
    }

    public List<LiquidationBatch> getByStatus(
            LiquidationStatus status
    ) {
        return repository.findByStatus(status);
    }

    public List<LiquidationBatch> getByPartner(
            String partnerName
    ) {
        return repository
                .findByPartnerNameIgnoreCase(partnerName);
    }

    @Transactional
    public LiquidationBatch update(
            UUID id,
            LiquidationBatchRequest request
    ) {

        if (request == null) {
            throw new RuntimeException(
                    "Liquidation batch request is required"
            );
        }

        LiquidationBatch batch =
                getById(id);

        if (request.getPartnerName() != null) {
            batch.setPartnerName(
                    request.getPartnerName()
            );
        }

        if (request.getItems() != null) {
            batch.setItems(
                    request.getItems()
            );
        }

        if (request.getBatchDate() != null) {
            batch.setBatchDate(
                    request.getBatchDate()
            );
        }

        if (request.getPayoutAmount() != null) {
            batch.setPayoutAmount(
                    request.getPayoutAmount()
            );
        }

        if (request.getStatus() != null) {
            batch.setStatus(
                    request.getStatus()
            );
        }

        liquidationValidator.validate(batch);

        return repository.save(batch);
    }

    @Transactional
    public LiquidationBatch updateStatus(
            UUID id,
            LiquidationStatus status
    ) {

        if (status == null) {
            throw new RuntimeException(
                    "Liquidation status is required"
            );
        }

        LiquidationBatch batch =
                getById(id);

        batch.setStatus(status);

        liquidationValidator.validate(batch);

        return repository.save(batch);
    }

    @Transactional
    public void delete(UUID id) {

        if (!repository.existsById(id)) {
            throw new RuntimeException(
                    "Liquidation batch not found"
            );
        }

        repository.deleteById(id);
    }
}