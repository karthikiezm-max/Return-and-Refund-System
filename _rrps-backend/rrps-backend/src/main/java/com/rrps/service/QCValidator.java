package com.rrps.service;

import com.rrps.entity.QCInspection;
import com.rrps.enums.ConditionGrade;
import com.rrps.enums.Disposition;
import com.rrps.exception.QCValidationException;
import org.springframework.stereotype.Component;

@Component
public class QCValidator {

    public void validate(QCInspection inspection) {

        if (inspection == null) {
            throw new QCValidationException(
                    "QC inspection is required"
            );
        }

        if (inspection.getReturnRequest() == null ||
                inspection.getReturnRequest().getReturnId() == null) {

            throw new QCValidationException(
                    "Return ID is required for QC inspection"
            );
        }

        if (inspection.getConditionGrade() == null) {
            throw new QCValidationException(
                    "Condition grade is required"
            );
        }

        if (inspection.getFunctionalTest() == null) {
            throw new QCValidationException(
                    "Functional test result is required"
            );
        }

        if (inspection.getDisposition() == null) {
            throw new QCValidationException(
                    "QC disposition is required"
            );
        }

        // Damaged/defective claims require QC images.
        String reason = null;

        if (inspection.getReturnRequest().getReasonCode() != null) {
            reason = inspection.getReturnRequest()
                    .getReasonCode()
                    .toUpperCase();
        }

        if (reason != null &&
                (reason.contains("DAMAGED") ||
                        reason.contains("DEFECT"))) {

            if (inspection.getImages() == null ||
                    inspection.getImages().isBlank()) {

                throw new QCValidationException(
                        "QC images are required for damaged or defective claims"
                );
            }
        }

        // A restock disposition must have a valid condition.
        if ((inspection.getDisposition() == Disposition.RESTOCK_NEW ||
                inspection.getDisposition() == Disposition.RESTOCK_REFURB) &&
                inspection.getConditionGrade() == ConditionGrade.UNUSABLE) {

            throw new QCValidationException(
                    "Unusable items cannot be restocked"
            );
        }
    }
}