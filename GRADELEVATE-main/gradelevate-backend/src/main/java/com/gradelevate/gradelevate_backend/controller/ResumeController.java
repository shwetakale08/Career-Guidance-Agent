package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.controller;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.*;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    // Upload resume and get AI analysis
    @PostMapping("/upload")
    public ResponseEntity<Resume> uploadResume(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "jobDescription", required = false) String jobDescription) {

        return ResponseEntity.ok(
                resumeService.uploadAndAnalyze(
                        userDetails.getUsername(), file, jobDescription));
    }

    // Get all resumes uploaded by user
    @GetMapping("/my-resumes")
    public ResponseEntity<List<Resume>> getMyResumes(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                resumeService.getUserResumes(
                        userDetails.getUsername()));
    }

    // Get analysis for a specific resume
    @GetMapping("/{resumeId}/analysis")
    public ResponseEntity<ResumeAnalysis> getAnalysis(
            @PathVariable Long resumeId) {

        return ResponseEntity.ok(
                resumeService.getAnalysis(resumeId));
    }
}
