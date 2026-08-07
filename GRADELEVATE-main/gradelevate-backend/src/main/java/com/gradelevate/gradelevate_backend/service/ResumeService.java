package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.service;

import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.entity.*;
import com.AI Career Guidance Agent.AI Career Guidance Agent_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.nio.file.Path;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ObjectMapper objectMapper;
    private final ResumeRepository resumeRepository;
    private final ResumeAnalysisRepository resumeAnalysisRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final PdfExtractorService pdfExtractorService;
    private final AiAnalysisService aiAnalysisService;

    public Resume uploadAndAnalyze(String email,
            MultipartFile file,
            String jobDescription) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null
                || !originalFilename.endsWith(".pdf")) {
            throw new RuntimeException("Only PDF files are allowed");
        }

        String fileUrl = fileStorageService.saveFile(file);

        Resume resume = Resume.builder()
                .user(user)
                .fileUrl(fileUrl)
                .originalFilename(originalFilename)
                .build();
        resumeRepository.save(resume);

        Path filePath = fileStorageService.getFilePath(fileUrl);
        String resumeText = pdfExtractorService.extractText(filePath);

        // Pass job description — can be null
        String aiFeedback = aiAnalysisService.analyzeResume(
                resumeText, jobDescription);

        int score = parseScoreFromFeedback(aiFeedback);
        System.out.println("=== AI FEEDBACK RAW ===");
        System.out.println(aiFeedback);
        System.out.println("=== END ===");

        ResumeAnalysis analysis = ResumeAnalysis.builder()
                .resume(resume)
                .aiFeedback(aiFeedback)
                .score(score)
                .build();
        resumeAnalysisRepository.save(analysis);

        resume.setAnalysis(analysis);
        return resume;
    }

    public List<Resume> getUserResumes(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return resumeRepository
                .findByUserIdOrderByUploadedAtDesc(user.getId());
    }

    public ResumeAnalysis getAnalysis(Long resumeId) {
        return resumeAnalysisRepository.findByResumeId(resumeId)
                .orElseThrow(() -> new RuntimeException("Analysis not found"));
    }

    private int parseScoreFromFeedback(String feedback) {
        try {
            Map<String, Object> parsed = objectMapper.readValue(feedback, Map.class);
            Object score = parsed.get("score");
            if (score instanceof Integer) {
                return (Integer) score;
            }
            if (score instanceof Double) {
                return ((Double) score).intValue();
            }
            return Integer.parseInt(score.toString());
        } catch (Exception e) {
            return 0;
        }
    }
}
