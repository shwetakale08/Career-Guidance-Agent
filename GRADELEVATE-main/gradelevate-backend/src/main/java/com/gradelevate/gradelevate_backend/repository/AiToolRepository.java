package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.repository;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.AiTool;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiToolRepository extends JpaRepository<AiTool, Long> {

    List<AiTool> findByCategory(String category);

    List<AiTool> findByPricingType(AiTool.PricingType pricingType);

    List<AiTool> findByNameContainingIgnoreCase(String keyword);

    List<AiTool> findByCategoryAndPricingType(
            String category, AiTool.PricingType pricingType);
}
