package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.service;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.dto.SkillDTO;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.Skill;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;

    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    public Skill getSkillById(Long id) {
        return skillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill not found"));
    }

    public List<Skill> getSkillsByCategory(String category) {
        return skillRepository.findByCategory(category);
    }

    public List<Skill> searchSkills(String keyword) {
        return skillRepository.findByNameContainingIgnoreCase(keyword);
    }

    public Skill createSkill(SkillDTO dto) {
        Skill skill = Skill.builder()
                .name(dto.getName())
                .category(dto.getCategory())
                .description(dto.getDescription())
                .build();
        return skillRepository.save(skill);
    }

    public Skill updateSkill(Long id, SkillDTO dto) {
        Skill skill = getSkillById(id);
        skill.setName(dto.getName());
        skill.setCategory(dto.getCategory());
        skill.setDescription(dto.getDescription());
        return skillRepository.save(skill);
    }

    public void deleteSkill(Long id) {
        skillRepository.deleteById(id);
    }

    // Link a skill to a career
    public void addSkillToCareer(Long skillId, Long careerId) {
        // handled in CareerService
    }
}
