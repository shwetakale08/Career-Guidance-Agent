package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.controller;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.dto.*;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.*;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final CareerService careerService;
    private final SkillService skillService;
    private final ResourceService resourceService;
    private final AiToolService aiToolService;

    // Stats
    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDTO> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    // Career management
    @GetMapping("/careers")
    public ResponseEntity<List<Career>> getCareers() {
        return ResponseEntity.ok(careerService.getAllCareers());
    }

    @PostMapping("/careers")
    public ResponseEntity<Career> createCareer(@Valid @RequestBody CareerDTO dto) {
        return ResponseEntity.ok(careerService.createCareer(dto));
    }

    @PutMapping("/careers/{id}")
    public ResponseEntity<Career> updateCareer(@PathVariable Long id, @Valid @RequestBody CareerDTO dto) {
        return ResponseEntity.ok(careerService.updateCareer(id, dto));
    }

    @DeleteMapping("/careers/{id}")
    public ResponseEntity<Void> deleteCareer(@PathVariable Long id) {
        careerService.deleteCareer(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/careers/{careerId}/skills/{skillId}")
    public ResponseEntity<Career> addSkillToCareer(@PathVariable Long careerId, @PathVariable Long skillId) {
        return ResponseEntity.ok(careerService.addSkillToCareer(careerId, skillId));
    }

    @DeleteMapping("/careers/{careerId}/skills/{skillId}")
    public ResponseEntity<Career> removeSkillFromCareer(@PathVariable Long careerId, @PathVariable Long skillId) {
        return ResponseEntity.ok(careerService.removeSkillFromCareer(careerId, skillId));
    }

    // Skill management
    @GetMapping("/skills")
    public ResponseEntity<List<Skill>> getSkills() {
        return ResponseEntity.ok(skillService.getAllSkills());
    }

    @PostMapping("/skills")
    public ResponseEntity<Skill> createSkill(@Valid @RequestBody SkillDTO dto) {
        return ResponseEntity.ok(skillService.createSkill(dto));
    }

    @PutMapping("/skills/{id}")
    public ResponseEntity<Skill> updateSkill(@PathVariable Long id, @Valid @RequestBody SkillDTO dto) {
        return ResponseEntity.ok(skillService.updateSkill(id, dto));
    }

    @DeleteMapping("/skills/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable Long id) {
        skillService.deleteSkill(id);
        return ResponseEntity.noContent().build();
    }

    // Resource management
    @GetMapping("/resources")
    public ResponseEntity<List<Resource>> getResources() {
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    @PostMapping("/resources")
    public ResponseEntity<Resource> createResource(@Valid @RequestBody ResourceDTO dto) {
        return ResponseEntity.ok(resourceService.createResource(dto));
    }

    @DeleteMapping("/resources/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }

    // AI Tools management
    @GetMapping("/ai-tools")
    public ResponseEntity<List<AiTool>> getAiTools() {
        return ResponseEntity.ok(aiToolService.getAllTools());
    }

    @PostMapping("/ai-tools")
    public ResponseEntity<AiTool> createAiTool(@Valid @RequestBody AiToolDTO dto) {
        return ResponseEntity.ok(aiToolService.createTool(dto));
    }

    @PutMapping("/ai-tools/{id}")
    public ResponseEntity<AiTool> updateAiTool(@PathVariable Long id, @Valid @RequestBody AiToolDTO dto) {
        return ResponseEntity.ok(aiToolService.updateTool(id, dto));
    }

    @DeleteMapping("/ai-tools/{id}")
    public ResponseEntity<Void> deleteAiTool(@PathVariable Long id) {
        aiToolService.deleteTool(id);
        return ResponseEntity.noContent().build();
    }
}
