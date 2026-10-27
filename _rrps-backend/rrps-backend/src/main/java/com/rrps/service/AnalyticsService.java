package com.rrps.service;

import com.rrps.dto.AnalyticsReturnResponse;
import com.rrps.entity.Refund;
import com.rrps.entity.ReturnRequest;
import com.rrps.enums.RefundStatus;
import com.rrps.enums.ReturnStatus;
import com.rrps.repository.RefundRepository;
import com.rrps.repository.ReturnRequestRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class AnalyticsService {

    private final ReturnRequestRepository returnRequestRepository;
    private final RefundRepository refundRepository;

    public AnalyticsService(
            ReturnRequestRepository returnRequestRepository,
            RefundRepository refundRepository
    ) {
        this.returnRequestRepository = returnRequestRepository;
        this.refundRepository = refundRepository;
    }

    public AnalyticsReturnResponse getReturnAnalytics() {

        List<ReturnRequest> returns =
                returnRequestRepository.findAll();

        long totalReturns = returns.size();

        long initiatedReturns =
                returns.stream()
                        .filter(r ->
                                r.getStatus() ==
                                        ReturnStatus.INITIATED
                        )
                        .count();

        long completedReturns =
                returns.stream()
                        .filter(r ->
                                r.getStatus() ==
                                        ReturnStatus.REFUNDED
                                        ||
                                        r.getStatus() ==
                                                ReturnStatus.CLOSED
                                        ||
                                        r.getStatus() ==
                                                ReturnStatus.EXCHANGE_DISPATCHED
                        )
                        .count();

        long cancelledReturns =
                returns.stream()
                        .filter(r ->
                                r.getStatus() ==
                                        ReturnStatus.CANCELLED
                        )
                        .count();

        BigDecimal returnRate =
                calculateReturnRate(returns);

        BigDecimal averageRefundAmount =
                calculateAverageRefund();

        AnalyticsReturnResponse response =
                new AnalyticsReturnResponse();

        response.setTotalReturns(totalReturns);
        response.setInitiatedReturns(initiatedReturns);
        response.setCompletedReturns(completedReturns);
        response.setCancelledReturns(cancelledReturns);
        response.setReturnRate(returnRate);
        response.setAverageRefundAmount(
                averageRefundAmount
        );

        return response;
    }

    private BigDecimal calculateReturnRate(
            List<ReturnRequest> returns
    ) {

        if (returns.isEmpty()) {
            return BigDecimal.ZERO;
        }

        long completedOrActiveReturns =
                returns.stream()
                        .filter(r ->
                                r.getStatus() !=
                                        ReturnStatus.CANCELLED
                        )
                        .count();

        return BigDecimal.valueOf(
                        completedOrActiveReturns
                )
                .multiply(BigDecimal.valueOf(100))
                .divide(
                        BigDecimal.valueOf(
                                returns.size()
                        ),
                        2,
                        RoundingMode.HALF_UP
                );
    }

    private BigDecimal calculateAverageRefund() {

        List<Refund> refunds =
                refundRepository.findAll();

        List<Refund> validRefunds =
                refunds.stream()
                        .filter(refund ->
                                refund.getAmount() != null
                        )
                        .toList();

        if (validRefunds.isEmpty()) {
            return BigDecimal.ZERO;
        }

        BigDecimal total =
                validRefunds.stream()
                        .map(Refund::getAmount)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        return total.divide(
                BigDecimal.valueOf(
                        validRefunds.size()
                ),
                2,
                RoundingMode.HALF_UP
        );
    }
}