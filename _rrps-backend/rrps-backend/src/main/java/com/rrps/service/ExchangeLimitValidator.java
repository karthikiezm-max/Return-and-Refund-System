package com.rrps.service;

import com.rrps.exception.ExchangeLimitException;
import com.rrps.repository.ExchangeRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExchangeLimitValidator {

    private final ExchangeRecordRepository exchangeRecordRepository;

    public void validate(
            UUID returnId,
            UUID orderItemId
    ) {

        if (returnId == null) {
            throw new ExchangeLimitException(
                    "Return ID is required"
            );
        }

        if (orderItemId == null) {
            throw new ExchangeLimitException(
                    "Order item ID is required"
            );
        }

        boolean alreadyExchanged =
                exchangeRecordRepository
                        .existsByReturnRequestReturnIdAndOrderItemOrderItemId(
                                returnId,
                                orderItemId
                        );

        if (alreadyExchanged) {
            throw new ExchangeLimitException(
                    "Only one exchange is allowed per order line"
            );
        }
    }
}