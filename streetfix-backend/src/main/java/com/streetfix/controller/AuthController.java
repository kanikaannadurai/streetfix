package com.streetfix.controller;

import com.streetfix.dto.JwtResponse;
import com.streetfix.dto.LoginRequest;
import com.streetfix.dto.MessageResponse;
import com.streetfix.dto.RegisterRequest;
import com.streetfix.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<MessageResponse> registerUser(@Valid @RequestBody RegisterRequest request) {
        log.info("Registering user: {}", request.getEmail());
        return ResponseEntity.ok(authService.registerUser(request));
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest request) {
        log.info("Authenticating user: {}", request.getEmail());
        return ResponseEntity.ok(authService.authenticateUser(request));
    }

    // Logout is handled client-side by deleting the JWT token.
    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logoutUser() {
        return ResponseEntity.ok(new MessageResponse("Log out successful!"));
    }

    @GetMapping("/me")
    public ResponseEntity<com.streetfix.entity.User> getCurrentUser(java.security.Principal principal) {
        String email = principal.getName();
        return authService.getCurrentUser(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
