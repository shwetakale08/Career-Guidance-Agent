package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.service;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.dto.*;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.*;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillProgressService {

    private final UserSkillProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final CareerRepository careerRepository;

    // Mark or update skill status
    @Transactional
    public SkillProgressDTO markSkill(String email,
            Long skillId,
            Long careerId,
            String status) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException(
                "User not found"));

        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException(
                "Skill not found"));

        Career career = careerRepository.findById(careerId)
                .orElseThrow(() -> new RuntimeException(
                "Career not found"));

        UserSkillProgress progress = progressRepository
                .findByUserIdAndSkillIdAndCareerId(
                        user.getId(), skillId, careerId)
                .orElse(UserSkillProgress.builder()
                        .user(user)
                        .skill(skill)
                        .skillName(skill.getName())
                        .careerId(careerId)
                        .careerTitle(career.getTitle())
                        .build());

        progress.setStatus(UserSkillProgress.ProgressStatus
                .valueOf(status.toUpperCase()));
        progressRepository.save(progress);

        return toDTO(progress);
    }

    // Unmark / remove skill progress
    @Transactional
    public void unmarkSkill(String email,
            Long skillId,
            Long careerId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException(
                "User not found"));

        progressRepository.findByUserIdAndSkillIdAndCareerId(
                user.getId(), skillId, careerId)
                .ifPresent(progressRepository::delete);
    }

    // Get all progress for a career
    public CareerReadinessDTO getCareerReadiness(String email,
            Long careerId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException(
                "User not found"));

        Career career = careerRepository.findById(careerId)
                .orElseThrow(() -> new RuntimeException(
                "Career not found"));

        int totalSkills = career.getSkills().size();

        List<UserSkillProgress> progresses = progressRepository
                .findByUserIdAndCareerId(user.getId(), careerId);

        long completed = progresses.stream()
                .filter(p -> p.getStatus()
                == UserSkillProgress.ProgressStatus.COMPLETED)
                .count();

        long learning = progresses.stream()
                .filter(p -> p.getStatus()
                == UserSkillProgress.ProgressStatus.LEARNING)
                .count();

        int readiness = totalSkills > 0
                ? (int) ((completed * 100.0) / totalSkills)
                : 0;

        List<SkillProgressDTO> dtos = progresses.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        return new CareerReadinessDTO(
                careerId,
                career.getTitle(),
                totalSkills,
                (int) completed,
                (int) learning,
                readiness,
                dtos);
    }

    // Get all progresses for user across all careers
    public List<SkillProgressDTO> getAllProgress(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException(
                "User not found"));

        return progressRepository.findByUserId(user.getId())
                .stream().map(this::toDTO)
                .collect(Collectors.toList());
    }

    private SkillProgressDTO toDTO(UserSkillProgress p) {
        return new SkillProgressDTO(
                p.getSkill().getId(),
                p.getSkillName(),
                p.getCareerId(),
                p.getCareerTitle(),
                p.getStatus());
    }
}
