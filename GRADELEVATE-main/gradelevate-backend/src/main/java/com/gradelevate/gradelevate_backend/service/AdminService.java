package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.service;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.dto.AdminStatsDTO;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final CareerRepository careerRepository;
    private final SkillRepository skillRepository;
    private final ResourceRepository resourceRepository;
    private final AiToolRepository aiToolRepository;
    private final ResumeRepository resumeRepository;

    public AdminStatsDTO getStats() {
        return new AdminStatsDTO(
                userRepository.count(),
                careerRepository.count(),
                skillRepository.count(),
                resourceRepository.count(),
                aiToolRepository.count(),
                resumeRepository.count()
        );
    }
}
