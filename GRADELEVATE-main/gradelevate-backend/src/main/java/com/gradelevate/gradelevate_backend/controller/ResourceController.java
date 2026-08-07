package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.controller;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.dto.ResourceDTO;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.Resource;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources() {
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResource(@PathVariable Long id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }

    @GetMapping("/skill/{skillId}")
    public ResponseEntity<List<Resource>> getBySkill(
            @PathVariable Long skillId) {
        return ResponseEntity.ok(resourceService.getResourcesBySkill(skillId));
    }

    @GetMapping("/career/{careerId}")
    public ResponseEntity<List<Resource>> getByCareer(
            @PathVariable Long careerId) {
        return ResponseEntity.ok(resourceService.getResourcesByCareer(careerId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> createResource(
            @Valid @RequestBody ResourceDTO dto) {
        return ResponseEntity.ok(resourceService.createResource(dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}
