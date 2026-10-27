package com.rrps.service;

import com.rrps.entity.Refund;
import com.rrps.entity.ReturnRequest;
import com.rrps.enums.RefundStatus;
import com.rrps.enums.ReturnStatus;
import com.rrps.repository.RefundRepository;
import com.rrps.repository.ReturnRequestRepository;
import com.rrps.repository.QCInspectionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class RefundService {

    private final RefundRepository refundRepository;
    private final ReturnRequestRepository returnRequestRepository;
    private final ReturnWorkflowService returnWorkflowService;
    private final QCInspectionRepository qcInspectionRepository;

    public RefundService(
            RefundRepository refundRepository,
            ReturnRequestRepository returnRequestRepository,
            ReturnWorkflowService returnWorkflowService,
            QCInspectionRepository qcInspectionRepository
    ) {
        this.refundRepository = refundRepository;
        this.returnRequestRepository = returnRequestRepository;
        this.returnWorkflowService = returnWorkflowService;
        this.qcInspectionRepository = qcInspectionRepository;
    }

    public List<Refund> getAll() {
        return refundRepository.findAll();
    }

    public Refund getById(UUID id) {
        return refundRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Refund not found with id: " + id
                        )
                );
    }

    public Refund getByReturnId(UUID returnId) {
        return refundRepository.findByReturnRequestReturnId(returnId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Refund not found for return: " + returnId
                        )
                );
    }

    public List<Refund> getByStatus(RefundStatus status) {
        return refundRepository.findByStatus(status);
    }

    @Transactional
    public Refund create(Refund refund) {

        if (refund.getReturnRequest() == null
                || refund.getReturnRequest().getReturnId() == null) {
            throw new RuntimeException(
                    "Return request is required"
            );
        }

        UUID returnId = refund.getReturnRequest().getReturnId();

        ReturnRequest returnRequest = returnRequestRepository
                .findById(returnId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Return request not found"
                        )
                );

        if (refundRepository.existsByReturnRequestReturnId(returnId)) {
            throw new RuntimeException(
                    "Refund already exists for this return"
            );
        }

        /*
         * SRS rule:
         * QC must be completed before refund.
         */
        if (returnRequest.getStatus() != ReturnStatus.QC_DONE) {
            throw new RuntimeException(
                    "Refund cannot be created before QC is completed"
            );
        }

        if (refund.getAmount() == null
                || refund.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException(
                    "Refund amount must be greater than zero"
            );
        }

        if (returnRequest.getOrder() == null
                || returnRequest.getOrder().getTotalAmount() == null) {
            throw new RuntimeException(
                    "Original order amount is not available"
            );
        }

        /*
         * Refund amount cannot exceed original payment.
         */
        if (refund.getAmount().compareTo(
                returnRequest.getOrder().getTotalAmount()
        ) > 0) {
            throw new RuntimeException(
                    "Refund amount cannot exceed original payment amount"
            );
        }

        if (refund.getMethod() == null) {
            throw new RuntimeException(
                    "Refund method is required"
            );
        }

        if (refund.getStatus() == null) {
            refund.setStatus(RefundStatus.PENDING);
        }

        if (refund.getInitiatedAt() == null) {
            refund.setInitiatedAt(LocalDateTime.now());
        }

        refund.setReturnRequest(returnRequest);

        Refund saved = refundRepository.save(refund);

        returnWorkflowService.updateStatus(returnId, ReturnStatus.REFUND_INITIATED);

        return saved;
    }

    @Transactional
    public Refund update(
            UUID id,
            Refund refund
    ) {

        Refund existing = getById(id);

        if (refund.getAmount() != null) {
            existing.setAmount(refund.getAmount());
        }

        if (refund.getMethod() != null) {
            existing.setMethod(refund.getMethod());
        }

        if (refund.getRazorpayRefundId() != null) {
            existing.setRazorpayRefundId(
                    refund.getRazorpayRefundId()
            );
        }

        if (refund.getStatus() != null) {
            existing.setStatus(refund.getStatus());
        }

        if (refund.getCreditedAt() != null) {
            existing.setCreditedAt(refund.getCreditedAt());
        }

        if (refund.getFailureReason() != null) {
            existing.setFailureReason(
                    refund.getFailureReason()
            );
        }

        return refundRepository.save(existing);
    }

    @Transactional
    public Refund updateStatus(
            UUID id,
            RefundStatus status
    ) {

        Refund refund = getById(id);

        if (status == null) {
            throw new RuntimeException(
                    "Refund status is required"
            );
        }

        refund.setStatus(status);

        if (status == RefundStatus.CREDITED
                && refund.getCreditedAt() == null) {
            refund.setCreditedAt(LocalDateTime.now());
        }

        Refund saved = refundRepository.save(refund);

        /*
         * Once the refund is credited, close the return.
         */
        if (status == RefundStatus.CREDITED) {

            ReturnRequest returnRequest =
                    refund.getReturnRequest();

            if (returnRequest != null && returnRequest.getReturnId() != null) {
                returnWorkflowService.updateStatus(returnRequest.getReturnId(), ReturnStatus.REFUNDED);
                qcInspectionRepository.findByReturnRequestReturnId(returnRequest.getReturnId())
                        .ifPresent(qc -> {
                            qc.setStatus("CREDITED");
                            qcInspectionRepository.save(qc);
                        });
            }
        }

        return saved;
    }

    public void delete(UUID id) {

        if (!refundRepository.existsById(id)) {
            throw new RuntimeException(
                    "Refund not found with id: " + id
            );
        }

        refundRepository.deleteById(id);
    }
}