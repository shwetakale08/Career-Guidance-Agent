package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SkillDTO {

    private Long id;

    @NotBlank(message = "Skill name is required")
    private String name;

    private String category;
    private String description;
}
