package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.repository;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {

    List<Resume> findByUserIdOrderByUploadedAtDesc(Long userId);
}
