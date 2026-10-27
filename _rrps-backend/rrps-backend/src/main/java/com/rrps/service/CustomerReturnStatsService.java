package com.rrps.service;

import com.rrps.dto.CustomerReturnStatsRequest;
import com.rrps.entity.Customer;
import com.rrps.entity.CustomerReturnStats;
import com.rrps.repository.CustomerRepository;
import com.rrps.repository.CustomerReturnStatsRepository;
import com.rrps.repository.OrderRepository;
import com.rrps.repository.ReturnRequestRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;

@Service
public class CustomerReturnStatsService {

    private final CustomerReturnStatsRepository statsRepository;
    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final ReturnRequestRepository returnRequestRepository;

    public CustomerReturnStatsService(
            CustomerReturnStatsRepository statsRepository,
            CustomerRepository customerRepository,
            OrderRepository orderRepository,
            ReturnRequestRepository returnRequestRepository
    ) {
        this.statsRepository = statsRepository;
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
        this.returnRequestRepository = returnRequestRepository;
    }

    public List<CustomerReturnStats> getAll() {
        return statsRepository.findAll();
    }

    public CustomerReturnStats getById(UUID id) {
        return statsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer return stats not found"));
    }

    public CustomerReturnStats getByCustomerId(UUID customerId) {
        return statsRepository.findByCustomerCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException(
                        "Return statistics not found for customer: " + customerId
                ));
    }

    public CustomerReturnStats createOrUpdate(CustomerReturnStatsRequest request) {

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        CustomerReturnStats stats = statsRepository
                .findByCustomerCustomerId(request.getCustomerId())
                .orElseGet(CustomerReturnStats::new);

        stats.setCustomer(customer);

        int totalOrders = orderRepository
                .findByCustomerCustomerId(customer.getCustomerId())
                .size();

        int totalReturns = returnRequestRepository
                .findByCustomerCustomerId(customer.getCustomerId())
                .size();

        long mindChangeReturns = returnRequestRepository
                .findByCustomerCustomerId(customer.getCustomerId())
                .stream()
                .filter(r -> {
                    String reason = r.getReasonCode();

                    if (reason == null) {
                        return false;
                    }

                    String normalized = reason.trim().toUpperCase();

                    return normalized.equals("CHANGED_MIND")
                            || normalized.equals("CHANGE_OF_MIND")
                            || normalized.equals("CHANGED MIND");
                })
                .count();

        BigDecimal returnRate = BigDecimal.ZERO;

        if (totalOrders > 0) {
            returnRate = BigDecimal.valueOf(totalReturns)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(
                            BigDecimal.valueOf(totalOrders),
                            2,
                            RoundingMode.HALF_UP
                    );
        }

        boolean flagged =
                returnRate.compareTo(BigDecimal.valueOf(30)) > 0
                        || mindChangeReturns > 5;

        stats.setTotalOrders(totalOrders);
        stats.setTotalReturns(totalReturns);
        stats.setReturnRate(returnRate);
        stats.setMindChangeReturns((int) mindChangeReturns);
        stats.setIsFlagged(flagged);

        return statsRepository.save(stats);
    }

    public CustomerReturnStats update(
            UUID id,
            CustomerReturnStatsRequest request
    ) {
        CustomerReturnStats existing = getById(id);

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        existing.setCustomer(customer);

        int totalOrders = orderRepository
                .findByCustomerCustomerId(customer.getCustomerId())
                .size();

        int totalReturns = returnRequestRepository
                .findByCustomerCustomerId(customer.getCustomerId())
                .size();

        long mindChangeReturns = returnRequestRepository
                .findByCustomerCustomerId(customer.getCustomerId())
                .stream()
                .filter(r -> {
                    String reason = r.getReasonCode();

                    if (reason == null) {
                        return false;
                    }

                    String normalized = reason.trim().toUpperCase();

                    return normalized.equals("CHANGED_MIND")
                            || normalized.equals("CHANGE_OF_MIND")
                            || normalized.equals("CHANGED MIND");
                })
                .count();

        BigDecimal returnRate = BigDecimal.ZERO;

        if (totalOrders > 0) {
            returnRate = BigDecimal.valueOf(totalReturns)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(
                            BigDecimal.valueOf(totalOrders),
                            2,
                            RoundingMode.HALF_UP
                    );
        }

        boolean flagged =
                returnRate.compareTo(BigDecimal.valueOf(30)) > 0
                        || mindChangeReturns > 5;

        existing.setTotalOrders(totalOrders);
        existing.setTotalReturns(totalReturns);
        existing.setReturnRate(returnRate);
        existing.setMindChangeReturns((int) mindChangeReturns);
        existing.setIsFlagged(flagged);

        return statsRepository.save(existing);
    }

    public void delete(UUID id) {
        if (!statsRepository.existsById(id)) {
            throw new RuntimeException("Customer return stats not found");
        }

        statsRepository.deleteById(id);
    }
}