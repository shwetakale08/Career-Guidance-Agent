package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.controller;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.dto.*;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.UserProfile;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class RecommendationController {

    private final UserProfileService userProfileService;
    private final RecommendationService recommendationService;
    private final SmartOnboardingService smartOnboardingService;

    // Save or update onboarding profile
    @PostMapping("/profile")
    public ResponseEntity<UserProfile> saveProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UserProfileDTO dto) {

        return ResponseEntity.ok(
                userProfileService.saveOrUpdateProfile(
                        userDetails.getUsername(), dto));
    }

    // Add this endpoint
    @GetMapping("/smart-recommendations")
    public ResponseEntity<List<SmartRecommendationDTO>> getSmartRecommendations(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                smartOnboardingService.getSmartRecommendations(
                        userDetails.getUsername()));
    }

    // Get current profile
    @GetMapping("/profile")
    public ResponseEntity<UserProfile> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                userProfileService.getProfile(
                        userDetails.getUsername()));
    }

    // Get career recommendations
    @GetMapping("/recommendations")
    public ResponseEntity<List<CareerRecommendationDTO>> getRecommendations(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                recommendationService.recommendCareers(
                        userDetails.getUsername()));
    }

    // Get skill gap for a specific career
    @GetMapping("/skill-gap/{careerId}")
    public ResponseEntity<SkillGapDTO> getSkillGap(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long careerId) {

        return ResponseEntity.ok(
                recommendationService.getSkillGap(
                        userDetails.getUsername(), careerId));
    }
}
