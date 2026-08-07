package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.service;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.dto.CareerRecommendationDTO;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.dto.SkillGapDTO;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.*;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final CareerRepository careerRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;
    private final AiAnalysisService aiAnalysisService;

    // ─────────────────────────────────────────
    // STEP 1: Career Recommendation Algorithm
    // ─────────────────────────────────────────
    public List<CareerRecommendationDTO> recommendCareers(String email) {

        // Get user profile
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException(
                "Please complete your profile first"));

        List<String> userInterests = splitTags(profile.getInterestAreas());
        List<String> userWorkStyle = splitTags(profile.getWorkStyle());
        List<String> userGoals = splitTags(profile.getGoal());

        List<Career> allCareers = careerRepository.findAll();
        List<CareerRecommendationDTO> result = new ArrayList<>();

        for (Career career : allCareers) {
            int score = 0;

            // Interest match → 40 points
            List<String> careerInterests = splitTags(career.getInterestTags());
            score += matchScore(userInterests, careerInterests, 40);

            // Work style match → 30 points
            List<String> careerWorkStyle = splitTags(career.getWorkStyleTags());
            score += matchScore(userWorkStyle, careerWorkStyle, 30);

            // Goal match → 20 points
            List<String> careerGoals = splitTags(career.getGoalTags());
            score += matchScore(userGoals, careerGoals, 20);

            // Education bonus → 10 points
            if (profile.getEducationLevel() != null) {
                score += 10;
            }

            if (score > 0) {
                result.add(new CareerRecommendationDTO(career, score));
            }
        }

        // Sort by score descending, return top 10
        result.sort(Comparator.comparingInt(
                CareerRecommendationDTO::getScore).reversed());

        return result.stream().limit(10).collect(Collectors.toList());
    }

    // ─────────────────────────────────────────
    // STEP 2: Skill Gap Analysis
    // ─────────────────────────────────────────
    public SkillGapDTO getSkillGap(String email, Long careerId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Career career = careerRepository.findById(careerId)
                .orElseThrow(() -> new RuntimeException("Career not found"));

        Set<Skill> requiredSkills = career.getSkills();

        UserProfile profile = userProfileRepository
                .findByUserId(user.getId()).orElse(null);

        List<String> knownSkillNames = new ArrayList<>();
        if (profile != null && profile.getKnownSkillNames() != null) {
            knownSkillNames = Arrays.stream(
                    profile.getKnownSkillNames().split(","))
                    .map(String::trim)
                    .collect(Collectors.toList());
        }

        final List<String> finalKnownNames = knownSkillNames;

        List<Skill> knownSkills = requiredSkills.stream()
                .filter(s -> finalKnownNames.stream()
                .anyMatch(k -> k.equalsIgnoreCase(s.getName())))
                .collect(Collectors.toList());

        List<Skill> missingSkills = requiredSkills.stream()
                .filter(s -> finalKnownNames.stream()
                .noneMatch(k -> k.equalsIgnoreCase(s.getName())))
                .collect(Collectors.toList());

        SkillGapDTO dto = new SkillGapDTO(career, missingSkills, knownSkills);

        // Generate AI learning order for missing skills
        try {
            List<String> missingNames = missingSkills.stream()
                    .map(Skill::getName)
                    .collect(Collectors.toList());

            List<String> orderedNames = aiAnalysisService.generateLearningOrder(career.getTitle(), missingNames);

            dto.setLearningOrder(orderedNames);

            // Sort missingSkills based on AI order
            List<Skill> sortedMissing = new ArrayList<>();
            for (String name : orderedNames) {
                missingSkills.stream()
                        .filter(s -> s.getName().equalsIgnoreCase(name))
                        .findFirst()
                        .ifPresent(sortedMissing::add);
            }
            // Add any skills not in the order (fallback)
            missingSkills.stream()
                    .filter(s -> sortedMissing.stream()
                    .noneMatch(sm -> sm.getId().equals(s.getId())))
                    .forEach(sortedMissing::add);

            dto.setMissingSkills(sortedMissing);
        } catch (Exception e) {
            // Keep original order if AI fails
        }

        return dto;
    }

    // ─────────────────────────────────────────
    // Helper: calculate weighted match score
    // ─────────────────────────────────────────
    private int matchScore(List<String> userTags,
            List<String> careerTags,
            int maxPoints) {
        if (userTags.isEmpty() || careerTags.isEmpty()) {
            return 0;
        }

        long matches = userTags.stream()
                .filter(tag -> careerTags.stream()
                .anyMatch(ct -> ct.equalsIgnoreCase(tag)))
                .count();

        // Score proportional to how many tags matched
        return (int) ((matches * 1.0 / careerTags.size()) * maxPoints);
    }

    private List<String> splitTags(String tags) {
        if (tags == null || tags.isBlank()) {
            return Collections.emptyList();
        }
        return Arrays.stream(tags.split(","))
                .map(String::trim)
                .collect(Collectors.toList());
    }

}
