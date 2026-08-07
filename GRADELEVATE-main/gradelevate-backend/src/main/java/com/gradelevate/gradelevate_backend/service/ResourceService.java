package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.service;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.dto.ResourceDTO;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.*;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final SkillRepository skillRepository;
    private final CareerRepository careerRepository;

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Resource getResourceById(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
    }

    public List<Resource> getResourcesBySkill(Long skillId) {
        return resourceRepository.findBySkillIdOrderByTypeAsc(skillId);
    }

    public List<Resource> getResourcesByCareer(Long careerId) {
        return resourceRepository.findByCareerId(careerId);
    }

    public Resource createResource(ResourceDTO dto) {
        Skill skill = dto.getSkillId() != null
                ? skillRepository.findById(dto.getSkillId()).orElse(null) : null;

        Career career = dto.getCareerId() != null
                ? careerRepository.findById(dto.getCareerId()).orElse(null) : null;

        Resource resource = Resource.builder()
                .title(dto.getTitle())
                .type(dto.getType())
                .url(dto.getUrl())
                .thumbnailUrl(dto.getThumbnailUrl())
                .skill(skill)
                .career(career)
                .build();

        return resourceRepository.save(resource);
    }

    public void deleteResource(Long id) {
        resourceRepository.deleteById(id);
    }
}
