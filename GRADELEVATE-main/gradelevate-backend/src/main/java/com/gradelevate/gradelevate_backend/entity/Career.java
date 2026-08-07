package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "careers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Career {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "avg_salary")
    private String avgSalary;

    @Enumerated(EnumType.STRING)
    @Column(name = "demand_level")
    private DemandLevel demandLevel;

    // Tags for matching algorithm
    @Column(name = "interest_tags")
    private String interestTags;   // comma separated: "technology,analysis,math"

    @Column(name = "work_style_tags")
    private String workStyleTags;  // comma separated: "analytical,problem-solving"

    @Column(name = "goal_tags")
    private String goalTags;       // comma separated: "job,freelance"

    @ManyToMany
    @JoinTable(
            name = "career_skills",
            joinColumns = @JoinColumn(name = "career_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    @JsonManagedReference("career-skills")
    private Set<Skill> skills = new HashSet<>();

    public enum DemandLevel {
        LOW, MEDIUM, HIGH, VERY_HIGH
    }
}
