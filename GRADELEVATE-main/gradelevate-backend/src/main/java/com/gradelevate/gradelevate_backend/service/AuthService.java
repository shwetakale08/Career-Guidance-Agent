package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.service;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.dto.*;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.User;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.repository.UserRepository;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final EmailVerificationService emailVerificationService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.USER)
                .isVerified(false)
                .build();

        userRepository.save(user);

        // Send verification email
        try {
            emailVerificationService.sendVerificationEmail(user);
        } catch (Exception e) {
            // Don't fail registration if email fails
        }

        return new AuthResponse(
                null,
                user.getEmail(),
                user.getRole().name(),
                false,
                "Registration successful! Please check your email to verify your account."
        );
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException(
                "No account found with this email"));

        // Only block login if explicitly false
        // null or true = allow login (handles existing users)
        if (Boolean.FALSE.equals(user.getIsVerified())) {
            throw new RuntimeException("EMAIL_NOT_VERIFIED");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), request.getPassword()));

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(
                token,
                user.getEmail(),
                user.getRole().name(),
                true,
                "Login successful"
        );
    }
}
