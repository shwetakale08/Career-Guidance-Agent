package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.dto;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.Career;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CareerDTO {

    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private String avgSalary;
    private Career.DemandLevel demandLevel;
    private String interestTags;
    private String workStyleTags;
    private String goalTags;
}
