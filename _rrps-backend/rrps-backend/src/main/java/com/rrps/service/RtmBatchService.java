package com.rrps.service;

import com.rrps.dto.RtmBatchRequest;
import com.rrps.entity.RtmBatch;
import com.rrps.entity.Supplier;
import com.rrps.enums.RtmStatus;
import com.rrps.repository.RtmBatchRepository;
import com.rrps.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class RtmBatchService {

    private final RtmBatchRepository rtmRepository;
    private final SupplierRepository supplierRepository;
    private final RtmValidator rtmValidator;

    public RtmBatchService(
            RtmBatchRepository rtmRepository,
            SupplierRepository supplierRepository,
            RtmValidator rtmValidator
    ) {
        this.rtmRepository = rtmRepository;
        this.supplierRepository = supplierRepository;
        this.rtmValidator = rtmValidator;
    }

    @Transactional
    public RtmBatch create(RtmBatchRequest request) {

        if (request == null) {
            throw new RuntimeException(
                    "RTM batch request is required"
            );
        }

        if (request.getSupplierId() == null) {
            throw new RuntimeException(
                    "Supplier ID is required"
            );
        }

        Supplier supplier =
                supplierRepository.findById(
                        request.getSupplierId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Supplier not found"
                        )
                );

        RtmBatch batch = new RtmBatch();

        batch.setSupplier(supplier);
        batch.setItems(request.getItems());
        batch.setAwbNumber(request.getAwbNumber());
        batch.setCreditNoteValue(
                request.getCreditNoteValue()
        );

        batch.setStatus(
                request.getStatus() == null
                        ? RtmStatus.ACCUMULATED
                        : request.getStatus()
        );

        rtmValidator.validate(batch);

        return rtmRepository.save(batch);
    }

    public List<RtmBatch> getAll() {
        return rtmRepository.findAll();
    }

    public RtmBatch getById(UUID id) {

        return rtmRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "RTM batch not found"
                        )
                );
    }

    public List<RtmBatch> getByStatus(
            RtmStatus status
    ) {
        return rtmRepository.findByStatus(status);
    }

    public List<RtmBatch> getBySupplier(
            UUID supplierId
    ) {
        return rtmRepository
                .findBySupplierSupplierId(supplierId);
    }

    @Transactional
    public RtmBatch update(
            UUID id,
            RtmBatchRequest request
    ) {

        if (request == null) {
            throw new RuntimeException(
                    "RTM batch request is required"
            );
        }

        RtmBatch batch = getById(id);

        if (request.getSupplierId() != null) {

            Supplier supplier =
                    supplierRepository.findById(
                            request.getSupplierId()
                    ).orElseThrow(() ->
                            new RuntimeException(
                                    "Supplier not found"
                            )
                    );

            batch.setSupplier(supplier);
        }

        if (request.getItems() != null) {
            batch.setItems(request.getItems());
        }

        if (request.getAwbNumber() != null) {
            batch.setAwbNumber(
                    request.getAwbNumber()
            );
        }

        if (request.getCreditNoteValue() != null) {
            batch.setCreditNoteValue(
                    request.getCreditNoteValue()
            );
        }

        if (request.getStatus() != null) {
            batch.setStatus(
                    request.getStatus()
            );
        }

        rtmValidator.validate(batch);

        return rtmRepository.save(batch);
    }

    @Transactional
    public RtmBatch updateStatus(
            UUID id,
            RtmStatus status
    ) {

        if (status == null) {
            throw new RuntimeException(
                    "RTM status is required"
            );
        }

        RtmBatch batch = getById(id);

        batch.setStatus(status);

        rtmValidator.validate(batch);

        return rtmRepository.save(batch);
    }

    @Transactional
    public void delete(UUID id) {

        if (!rtmRepository.existsById(id)) {
            throw new RuntimeException(
                    "RTM batch not found"
            );
        }

        rtmRepository.deleteById(id);
    }
}