package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.repository;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    // Find unverified users older than a given time
    @Query("SELECT u FROM User u WHERE u.isVerified = false AND u.createdAt < :cutoff")
    List<User> findUnverifiedUsersBefore(LocalDateTime cutoff);
}
