package com.rrps.service;

import com.rrps.entity.Customer;
import com.rrps.repository.OrderRepository;
import com.rrps.repository.ReturnRequestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class FraudDetectionRuleService {

    private final OrderRepository orderRepository;
    private final ReturnRequestRepository returnRequestRepository;

    public FraudDetectionRuleService(
            OrderRepository orderRepository,
            ReturnRequestRepository returnRequestRepository
    ) {
        this.orderRepository = orderRepository;
        this.returnRequestRepository = returnRequestRepository;
    }

    /**
     * SRS rule:
     * Customer return rate greater than 30% triggers review.
     *
     * Return rate =
     * (total returns / total orders) * 100
     */
    public boolean hasHighReturnRate(Customer customer) {

        if (customer == null ||
                customer.getCustomerId() == null) {

            return false;
        }

        UUID customerId =
                customer.getCustomerId();

        long totalOrders =
                orderRepository
                        .findByCustomerCustomerId(customerId)
                        .size();

        if (totalOrders == 0) {
            return false;
        }

        long totalReturns =
                returnRequestRepository
                        .findByCustomerCustomerId(customerId)
                        .size();

        double returnRate =
                ((double) totalReturns / totalOrders) * 100;

        return returnRate > 30.0;
    }

    /**
     * SRS rule:
     * More than 5 changed-mind returns within
     * the last 30 days triggers review.
     */
    public boolean hasTooManyChangedMindReturns(
            Customer customer
    ) {

        if (customer == null ||
                customer.getCustomerId() == null) {

            return false;
        }

        LocalDateTime thirtyDaysAgo =
                LocalDateTime.now().minusDays(30);

        long changedMindReturns =
                returnRequestRepository
                        .findByCustomerCustomerId(
                                customer.getCustomerId()
                        )
                        .stream()
                        .filter(returnRequest ->
                                returnRequest.getInitiatedAt() != null &&
                                        returnRequest.getInitiatedAt()
                                                .isAfter(thirtyDaysAgo)
                        )
                        .filter(returnRequest ->
                                returnRequest.getReasonCode() != null &&
                                        (
                                                returnRequest.getReasonCode()
                                                        .equalsIgnoreCase("CHANGED_MIND")
                                                        ||
                                                        returnRequest.getReasonCode()
                                                                .equalsIgnoreCase("CHANGE_OF_MIND")
                                                        ||
                                                        returnRequest.getReasonCode()
                                                                .equalsIgnoreCase("CHANGED MIND")
                                        )
                        )
                        .count();

        return changedMindReturns > 5;
    }
}