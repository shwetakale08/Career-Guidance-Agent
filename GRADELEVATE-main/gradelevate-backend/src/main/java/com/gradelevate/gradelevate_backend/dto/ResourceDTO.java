package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.dto;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.Resource;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ResourceDTO {

    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Resource type is required")
    private Resource.ResourceType type;

    @NotBlank(message = "URL is required")
    private String url;

    private String thumbnailUrl;

    private Long skillId;
    private Long careerId;
}
