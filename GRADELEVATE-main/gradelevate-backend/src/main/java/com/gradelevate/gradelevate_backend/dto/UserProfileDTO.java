package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.dto;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.UserProfile;
import lombok.Data;

@Data
public class UserProfileDTO {

    private UserProfile.EducationLevel educationLevel;
    private String goal;
    private String workStyle;
    private String interestAreas;
    private UserProfile.OnboardingType onboardingType;
    private String knownLanguages;
    private String knownSkills;
    private String knownSkillNames;
    private String experienceLevel;
    private String careerInMind;
    private Long careerInMindId;
    private String workPreference;
    private String dailyHours;
    private Boolean onboardingCompleted;
}
