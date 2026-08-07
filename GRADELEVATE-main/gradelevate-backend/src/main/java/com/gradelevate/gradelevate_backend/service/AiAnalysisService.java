package com.AI

Career Guidance Agent.AI Career Guidance Agent_backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AiAnalysisService {

    @Value("${ai.gemini.api.key}")
    private String apiKey;

    @Value("${ai.gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    // Prerequisite map — key must come before value
    private static final Map<String, String> PREREQUISITES = new LinkedHashMap<>();

    static {
        // Python ecosystem
        PREREQUISITES.put("django", "django rest framework");
        PREREQUISITES.put("django", "pydantic");
        PREREQUISITES.put("django", "celery");
        PREREQUISITES.put("flask", "django");
        PREREQUISITES.put("fastapi", "pydantic");
        PREREQUISITES.put("python", "django");
        PREREQUISITES.put("python", "flask");
        PREREQUISITES.put("python", "fastapi");
        PREREQUISITES.put("python", "sqlalchemy");
        PREREQUISITES.put("python", "celery");
        PREREQUISITES.put("python", "pytest");
        PREREQUISITES.put("postgresql", "sqlalchemy");
        PREREQUISITES.put("mysql", "sqlalchemy");

        // Java ecosystem
        PREREQUISITES.put("java", "spring framework");
        PREREQUISITES.put("java", "spring boot");
        PREREQUISITES.put("java", "hibernate");
        PREREQUISITES.put("java", "maven");
        PREREQUISITES.put("spring framework", "spring boot");
        PREREQUISITES.put("spring boot", "spring security");
        PREREQUISITES.put("spring boot", "spring data jpa");
        PREREQUISITES.put("spring data jpa", "hibernate");
        PREREQUISITES.put("spring boot", "jwt");

        // JavaScript/Node ecosystem
        PREREQUISITES.put("javascript", "node.js");
        PREREQUISITES.put("javascript", "express.js");
        PREREQUISITES.put("javascript", "react.js");
        PREREQUISITES.put("javascript", "vue.js");
        PREREQUISITES.put("javascript", "angular");
        PREREQUISITES.put("javascript", "typescript");
        PREREQUISITES.put("node.js", "express.js");
        PREREQUISITES.put("express.js", "nestjs");
        PREREQUISITES.put("react.js", "redux");
        PREREQUISITES.put("react.js", "next.js");
        PREREQUISITES.put("vue.js", "nuxt.js");

        // Mobile
        PREREQUISITES.put("dart", "flutter");
        PREREQUISITES.put("kotlin", "jetpack compose");
        PREREQUISITES.put("swift", "swiftui");

        // Data/ML
        PREREQUISITES.put("python", "pandas");
        PREREQUISITES.put("python", "numpy");
        PREREQUISITES.put("pandas", "scikit-learn");
        PREREQUISITES.put("numpy", "scikit-learn");
        PREREQUISITES.put("scikit-learn", "tensorflow");
        PREREQUISITES.put("scikit-learn", "pytorch");
        PREREQUISITES.put("tensorflow", "deep learning");
        PREREQUISITES.put("pytorch", "deep learning");

        // General
        PREREQUISITES.put("sql", "mysql");
        PREREQUISITES.put("sql", "postgresql");
        PREREQUISITES.put("sql", "mongodb");
        PREREQUISITES.put("oop concepts", "any framework");
        PREREQUISITES.put("data structures & algorithms", "any framework");
    }

    public String analyzeResume(String resumeText, String jobDescription) {
        String prompt;
        if (jobDescription != null && !jobDescription.isBlank()) {
            prompt = """
                You are an expert resume reviewer and ATS specialist.
                Analyze the following resume AGAINST the provided job description.
                Return ONLY a valid JSON object with this exact structure, no extra text, no markdown, no code blocks:
                {
                  "score": <number 0-100>,
                  "summary": "<2-3 sentence overall summary>",
                  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
                  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
                  "missingSections": ["<missing section 1>", "<missing section 2>"],
                  "suggestedSkills": ["<skill 1>", "<skill 2>"],
                  "careerSuggestions": ["<career 1>", "<career 2>"],
                  "jobMatchScore": <number 0-100>,
                  "matchedKeywords": ["<keyword 1>", "<keyword 2>"],
                  "missingKeywords": ["<keyword 1>", "<keyword 2>"]
                }
                IMPORTANT: Keep each string value under 150 characters. Be concise.
                Job Description:
                """ + jobDescription + "\nResume:\n" + resumeText;
        } else {
            prompt = """
                You are an expert resume reviewer.
                Analyze the following resume and return ONLY a valid JSON object with this exact structure, no extra text, no markdown, no code blocks:
                {
                  "score": <number 0-100>,
                  "summary": "<2-3 sentence overall summary>",
                  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
                  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
                  "missingSections": ["<missing section 1>", "<missing section 2>"],
                  "suggestedSkills": ["<skill 1>", "<skill 2>", "<skill 3>"],
                  "careerSuggestions": ["<career 1>", "<career 2>"],
                  "jobMatchScore": null,
                  "matchedKeywords": [],
                  "missingKeywords": []
                }
                IMPORTANT: Keep each string value under 150 characters. Be concise.
                Resume:
                """ + resumeText;
        }
        return callGemini(prompt, 8192);
    }

    public String generateText(String prompt) {
        return callGemini(prompt, 500);
    }

    public List<String> generateLearningOrder(String careerTitle,
            List<String> skillNames) {
        if (skillNames == null || skillNames.isEmpty()) {
            return skillNames;
        }

        // Step 1: Get AI order
        List<String> aiOrdered = getAiOrder(careerTitle, skillNames);

        // Step 2: Apply post-processing to fix prerequisite violations
        List<String> finalOrder = enforcePrerequisites(aiOrdered);

        return finalOrder;
    }

    private List<String> getAiOrder(String careerTitle,
            List<String> skillNames) {
        String prompt = """
                You are a senior software engineer creating a learning roadmap.
                A beginner wants to become a '%s'.
                Sort these skills from beginner to advanced in learning order: %s
                Return ONLY a JSON array of skill names. No explanation, no markdown.
                """.formatted(careerTitle, String.join(", ", skillNames));

        try {
            String response = callGemini(prompt, 600);
            response = response.trim()
                    .replaceAll("```json|```", "").trim();
            int start = response.indexOf('[');
            int end = response.lastIndexOf(']');
            if (start != -1 && end != -1) {
                String arrayStr = response.substring(start, end + 1);
                List<String> parsed = objectMapper.readValue(arrayStr,
                        objectMapper.getTypeFactory()
                                .constructCollectionType(List.class,
                                        String.class));
                // Make sure all original skills are included
                List<String> result = new ArrayList<>(parsed);
                for (String s : skillNames) {
                    if (result.stream().noneMatch(
                            r -> r.equalsIgnoreCase(s))) {
                        result.add(s);
                    }
                }
                return result;
            }
        } catch (Exception e) {
            // fall through to manual
        }
        return manualOrder(skillNames);
    }

    private List<String> enforcePrerequisites(List<String> skills) {
        List<String> result = new ArrayList<>(skills);
        boolean changed = true;
        int maxIterations = 20;

        while (changed && maxIterations-- > 0) {
            changed = false;
            for (Map.Entry<String, String> rule : PREREQUISITES.entrySet()) {
                String prereq = rule.getKey();
                String dependent = rule.getValue();

                // Skip wildcard rules
                if (dependent.equals("any framework")) {
                    continue;
                }

                int prereqIdx = findIndex(result, prereq);
                int depIdx = findIndex(result, dependent);

                // Both exist and are in wrong order
                if (prereqIdx != -1 && depIdx != -1
                        && prereqIdx > depIdx) {
                    // Move prereq before dependent
                    String prereqSkill = result.remove(prereqIdx);
                    result.add(depIdx, prereqSkill);
                    changed = true;
                }
            }
        }

        // Final pass — ensure DevOps is always last
        List<String> devopsSkills = new ArrayList<>();
        List<String> nonDevops = new ArrayList<>();

        for (String skill : result) {
            String lower = skill.toLowerCase();
            if (lower.matches(".*(docker|kubernetes|\\bgit\\b|linux|ci.cd|terraform|\\baws\\b|azure|gcp|nginx|ansible|prometheus|grafana|github actions).*")) {
                devopsSkills.add(skill);
            } else {
                nonDevops.add(skill);
            }
        }

        nonDevops.addAll(devopsSkills);
        return nonDevops;
    }

    private int findIndex(List<String> list, String target) {
        for (int i = 0; i < list.size(); i++) {
            if (list.get(i).equalsIgnoreCase(target)) {
                return i;
            }
            // Partial match for compound names
            if (list.get(i).toLowerCase().contains(target.toLowerCase())
                    || target.toLowerCase().contains(
                            list.get(i).toLowerCase())) {
                return i;
            }
        }
        return -1;
    }

    private List<String> manualOrder(List<String> skillNames) {
        List<String> tier1 = new ArrayList<>();
        List<String> tier2 = new ArrayList<>();
        List<String> tier3 = new ArrayList<>();
        List<String> tier4 = new ArrayList<>();
        List<String> tier5 = new ArrayList<>();
        List<String> tier6 = new ArrayList<>();
        List<String> tier7 = new ArrayList<>();
        List<String> tier8 = new ArrayList<>();
        List<String> tier9 = new ArrayList<>();
        List<String> tier10 = new ArrayList<>();
        List<String> tier11 = new ArrayList<>();
        List<String> tier12 = new ArrayList<>();
        List<String> tier13 = new ArrayList<>();

        for (String skill : skillNames) {
            String lower = skill.toLowerCase();

            if (lower.matches(".*(html|\\bcss\\b|tailwind|bootstrap|sass).*")) {
                tier1.add(skill);
            } else if (lower.matches(".*(\\bjava\\b|\\bpython\\b|\\bjavascript\\b|typescript|kotlin|swift|dart|\\bgo\\b|rust|c\\+\\+|c#|php|ruby|scala|\\br\\b).*")) {
                tier2.add(skill);
            } else if (lower.matches(".*(oop|object.oriented|data structure|algorithm|statistics|math|linear algebra|design pattern|solid principle).*")) {
                tier3.add(skill);
            } else if (lower.matches(".*(\\bsql\\b|mysql|postgresql|mongodb|database).*")) {
                tier4.add(skill);
            } else if (lower.matches(".*(maven|gradle|\\bnpm\\b|yarn|\\bpip\\b|poetry|webpack|vite|babel).*")) {
                tier5.add(skill);
            } else if (lower.matches(".*(rest api|graphql|api design|\\bhttp\\b|websocket).*")) {
                tier6.add(skill);
            } else if (lower.matches(".*(sqlalchemy|hibernate|mongoose|sequelize|prisma|typeorm|spring data).*")) {
                tier7.add(skill);
            } else if (lower.matches(".*(spring framework|\\bdjango\\b|\\bflask\\b|\\bexpress\\.js\\b|\\bfastapi\\b|\\bvue\\.js\\b|\\bangular\\b|react\\.js|next\\.js|nuxt|\\bflutter\\b|react native|\\bnode\\.js\\b|nestjs).*")) {
                tier8.add(skill);
            } else if (lower.matches(".*(spring boot|spring security|spring data jpa|django rest|\\bjwt\\b|redux|rxjs|passport|pydantic|hugging face|langchain|opencv|mlflow|tensorflow|pytorch|scikit|pandas|numpy|jupyter).*")) {
                tier9.add(skill);
            } else if (lower.matches(".*(test|junit|pytest|jest|cypress|mocha|chai|testing).*")) {
                tier10.add(skill);
            } else if (lower.matches(".*(redis|celery|kafka|rabbitmq|elasticsearch|snowflake|airflow|\\bspark\\b).*")) {
                tier11.add(skill);
            } else if (lower.matches(".*(microservice|system design|architecture|event.driven|distributed|machine learning|deep learning|nlp|computer vision|prompt engineering|web3|smart contract|solidity|blockchain).*")) {
                tier12.add(skill);
            } else if (lower.matches(".*(docker|kubernetes|\\bgit\\b|linux|ci.cd|terraform|\\baws\\b|azure|gcp|google cloud|nginx|ansible|prometheus|grafana|github actions|\\bdbt\\b).*")) {
                tier13.add(skill);
            } else {
                tier9.add(skill);
            }
        }

        List<String> result = new ArrayList<>();
        result.addAll(tier1);
        result.addAll(tier2);
        result.addAll(tier3);
        result.addAll(tier4);
        result.addAll(tier5);
        result.addAll(tier6);
        result.addAll(tier7);
        result.addAll(tier8);
        result.addAll(tier9);
        result.addAll(tier10);
        result.addAll(tier11);
        result.addAll(tier12);
        result.addAll(tier13);
        return result;
    }

    private String callGemini(String prompt, int maxTokens) {
        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);

        Map<String, Object> parts = new HashMap<>();
        parts.put("parts", List.of(textPart));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(parts));

        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("temperature", 1.0);
        generationConfig.put("topP", 0.95);
        generationConfig.put("topK", 64);
        generationConfig.put("maxOutputTokens", maxTokens);
        requestBody.put("generationConfig", generationConfig);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request
                = new HttpEntity<>(requestBody, headers);

        String urlWithKey = apiUrl + "?key=" + apiKey;

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    urlWithKey, request, Map.class);

            Map<String, Object> responseBody = response.getBody();
            List<Map<String, Object>> candidates
                    = (List<Map<String, Object>>) responseBody.get("candidates");
            Map<String, Object> firstCandidate = candidates.get(0);
            Map<String, Object> content
                    = (Map<String, Object>) firstCandidate.get("content");
            List<Map<String, Object>> responseParts
                    = (List<Map<String, Object>>) content.get("parts");

            String rawText = (String) responseParts.get(0).get("text");
            return cleanJsonResponse(rawText);

        } catch (Exception e) {
            throw new RuntimeException("Gemini API call failed: "
                    + e.getMessage());
        }
    }

    private String cleanJsonResponse(String raw) {
        if (raw == null) {
            return "{}";
        }
        raw = raw.trim();
        if (raw.startsWith("```json")) {
            raw = raw.substring(7); 
        }else if (raw.startsWith("```")) {
            raw = raw.substring(3);
        }
        if (raw.endsWith("```")) {
            raw = raw.substring(0, raw.length() - 3);
        }
        return raw.trim();
    }
}
