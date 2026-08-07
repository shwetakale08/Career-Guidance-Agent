package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.service;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.dto.SmartRecommendationDTO;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.dto.UserProfileDTO;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.*;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SmartOnboardingService {

    private final CareerRepository careerRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final AiAnalysisService aiAnalysisService;

    public List<SmartRecommendationDTO> getSmartRecommendations(
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = userProfileRepository
                .findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException(
                "Profile not found"));

        List<String> knownLangs = splitTags(profile.getKnownLanguages());
        List<String> knownSkillNames = splitTags(
                profile.getKnownSkillNames());
        List<String> interests = splitTags(profile.getInterestAreas());
        List<String> workStyles = splitTags(profile.getWorkStyle());
        List<String> goals = splitTags(profile.getGoal());
        String workPref = profile.getWorkPreference();

        List<Career> allCareers = careerRepository.findAll();
        List<SmartRecommendationDTO> scored = new ArrayList<>();

        for (Career career : allCareers) {
            int score = 0;

            // Interest match — 30 points
            List<String> careerInterests = splitTags(
                    career.getInterestTags());
            score += matchScore(interests, careerInterests, 30);

            // Work style match — 20 points
            List<String> careerWorkStyle = splitTags(
                    career.getWorkStyleTags());
            score += matchScore(workStyles, careerWorkStyle, 20);

            // Goal match — 15 points
            List<String> careerGoals = splitTags(career.getGoalTags());
            score += matchScore(goals, careerGoals, 15);

            // Work preference match — 15 points
            if (workPref != null && career.getTitle() != null) {
                String titleLower = career.getTitle().toLowerCase();
                String prefLower = workPref.toLowerCase();
                if (prefLower.equals("frontend")
                        && (titleLower.contains("frontend")
                        || titleLower.contains("react")
                        || titleLower.contains("vue")
                        || titleLower.contains("angular"))) {
                    score += 15; 
                }else if (prefLower.equals("backend")
                        && (titleLower.contains("backend")
                        || titleLower.contains("java")
                        || titleLower.contains("python")
                        || titleLower.contains("node"))) {
                    score += 15; 
                }else if (prefLower.equals("fullstack")
                        && titleLower.contains("full stack")) {
                    score += 15; 
                }else if (prefLower.equals("data")
                        && (titleLower.contains("data")
                        || titleLower.contains("analyst")
                        || titleLower.contains("scientist"))) {
                    score += 15; 
                }else if (prefLower.equals("ai")
                        && (titleLower.contains("ml")
                        || titleLower.contains("ai")
                        || titleLower.contains("nlp")
                        || titleLower.contains("vision")
                        || titleLower.contains("llm"))) {
                    score += 15; 
                }else if (prefLower.equals("mobile")
                        && (titleLower.contains("flutter")
                        || titleLower.contains("android")
                        || titleLower.contains("ios")
                        || titleLower.contains("react native"))) {
                    score += 15; 
                }else if (prefLower.equals("security")
                        && (titleLower.contains("security")
                        || titleLower.contains("penetration"))) {
                    score += 15; 
                }else if (prefLower.equals("design")
                        && (titleLower.contains("design")
                        || titleLower.contains("ui")
                        || titleLower.contains("ux"))) {
                    score += 15;
                }
            }

            // Known skills bonus — 20 points max
            Set<Skill> careerSkills = career.getSkills();
            long skillMatches = careerSkills.stream()
                    .filter(s -> knownSkillNames.stream()
                    .anyMatch(k -> k.equalsIgnoreCase(s.getName())))
                    .count();

            int skillBonus = careerSkills.isEmpty() ? 0
                    : (int) Math.min(20,
                            (skillMatches * 20.0
                            / careerSkills.size()));
            score += skillBonus;

            // Known languages bonus
            for (String lang : knownLangs) {
                if (career.getTitle().toLowerCase()
                        .contains(lang.toLowerCase())
                        || career.getInterestTags() != null
                        && career.getInterestTags().toLowerCase()
                                .contains(lang.toLowerCase())) {
                    score += 5;
                }
            }

            if (score > 0) {
                SmartRecommendationDTO dto
                        = new SmartRecommendationDTO();
                dto.setCareerId(career.getId());
                dto.setCareerTitle(career.getTitle());
                dto.setDescription(career.getDescription());
                dto.setAvgSalary(career.getAvgSalary());
                dto.setDemandLevel(career.getDemandLevel() != null
                        ? career.getDemandLevel().name() : "");
                dto.setMatchScore(Math.min(score, 100));
                dto.setSkillMatchCount((int) skillMatches);
                dto.setTotalSkillsRequired(careerSkills.size());
                scored.add(dto);
            }
        }

        // Sort by score and take top 3
        scored.sort(Comparator.comparingInt(
                SmartRecommendationDTO::getMatchScore).reversed());
        List<SmartRecommendationDTO> top3 = scored.stream()
                .limit(3)
                .collect(Collectors.toList());

        // Generate AI explanation for each
        top3.forEach(rec -> {
            try {
                String explanation = generateExplanation(
                        rec, profile);
                rec.setAiExplanation(explanation);
            } catch (Exception e) {
                rec.setAiExplanation(
                        "This career aligns well with your skills and interests.");
            }
        });

        return top3;
    }

    private String generateExplanation(
            SmartRecommendationDTO rec,
            UserProfile profile) {

        String prompt = """
            In exactly 2 sentences, explain why '%s' is a great career match for this student.
            Student profile: knows %s, interested in %s, prefers %s work, goal is %s.
            They already know %d out of %d required skills.
            Be encouraging, specific and concise. No markdown.
            """.formatted(
                rec.getCareerTitle(),
                profile.getKnownSkillNames() != null
                ? profile.getKnownSkillNames() : "basic concepts",
                profile.getInterestAreas() != null
                ? profile.getInterestAreas() : "technology",
                profile.getWorkPreference() != null
                ? profile.getWorkPreference() : "various",
                profile.getGoal() != null
                ? profile.getGoal() : "getting a job",
                rec.getSkillMatchCount(),
                rec.getTotalSkillsRequired()
        );

        return aiAnalysisService.generateText(prompt);
    }

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
