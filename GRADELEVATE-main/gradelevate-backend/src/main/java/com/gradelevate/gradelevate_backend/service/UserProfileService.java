package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.service;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.dto.UserProfileDTO;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.*;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    public UserProfile saveOrUpdateProfile(String email,
            UserProfileDTO dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(()
                        -> new RuntimeException("User not found"));

        UserProfile profile = userProfileRepository
                .findByUserId(user.getId())
                .orElse(new UserProfile());

        profile.setUser(user);
        profile.setEducationLevel(dto.getEducationLevel());
        profile.setGoal(dto.getGoal());
        profile.setWorkStyle(dto.getWorkStyle());
        profile.setInterestAreas(dto.getInterestAreas());
        profile.setOnboardingType(dto.getOnboardingType());
        profile.setKnownLanguages(dto.getKnownLanguages());
        profile.setKnownSkills(dto.getKnownSkills());
        profile.setKnownSkillNames(dto.getKnownSkillNames());
        profile.setExperienceLevel(dto.getExperienceLevel());
        profile.setCareerInMind(dto.getCareerInMind());
        profile.setCareerInMindId(dto.getCareerInMindId());
        profile.setWorkPreference(dto.getWorkPreference());
        profile.setDailyHours(dto.getDailyHours());
        profile.setOnboardingCompleted(dto.getOnboardingCompleted());

        return userProfileRepository.save(profile);
    }

    public UserProfile getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return userProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException(
                "Profile not found"));
    }
}
