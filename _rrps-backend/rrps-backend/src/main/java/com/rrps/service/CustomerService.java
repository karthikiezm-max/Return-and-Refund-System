package com.rrps.service;

import com.rrps.entity.Customer;
import com.rrps.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<Customer> getAll() {
        return customerRepository.findAll();
    }

    public Customer getById(UUID id) {
        return customerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found with id: " + id)
                );
    }

    public Customer getByEmail(String email) {
        return customerRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found with email: " + email)
                );
    }

    public Customer create(Customer customer) {
        return customerRepository.save(customer);
    }

    public Customer update(UUID id, Customer customer) {

        Customer existing = getById(id);

        existing.setName(customer.getName());
        existing.setEmail(customer.getEmail());
        existing.setPhone(customer.getPhone());
        existing.setAddress(customer.getAddress());
        existing.setBlacklisted(customer.getBlacklisted());

        return customerRepository.save(existing);
    }

    public void delete(UUID id) {

        if (!customerRepository.existsById(id)) {
            throw new RuntimeException(
                    "Customer not found with id: " + id
            );
        }

        customerRepository.deleteById(id);
    }
}