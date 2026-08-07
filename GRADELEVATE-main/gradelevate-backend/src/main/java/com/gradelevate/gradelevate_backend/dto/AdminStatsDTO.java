package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminStatsDTO {

    private long totalUsers;
    private long totalCareers;
    private long totalSkills;
    private long totalResources;
    private long totalAiTools;
    private long totalResumes;
}
