package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.controller;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.dto.*;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.User;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.security.JwtUtil;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.service.AuthService;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.service.EmailVerificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final EmailVerificationService emailVerificationService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(
            @RequestParam String token) {
        try {
            User user = emailVerificationService.verifyEmail(token);
            String jwt = jwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok(new AuthResponse(
                    jwt,
                    user.getEmail(),
                    user.getRole().name(),
                    true,
                    "Email verified successfully!"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<Map<String, String>> resendVerification(
            @RequestBody Map<String, String> body) {
        try {
            emailVerificationService.resendVerificationEmail(
                    body.get("email"));
            return ResponseEntity.ok(Map.of(
                    "message", "Verification email sent!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

}
