package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.repository;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.Career;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CareerRepository extends JpaRepository<Career, Long> {

    List<Career> findByTitleContainingIgnoreCase(String keyword);

    List<Career> findByDemandLevel(Career.DemandLevel demandLevel);
}
