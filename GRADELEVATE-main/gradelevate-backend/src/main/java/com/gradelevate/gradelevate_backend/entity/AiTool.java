package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ai_tools")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiTool {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "use_case", columnDefinition = "TEXT")
    private String useCase;         // When and how to use this tool

    @Column(name = "website_url")
    private String websiteUrl;

    @Column(name = "logo_url")
    private String logoUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "pricing_type")
    private PricingType pricingType;

    private String category;        // Writing, Coding, Design, Research etc.

    public enum PricingType {
        FREE, FREEMIUM, PAID
    }
}
