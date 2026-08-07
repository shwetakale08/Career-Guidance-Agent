package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.controller;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.dto.CareerDTO;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.Career;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.service.CareerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/careers")
@RequiredArgsConstructor
public class CareerController {

    private final CareerService careerService;

    @GetMapping
    public ResponseEntity<List<Career>> getAllCareers() {
        return ResponseEntity.ok(careerService.getAllCareers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Career> getCareer(@PathVariable Long id) {
        return ResponseEntity.ok(careerService.getCareerById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Career>> searchCareers(
            @RequestParam String keyword) {
        return ResponseEntity.ok(careerService.searchCareers(keyword));
    }

    // Admin only
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Career> createCareer(
            @Valid @RequestBody CareerDTO dto) {
        return ResponseEntity.ok(careerService.createCareer(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Career> updateCareer(
            @PathVariable Long id,
            @Valid @RequestBody CareerDTO dto) {
        return ResponseEntity.ok(careerService.updateCareer(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCareer(@PathVariable Long id) {
        careerService.deleteCareer(id);
        return ResponseEntity.noContent().build();
    }
}
