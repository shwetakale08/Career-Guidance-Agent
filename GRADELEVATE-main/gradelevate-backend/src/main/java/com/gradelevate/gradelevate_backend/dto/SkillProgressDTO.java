package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.dto;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.UserSkillProgress;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SkillProgressDTO {

    private Long skillId;
    private String skillName;
    private Long careerId;
    private String careerTitle;
    private UserSkillProgress.ProgressStatus status;
}
