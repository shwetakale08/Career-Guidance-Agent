package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.repository;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    Optional<UserProfile> findByUserId(Long userId);
}
