package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.service;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.dto.CareerDTO;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.Career;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.Skill;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.repository.CareerRepository;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CareerService {

    private final CareerRepository careerRepository;
    private final SkillRepository skillRepository;

    public List<Career> getAllCareers() {
        return careerRepository.findAll();
    }

    public Career getCareerById(Long id) {
        return careerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Career not found"));
    }

    public List<Career> searchCareers(String keyword) {
        return careerRepository.findByTitleContainingIgnoreCase(keyword);
    }

    public Career createCareer(CareerDTO dto) {
        Career career = Career.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .avgSalary(dto.getAvgSalary())
                .demandLevel(dto.getDemandLevel())
                .interestTags(dto.getInterestTags())
                .workStyleTags(dto.getWorkStyleTags())
                .goalTags(dto.getGoalTags())
                .build();
        return careerRepository.save(career);
    }

    public Career updateCareer(Long id, CareerDTO dto) {
        Career career = getCareerById(id);
        career.setTitle(dto.getTitle());
        career.setDescription(dto.getDescription());
        career.setAvgSalary(dto.getAvgSalary());
        career.setDemandLevel(dto.getDemandLevel());
        career.setInterestTags(dto.getInterestTags());
        career.setWorkStyleTags(dto.getWorkStyleTags());
        career.setGoalTags(dto.getGoalTags());
        return careerRepository.save(career);
    }

    public void deleteCareer(Long id) {
        careerRepository.deleteById(id);
    }

    public Career addSkillToCareer(Long careerId, Long skillId) {
        Career career = getCareerById(careerId);
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found"));
        career.getSkills().add(skill);
        return careerRepository.save(career);
    }

    public Career removeSkillFromCareer(Long careerId, Long skillId) {
        Career career = getCareerById(careerId);
        career.getSkills().removeIf(s -> s.getId().equals(skillId));
        return careerRepository.save(career);
    }

}
