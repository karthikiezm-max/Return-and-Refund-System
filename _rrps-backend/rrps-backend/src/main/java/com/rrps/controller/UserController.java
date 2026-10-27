package com.rrps.controller;

import com.rrps.entity.User;
import com.rrps.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.UUID;

@RestController
@PreAuthorize("hasAnyRole('ADMIN')")
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "http://localhost:8081")
public class UserController {

    private final UserRepository repository;

    public UserController(UserRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public User create(@RequestBody User user) {
        return repository.save(user);
    }

    @GetMapping
    public List<User> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public User getById(@PathVariable UUID id) {
        return repository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public User update(@PathVariable UUID id, @RequestBody User user) {

        User existing = repository.findById(id).orElse(null);

        if (existing == null) {
            return null;
        }

        existing.setName(user.getName());
        existing.setEmail(user.getEmail());
        existing.setPhone(user.getPhone());
        existing.setRole(user.getRole());
        existing.setActive(user.getActive());

        return repository.save(existing);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable UUID id) {

        if (!repository.existsById(id)) {
            return "User not found";
        }

        repository.deleteById(id);
        return "User deleted successfully";
    }
}