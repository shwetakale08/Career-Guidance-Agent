package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.dto;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.AiTool;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AiToolDTO {

    private Long id;

    @NotBlank(message = "Tool name is required")
    private String name;

    private String description;

    private String useCase;

    private String websiteUrl;

    private String logoUrl;

    @NotNull(message = "Pricing type is required")
    private AiTool.PricingType pricingType;

    @NotBlank(message = "Category is required")
    private String category;
}
