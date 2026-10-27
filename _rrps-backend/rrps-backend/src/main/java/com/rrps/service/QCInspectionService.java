package com.rrps.service;

import com.rrps.entity.QCInspection;
import com.rrps.entity.ReturnRequest;
import com.rrps.entity.User;
import com.rrps.enums.ReturnStatus;
import com.rrps.repository.QCInspectionRepository;
import com.rrps.repository.ReturnRequestRepository;
import com.rrps.repository.UserRepository;
import com.rrps.repository.RefundRepository;
import com.rrps.entity.Refund;
import com.rrps.enums.RefundStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class QCInspectionService {

    private final QCInspectionRepository qcInspectionRepository;
    private final ReturnRequestRepository returnRequestRepository;
    private final UserRepository userRepository;
    private final ReturnWorkflowService returnWorkflowService;
    private final RefundRepository refundRepository;

    public QCInspectionService(
            QCInspectionRepository qcInspectionRepository,
            ReturnRequestRepository returnRequestRepository,
            UserRepository userRepository,
            ReturnWorkflowService returnWorkflowService,
            RefundRepository refundRepository
    ) {
        this.qcInspectionRepository = qcInspectionRepository;
        this.returnRequestRepository = returnRequestRepository;
        this.userRepository = userRepository;
        this.returnWorkflowService = returnWorkflowService;
        this.refundRepository = refundRepository;
    }

    public List<QCInspection> getAll() {
        List<QCInspection> list = qcInspectionRepository.findAll();
        for (QCInspection qc : list) {
            if (qc.getStatus() == null) {
                if (qc.getReturnRequest() != null && qc.getReturnRequest().getStatus() == ReturnStatus.REFUNDED) {
                    qc.setStatus("CREDITED");
                } else {
                    qc.setStatus("PENDING");
                }
                qcInspectionRepository.save(qc);
            }
        }
        return list;
    }

    public QCInspection getById(UUID id) {
        return qcInspectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("QC inspection not found with id: " + id));
    }

    public QCInspection getByReturnId(UUID returnId) {
        return qcInspectionRepository
                .findByReturnRequestReturnId(returnId)
                .orElseThrow(() -> new RuntimeException("QC inspection not found for return: " + returnId));
    }

    @Transactional
    public QCInspection createFromMap(java.util.Map<String, Object> body) {
        String returnIdStr = (String) body.get("returnId");
        if (returnIdStr == null) throw new RuntimeException("Return ID is required");
        
        UUID returnId = UUID.fromString(returnIdStr);
        ReturnRequest returnRequest = returnRequestRepository.findById(returnId)
                .orElseThrow(() -> new RuntimeException("Return request not found"));

        if (qcInspectionRepository.existsByReturnRequestReturnId(returnId)) {
            throw new RuntimeException("QC inspection already exists for this return request");
        }

        String dispositionStr = body.containsKey("disposition") ? (String) body.get("disposition") : "RESTOCK_NEW";
        if (dispositionStr.equals("RESTOCK")) dispositionStr = "RESTOCK_NEW";
        com.rrps.enums.Disposition disposition = com.rrps.enums.Disposition.valueOf(dispositionStr.toUpperCase());

        String notes = body.containsKey("notes") ? (String) body.get("notes") : "";
        String images = body.containsKey("images") ? body.get("images").toString() : "";
        if (body.containsKey("conditionTags")) {
            notes = "Tags: " + body.get("conditionTags").toString() + " | " + notes;
        }

        QCInspection inspection = new QCInspection();
        inspection.setReturnRequest(returnRequest);
        inspection.setDisposition(disposition);
        inspection.setNotes(notes);
        inspection.setImages(images);
        inspection.setConditionGrade(com.rrps.enums.ConditionGrade.MINT);
        inspection.setFunctionalTest(com.rrps.enums.FunctionalTest.PASS);
        inspection.setComplaintValidated(true);
        inspection.setInspectedAt(LocalDateTime.now());
        inspection.setStatus("PENDING");

        QCInspection saved = qcInspectionRepository.save(inspection);

        returnWorkflowService.updateStatus(returnId, ReturnStatus.QC_DONE);
        if (!refundRepository.existsByReturnRequestReturnId(returnId)) {
            Refund refund = new Refund(null, returnRequest, returnRequest.getOrder().getTotalAmount(), returnRequest.getPreferredRefundMethod(), null, RefundStatus.PENDING, LocalDateTime.now(), null, null);
            refundRepository.save(refund);
        }

        return saved;
    }

    public QCInspection create(QCInspection inspection) {
        if (inspection.getStatus() == null) {
            inspection.setStatus("PENDING");
        }
        return qcInspectionRepository.save(inspection);
    }

    public QCInspection update(UUID id, QCInspection updatedInspection) {
        QCInspection existingInspection = getById(id);
        existingInspection.setConditionGrade(updatedInspection.getConditionGrade());
        existingInspection.setFunctionalTest(updatedInspection.getFunctionalTest());
        existingInspection.setComplaintValidated(updatedInspection.getComplaintValidated());
        existingInspection.setImages(updatedInspection.getImages());
        existingInspection.setDisposition(updatedInspection.getDisposition());
        existingInspection.setNotes(updatedInspection.getNotes());
        return qcInspectionRepository.save(existingInspection);
    }

    public void delete(UUID id) {
        qcInspectionRepository.deleteById(id);
    }
}
