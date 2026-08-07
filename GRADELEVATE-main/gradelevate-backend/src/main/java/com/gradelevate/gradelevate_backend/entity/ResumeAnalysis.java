package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "resume_analyses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "resume_id", nullable = false)
    @JsonBackReference("resume-analysis")
    private Resume resume;

    @Column(name = "ai_feedback", columnDefinition = "TEXT")
    private String aiFeedback; // JSON string from AI response

    private Integer score; // 0-100 resume score

    @Column(name = "analyzed_at")
    @CreationTimestamp
    private LocalDateTime analyzedAt;
}
