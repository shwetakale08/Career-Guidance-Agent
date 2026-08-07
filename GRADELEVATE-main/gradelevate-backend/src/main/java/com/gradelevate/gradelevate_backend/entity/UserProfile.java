package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Enumerated(EnumType.STRING)
    private EducationLevel educationLevel;

    private String goal;
    private String workStyle;
    private String interestAreas;

    // New fields for smart onboarding
    @Enumerated(EnumType.STRING)
    @Column(name = "onboarding_type")
    private OnboardingType onboardingType;

    @Column(name = "known_languages")
    private String knownLanguages;    // comma separated: "python,java,javascript"

    @Column(name = "known_skills")
    private String knownSkills;       // comma separated skill ids: "1,2,3"

    @Column(name = "known_skill_names")
    private String knownSkillNames;   // comma separated: "Spring Boot,React.js"

    @Column(name = "experience_level")
    private String experienceLevel;   // BEGINNER, BASIC, INTERMEDIATE, ADVANCED

    @Column(name = "career_in_mind")
    private String careerInMind;      // career title user has in mind

    @Column(name = "career_in_mind_id")
    private Long careerInMindId;

    @Column(name = "work_preference")
    private String workPreference;    // FRONTEND, BACKEND, FULLSTACK, DATA, AI, DESIGN, SECURITY, MOBILE

    @Column(name = "daily_hours")
    private String dailyHours;        // 1-2, 3-4, 5+

    @Column(name = "onboarding_completed")
    private Boolean onboardingCompleted = false;

    @Column(name = "profile_pic_url")
    private String profilePicUrl;

    public enum EducationLevel {
        TENTH, TWELFTH, UNDERGRADUATE, GRADUATE
    }

    public enum OnboardingType {
        CONFUSED, HAS_IDEA
    }
}
