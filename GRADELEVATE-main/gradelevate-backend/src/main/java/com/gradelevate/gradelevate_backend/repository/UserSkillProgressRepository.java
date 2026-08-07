package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.repository;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.UserSkillProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserSkillProgressRepository
        extends JpaRepository<UserSkillProgress, Long> {

    List<UserSkillProgress> findByUserId(Long userId);

    List<UserSkillProgress> findByUserIdAndCareerId(
            Long userId, Long careerId);

    Optional<UserSkillProgress> findByUserIdAndSkillIdAndCareerId(
            Long userId, Long skillId, Long careerId);

    long countByUserIdAndCareerIdAndStatus(
            Long userId, Long careerId,
            UserSkillProgress.ProgressStatus status);
}
