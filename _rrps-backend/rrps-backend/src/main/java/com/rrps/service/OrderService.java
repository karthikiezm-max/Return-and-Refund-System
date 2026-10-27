package com.rrps.service;

import com.rrps.entity.Customer;
import com.rrps.entity.Order;
import com.rrps.repository.CustomerRepository;
import com.rrps.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;

    public OrderService(
            OrderRepository orderRepository,
            CustomerRepository customerRepository) {

        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
    }

    // CREATE
    public Order createOrder(Order order) {
        Customer customer = null;
        if (order.getCustomer() != null && order.getCustomer().getCustomerId() != null) {
            customer = customerRepository.findById(order.getCustomer().getCustomerId()).orElse(null);
        }
        if (customer == null) {
            List<Customer> allCustomers = customerRepository.findAll();
            if (!allCustomers.isEmpty()) {
                customer = allCustomers.get(0);
            } else {
                customer = customerRepository.save(new Customer(null, "Karthik", "karthik@enterprise.com", "+1 555-0199", "San Francisco", false));
            }
        }
        order.setCustomer(customer);
        return orderRepository.save(order);
    }

    // READ - ALL
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // READ - ONE
    public Order getOrderById(UUID id) {
        return orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));
    }

    // READ - CUSTOMER ORDERS
    public List<Order> getOrdersByCustomer(UUID customerId) {

        if (!customerRepository.existsById(customerId)) {
            throw new RuntimeException("Customer not found");
        }

        return orderRepository.findByCustomerCustomerId(customerId);
    }

    // UPDATE
    public Order updateOrder(UUID id, Order updatedOrder) {

        Order existingOrder = getOrderById(id);

        existingOrder.setOrderNumber(updatedOrder.getOrderNumber());
        existingOrder.setTotalAmount(updatedOrder.getTotalAmount());
        existingOrder.setOrderDate(updatedOrder.getOrderDate());
        existingOrder.setDeliveredAt(updatedOrder.getDeliveredAt());
        existingOrder.setPaymentMethod(updatedOrder.getPaymentMethod());

        if (updatedOrder.getCustomer() != null &&
                updatedOrder.getCustomer().getCustomerId() != null) {

            Customer customer = customerRepository
                    .findById(updatedOrder.getCustomer().getCustomerId())
                    .orElseThrow(() ->
                            new RuntimeException("Customer not found"));

            existingOrder.setCustomer(customer);
        }

        return orderRepository.save(existingOrder);
    }

    // DELETE
    public void deleteOrder(UUID id) {

        if (!orderRepository.existsById(id)) {
            throw new RuntimeException("Order not found");
        }

        orderRepository.deleteById(id);
    }
}
