package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SmartRecommendationDTO {

    private Long careerId;
    private String careerTitle;
    private String description;
    private String avgSalary;
    private String demandLevel;
    private int matchScore;
    private int skillMatchCount;
    private int totalSkillsRequired;
    private String aiExplanation;
}
