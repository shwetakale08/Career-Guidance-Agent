package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.dto;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.Career;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.Skill;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class SkillGapDTO {

    private String careerTitle;
    private List<Skill> missingSkills;
    private List<Skill> knownSkills;
    private List<String> learningOrder;

    public SkillGapDTO(Career career,
            List<Skill> missingSkills,
            List<Skill> knownSkills) {
        this.careerTitle = career.getTitle();
        this.missingSkills = missingSkills;
        this.knownSkills = knownSkills;
    }
}
