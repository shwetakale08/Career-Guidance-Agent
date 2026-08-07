package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.service;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.*;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private final EmailVerificationTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional
    public void sendVerificationEmail(User user) {
        // Delete any existing token for this user
        tokenRepository.deleteByUserId(user.getId());

        // Generate new token
        String token = UUID.randomUUID().toString();

        EmailVerificationToken verificationToken
                = EmailVerificationToken.builder()
                        .token(token)
                        .user(user)
                        .expiresAt(LocalDateTime.now().plusHours(24))
                        .used(false)
                        .build();

        tokenRepository.save(verificationToken);

        // Send email
        emailService.sendVerificationEmail(
                user.getEmail(), token, user.getName());
    }

    @Transactional
    public User verifyEmail(String token) {
        EmailVerificationToken verificationToken
                = tokenRepository.findByToken(token)
                        .orElseThrow(() -> new RuntimeException(
                        "Invalid or expired verification link"));

        // If already used, check if user is verified
        // This handles the React StrictMode double-call edge case
        if (verificationToken.getUsed()) {
            User user = verificationToken.getUser();
            if (user.getIsVerified()) {
                // Already verified — treat as success silently
                return user;
            }
            throw new RuntimeException(
                    "This verification link has already been used");
        }

        if (verificationToken.getExpiresAt()
                .isBefore(LocalDateTime.now())) {
            throw new RuntimeException(
                    "Verification link has expired. Please request a new one");
        }

        User user = verificationToken.getUser();
        user.setIsVerified(true);
        userRepository.save(user);

        verificationToken.setUsed(true);
        tokenRepository.save(verificationToken);

        return user;
    }

    @Transactional
    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException(
                "No account found with this email"));

        if (user.getIsVerified()) {
            throw new RuntimeException(
                    "This account is already verified");
        }

        sendVerificationEmail(user);
    }

    // Cleanup — delete unverified accounts older than 24 hours
    @Transactional
    public void deleteExpiredUnverifiedAccounts() {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(24);
        List<User> expiredUsers = userRepository
                .findUnverifiedUsersBefore(cutoff);

        for (User user : expiredUsers) {
            tokenRepository.deleteByUserId(user.getId());
            userRepository.delete(user);
        }
    }
}
