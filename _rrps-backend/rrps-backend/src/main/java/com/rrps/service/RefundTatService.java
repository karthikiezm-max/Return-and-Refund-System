package com.rrps.service;

import com.rrps.dto.RefundTatResponse;
import com.rrps.entity.Refund;
import com.rrps.enums.RefundStatus;
import com.rrps.repository.RefundRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class RefundTatService {

    private final RefundRepository refundRepository;

    public RefundTatService(
            RefundRepository refundRepository
    ) {
        this.refundRepository = refundRepository;
    }

    public RefundTatResponse getRefundTat() {

        List<Refund> refunds =
                refundRepository.findAll();

        long totalRefunds =
                refunds.size();

        long creditedRefunds =
                refunds.stream()
                        .filter(refund ->
                                refund.getStatus() ==
                                        RefundStatus.CREDITED
                        )
                        .count();

        long failedRefunds =
                refunds.stream()
                        .filter(refund ->
                                refund.getStatus() ==
                                        RefundStatus.FAILED
                        )
                        .count();

        BigDecimal totalTatHours =
                BigDecimal.ZERO;

        long completedTatCount = 0;

        for (Refund refund : refunds) {

            LocalDateTime initiatedAt =
                    refund.getInitiatedAt();

            LocalDateTime creditedAt =
                    refund.getCreditedAt();

            if (initiatedAt != null &&
                    creditedAt != null) {

                long minutes =
                        Duration.between(
                                initiatedAt,
                                creditedAt
                        ).toMinutes();

                BigDecimal hours =
                        BigDecimal.valueOf(minutes)
                                .divide(
                                        BigDecimal.valueOf(60),
                                        2,
                                        RoundingMode.HALF_UP
                                );

                totalTatHours =
                        totalTatHours.add(hours);

                completedTatCount++;
            }
        }

        BigDecimal averageTatHours =
                BigDecimal.ZERO;

        if (completedTatCount > 0) {

            averageTatHours =
                    totalTatHours.divide(
                            BigDecimal.valueOf(
                                    completedTatCount
                            ),
                            2,
                            RoundingMode.HALF_UP
                    );
        }

        RefundTatResponse response =
                new RefundTatResponse();

        response.setTotalRefunds(totalRefunds);
        response.setCreditedRefunds(creditedRefunds);
        response.setFailedRefunds(failedRefunds);
        response.setAverageTatHours(
                averageTatHours
        );

        return response;
    }
}