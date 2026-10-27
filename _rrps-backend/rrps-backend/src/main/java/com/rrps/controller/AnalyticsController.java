package com.rrps.controller;

import com.rrps.dto.AnalyticsReturnResponse;
import com.rrps.dto.FraudAnalyticsResponse;
import com.rrps.dto.QCAnalyticsResponse;
import com.rrps.dto.RefundTatResponse;
import com.rrps.service.AnalyticsService;
import com.rrps.service.FraudAnalyticsService;
import com.rrps.service.QCAnalyticsService;
import com.rrps.service.RefundTatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER_SUPPORT', 'FINANCE', 'WAREHOUSE_QC')")
@RequestMapping("/api/v1/analytics")
@CrossOrigin(origins = "http://localhost:8081")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final RefundTatService refundTatService;
    private final FraudAnalyticsService fraudAnalyticsService;
    private final QCAnalyticsService qcAnalyticsService;

    public AnalyticsController(
            AnalyticsService analyticsService,
            RefundTatService refundTatService,
            FraudAnalyticsService fraudAnalyticsService,
            QCAnalyticsService qcAnalyticsService
    ) {
        this.analyticsService = analyticsService;
        this.refundTatService = refundTatService;
        this.fraudAnalyticsService =
                fraudAnalyticsService;
        this.qcAnalyticsService =
                qcAnalyticsService;
    }

    @GetMapping("/returns")
    public ResponseEntity<AnalyticsReturnResponse>
    getReturnAnalytics() {

        return ResponseEntity.ok(
                analyticsService.getReturnAnalytics()
        );
    }

    @GetMapping("/refund-tat")
    public ResponseEntity<RefundTatResponse>
    getRefundTat() {

        return ResponseEntity.ok(
                refundTatService.getRefundTat()
        );
    }

    @GetMapping("/fraud")
    public ResponseEntity<FraudAnalyticsResponse>
    getFraudAnalytics() {

        return ResponseEntity.ok(
                fraudAnalyticsService.getFraudAnalytics()
        );
    }

    @GetMapping("/qc")
    public ResponseEntity<QCAnalyticsResponse>
    getQCAnalytics() {

        return ResponseEntity.ok(
                qcAnalyticsService.getQCAnalytics()
        );
    }
}