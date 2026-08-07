package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.service;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.dto.AiToolDTO;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.AiTool;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.repository.AiToolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AiToolService {

    private final AiToolRepository aiToolRepository;

    public List<AiTool> getAllTools() {
        return aiToolRepository.findAll();
    }

    public AiTool getToolById(Long id) {
        return aiToolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AI Tool not found"));
    }

    public List<AiTool> getByCategory(String category) {
        return aiToolRepository.findByCategory(category);
    }

    public List<AiTool> getByPricingType(String pricingType) {
        return aiToolRepository.findByPricingType(
                AiTool.PricingType.valueOf(pricingType.toUpperCase()));
    }

    public List<AiTool> searchTools(String keyword) {
        return aiToolRepository.findByNameContainingIgnoreCase(keyword);
    }

    public List<AiTool> filterTools(String category, String pricingType) {
        // Both filters applied together
        if (category != null && pricingType != null) {
            return aiToolRepository.findByCategoryAndPricingType(
                    category,
                    AiTool.PricingType.valueOf(pricingType.toUpperCase()));
        }
        // Only category
        if (category != null) {
            return aiToolRepository.findByCategory(category);
        }
        // Only pricing
        if (pricingType != null) {
            return aiToolRepository.findByPricingType(
                    AiTool.PricingType.valueOf(pricingType.toUpperCase()));
        }
        // No filter — return all
        return aiToolRepository.findAll();
    }

    public AiTool createTool(AiToolDTO dto) {
        AiTool tool = AiTool.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .useCase(dto.getUseCase())
                .websiteUrl(dto.getWebsiteUrl())
                .logoUrl(dto.getLogoUrl())
                .pricingType(dto.getPricingType())
                .category(dto.getCategory())
                .build();
        return aiToolRepository.save(tool);
    }

    public AiTool updateTool(Long id, AiToolDTO dto) {
        AiTool tool = getToolById(id);
        tool.setName(dto.getName());
        tool.setDescription(dto.getDescription());
        tool.setUseCase(dto.getUseCase());
        tool.setWebsiteUrl(dto.getWebsiteUrl());
        tool.setLogoUrl(dto.getLogoUrl());
        tool.setPricingType(dto.getPricingType());
        tool.setCategory(dto.getCategory());
        return aiToolRepository.save(tool);
    }

    public void deleteTool(Long id) {
        aiToolRepository.deleteById(id);
    }
}
