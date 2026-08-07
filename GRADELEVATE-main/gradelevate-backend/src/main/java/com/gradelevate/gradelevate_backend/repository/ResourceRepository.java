package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.repository;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    List<Resource> findBySkillId(Long skillId);

    List<Resource> findByCareerId(Long careerId);

    List<Resource> findByType(Resource.ResourceType type);

    List<Resource> findBySkillIdOrderByTypeAsc(Long skillId);
}
