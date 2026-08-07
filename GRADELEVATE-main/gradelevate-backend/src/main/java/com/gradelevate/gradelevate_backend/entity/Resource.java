package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "resources")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceType type;

    @Column(nullable = false)
    private String url;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @ManyToOne
    @JoinColumn(name = "skill_id")
    @JsonBackReference("skill-resources")
    private Skill skill;

    @ManyToOne
    @JoinColumn(name = "career_id")
    @JsonIgnore
    private Career career;

    public enum ResourceType {
        VIDEO, PLAYLIST, GITHUB_REPO, ARTICLE, COURSE
    }
}
