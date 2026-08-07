package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.controller;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.dto.*;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.service.SkillProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class SkillProgressController {

    private final SkillProgressService progressService;

    // Mark skill as learning or completed
    @PostMapping("/mark")
    public ResponseEntity<SkillProgressDTO> markSkill(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> body) {

        Long skillId = Long.valueOf(
                body.get("skillId").toString());
        Long careerId = Long.valueOf(
                body.get("careerId").toString());
        String status = body.get("status").toString();

        return ResponseEntity.ok(
                progressService.markSkill(
                        userDetails.getUsername(),
                        skillId, careerId, status));
    }

    // Unmark skill
    @DeleteMapping("/unmark")
    public ResponseEntity<Void> unmarkSkill(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> body) {

        Long skillId = Long.valueOf(
                body.get("skillId").toString());
        Long careerId = Long.valueOf(
                body.get("careerId").toString());

        progressService.unmarkSkill(
                userDetails.getUsername(), skillId, careerId);
        return ResponseEntity.noContent().build();
    }

    // Get readiness for a specific career
    @GetMapping("/career/{careerId}")
    public ResponseEntity<CareerReadinessDTO> getCareerReadiness(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long careerId) {

        return ResponseEntity.ok(
                progressService.getCareerReadiness(
                        userDetails.getUsername(), careerId));
    }

    // Get all progress
    @GetMapping("/all")
    public ResponseEntity<List<SkillProgressDTO>> getAllProgress(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                progressService.getAllProgress(
                        userDetails.getUsername()));
    }
}
