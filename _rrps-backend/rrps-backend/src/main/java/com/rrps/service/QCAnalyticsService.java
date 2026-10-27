package com.rrps.service;

import com.rrps.dto.QCAnalyticsResponse;
import com.rrps.entity.QCInspection;
import com.rrps.enums.Disposition;
import com.rrps.enums.FunctionalTest;
import com.rrps.repository.QCInspectionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QCAnalyticsService {

    private final QCInspectionRepository qcInspectionRepository;

    public QCAnalyticsService(
            QCInspectionRepository qcInspectionRepository
    ) {
        this.qcInspectionRepository =
                qcInspectionRepository;
    }

    public QCAnalyticsResponse getQCAnalytics() {

        List<QCInspection> inspections =
                qcInspectionRepository.findAll();

        long totalInspections =
                inspections.size();

        long passedFunctionalTests =
                inspections.stream()
                        .filter(inspection ->
                                inspection.getFunctionalTest() ==
                                        FunctionalTest.PASS
                        )
                        .count();

        long failedFunctionalTests =
                inspections.stream()
                        .filter(inspection ->
                                inspection.getFunctionalTest() ==
                                        FunctionalTest.FAIL
                        )
                        .count();

        long complaintValidated =
                inspections.stream()
                        .filter(inspection ->
                                Boolean.TRUE.equals(
                                        inspection.getComplaintValidated()
                                )
                        )
                        .count();

        long restocked =
                inspections.stream()
                        .filter(inspection ->
                                inspection.getDisposition() ==
                                        Disposition.RESTOCK_NEW
                        )
                        .count();

        long refurbished =
                inspections.stream()
                        .filter(inspection ->
                                inspection.getDisposition() ==
                                        Disposition.RESTOCK_REFURB
                        )
                        .count();

        long liquidated =
                inspections.stream()
                        .filter(inspection ->
                                inspection.getDisposition() ==
                                        Disposition.LIQUIDATE
                        )
                        .count();

        long rtm =
                inspections.stream()
                        .filter(inspection ->
                                inspection.getDisposition() ==
                                        Disposition.RTM
                        )
                        .count();

        long disposed =
                inspections.stream()
                        .filter(inspection ->
                                inspection.getDisposition() ==
                                        Disposition.DISPOSE
                        )
                        .count();

        QCAnalyticsResponse response =
                new QCAnalyticsResponse();

        response.setTotalInspections(totalInspections);
        response.setPassedFunctionalTests(
                passedFunctionalTests
        );
        response.setFailedFunctionalTests(
                failedFunctionalTests
        );
        response.setComplaintValidated(
                complaintValidated
        );
        response.setRestocked(restocked);
        response.setRefurbished(refurbished);
        response.setLiquidated(liquidated);
        response.setRtm(rtm);
        response.setDisposed(disposed);

        return response;
    }
}