package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.config;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.service.EmailVerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(
        name = "cleanup.scheduler.enabled",
        havingValue = "true"
)
public class CleanupScheduler {

    private final EmailVerificationService emailVerificationService;

    @Scheduled(fixedRate = 3600000)
    public void cleanupExpiredAccounts() {
        emailVerificationService.deleteExpiredUnverifiedAccounts();
    }
}
