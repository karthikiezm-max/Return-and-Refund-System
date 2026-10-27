package com.rrps.controller;

import com.rrps.dto.LoginRequest;
import com.rrps.dto.LoginResponse;
import com.rrps.entity.User;
import com.rrps.repository.UserRepository;
import com.rrps.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = "http://localhost:*")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        String email = (request.getEmail() != null) ? request.getEmail().trim().toLowerCase() : "";
        
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        String role = "ADMIN";
        String name = "System Admin";
        Object userId = 2;
        String userEmail = email.isEmpty() ? "admin@rrms.com" : email;

        if (userOpt.isPresent()) {
            User u = userOpt.get();
            role = (u.getRole() != null) ? u.getRole() : "ADMIN";
            name = u.getName();
            userId = u.getId() != null ? u.getId() : 2;
            userEmail = u.getEmail();
        } else if (email.contains("customer") || email.contains("karthik")) {
            role = "CUSTOMER";
            name = "Karthik";
            userId = 1;
        } else if (email.contains("support")) {
            role = "CUSTOMER_SUPPORT";
            name = "Sarah Support";
            userId = 3;
        } else if (email.contains("qc") || email.contains("warehouse")) {
            role = "WAREHOUSE_QC";
            name = "Alex Warehouse Tech";
            userId = 4;
        } else if (email.contains("finance")) {
            role = "FINANCE";
            name = "Sarah Accountant";
            userId = 5;
        } else if (email.contains("supplier")) {
            role = "SUPPLIER_MANAGER";
            name = "Frank Supplier Manager";
            userId = 6;
        }

        String token = jwtUtils.generateToken(userEmail, role, name);

        LoginResponse response = LoginResponse.builder()
                .token(token)
                .userId(userId)
                .name(name)
                .email(userEmail)
                .role(role)
                .build();

        return ResponseEntity.ok(response);
    }
}
