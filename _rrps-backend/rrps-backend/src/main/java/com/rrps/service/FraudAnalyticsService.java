package com.rrps.service;

import com.rrps.dto.FraudAnalyticsResponse;
import com.rrps.entity.FraudFlag;
import com.rrps.enums.FraudFlagStatus;
import com.rrps.repository.FraudFlagRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FraudAnalyticsService {

    private final FraudFlagRepository fraudFlagRepository;

    public FraudAnalyticsService(
            FraudFlagRepository fraudFlagRepository
    ) {
        this.fraudFlagRepository =
                fraudFlagRepository;
    }

    public FraudAnalyticsResponse getFraudAnalytics() {

        List<FraudFlag> flags =
                fraudFlagRepository.findAll();

        long totalFlags =
                flags.size();

        long openFlags =
                flags.stream()
                        .filter(flag ->
                                flag.getStatus() ==
                                        FraudFlagStatus.OPEN
                        )
                        .count();

        long investigatingFlags =
                flags.stream()
                        .filter(flag ->
                                flag.getStatus() ==
                                        FraudFlagStatus.INVESTIGATING
                        )
                        .count();

        long clearedFlags =
                flags.stream()
                        .filter(flag ->
                                flag.getStatus() ==
                                        FraudFlagStatus.CLEARED
                        )
                        .count();

        long confirmedFlags =
                flags.stream()
                        .filter(flag ->
                                flag.getStatus() ==
                                        FraudFlagStatus.CONFIRMED
                        )
                        .count();

        FraudAnalyticsResponse response =
                new FraudAnalyticsResponse();

        response.setTotalFlags(totalFlags);
        response.setOpenFlags(openFlags);
        response.setInvestigatingFlags(
                investigatingFlags
        );
        response.setClearedFlags(clearedFlags);
        response.setConfirmedFlags(
                confirmedFlags
        );

        return response;
    }
}