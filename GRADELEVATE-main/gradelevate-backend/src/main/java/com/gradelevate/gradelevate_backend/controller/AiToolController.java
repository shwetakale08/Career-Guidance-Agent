package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.controller;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.dto.AiToolDTO;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.AiTool;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.service.AiToolService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai-tools")
@RequiredArgsConstructor
public class AiToolController {

    private final AiToolService aiToolService;

    // Get all tools — public
    @GetMapping
    public ResponseEntity<List<AiTool>> getAllTools() {
        return ResponseEntity.ok(aiToolService.getAllTools());
    }

    // Get single tool — public
    @GetMapping("/{id}")
    public ResponseEntity<AiTool> getTool(@PathVariable Long id) {
        return ResponseEntity.ok(aiToolService.getToolById(id));
    }

    // Search by name — public
    @GetMapping("/search")
    public ResponseEntity<List<AiTool>> searchTools(
            @RequestParam String keyword) {
        return ResponseEntity.ok(aiToolService.searchTools(keyword));
    }

    // Filter by category and/or pricing — public
    @GetMapping("/filter")
    public ResponseEntity<List<AiTool>> filterTools(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String pricingType) {
        return ResponseEntity.ok(
                aiToolService.filterTools(category, pricingType));
    }

    // Get by category — public
    @GetMapping("/category/{category}")
    public ResponseEntity<List<AiTool>> getByCategory(
            @PathVariable String category) {
        return ResponseEntity.ok(aiToolService.getByCategory(category));
    }

    // Admin only — create
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AiTool> createTool(
            @Valid @RequestBody AiToolDTO dto) {
        return ResponseEntity.ok(aiToolService.createTool(dto));
    }

    // Admin only — update
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AiTool> updateTool(
            @PathVariable Long id,
            @Valid @RequestBody AiToolDTO dto) {
        return ResponseEntity.ok(aiToolService.updateTool(id, dto));
    }

    // Admin only — delete
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTool(@PathVariable Long id) {
        aiToolService.deleteTool(id);
        return ResponseEntity.noContent().build();
    }
}
