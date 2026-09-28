package com.vhub.smartplacement.ai;

import com.vhub.smartplacement.dto.AIResumeAnalysisResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MockAIProviderTest {

    private MockAIProvider mockAIProvider;

    @BeforeEach
    void setUp() {
        mockAIProvider = new MockAIProvider();
    }

    @Test
    void shouldAnalyzeJavaFullStackDeveloperRole() {
        String resumeText =
                "Java Spring Boot MySQL React JavaScript REST API Git";

        AIResumeAnalysisResponse response =
                mockAIProvider.analyzeResume(
                        resumeText,
                        "Java Full Stack Developer"
                );

        assertNotNull(response);

        assertTrue(response.getScore() >= 0);
        assertTrue(response.getScore() <= 100);

        assertTrue(
                response.getTechnicalSkills()
                        .contains("Java")
        );

        assertTrue(
                response.getTechnicalSkills()
                        .contains("Spring Boot")
        );

        assertTrue(
                response.getTechnicalSkills()
                        .contains("MySQL")
        );

        assertTrue(
                response.getTechnicalSkills()
                        .contains("React")
        );

        assertTrue(
                response.getSummary()
                        .contains("Java Full Stack Developer")
        );
    }

    @Test
    void shouldAnalyzePythonBackendDeveloperRole() {
        String resumeText =
                "Python Django FastAPI PostgreSQL REST API Git";

        AIResumeAnalysisResponse response =
                mockAIProvider.analyzeResume(
                        resumeText,
                        "Python Backend Developer"
                );

        assertNotNull(response);

        assertTrue(response.getScore() >= 0);
        assertTrue(response.getScore() <= 100);

        assertTrue(
                response.getTechnicalSkills()
                        .contains("Python")
        );

        assertTrue(
                response.getTechnicalSkills()
                        .contains("Django")
        );

        assertTrue(
                response.getTechnicalSkills()
                        .contains("FastAPI")
        );

        assertTrue(
                response.getTechnicalSkills()
                        .contains("PostgreSQL")
        );

        assertTrue(
                response.getSummary()
                        .contains("Python Backend Developer")
        );
    }

    @Test
    void shouldAnalyzeReactDeveloperRole() {
        String resumeText =
                "React JavaScript TypeScript HTML CSS REST API Git";

        AIResumeAnalysisResponse response =
                mockAIProvider.analyzeResume(
                        resumeText,
                        "React Developer"
                );

        assertNotNull(response);

        assertTrue(response.getScore() >= 0);
        assertTrue(response.getScore() <= 100);

        assertTrue(
                response.getTechnicalSkills()
                        .contains("React")
        );

        assertTrue(
                response.getTechnicalSkills()
                        .contains("JavaScript")
        );

        assertTrue(
                response.getTechnicalSkills()
                        .contains("TypeScript")
        );

        assertTrue(
                response.getTechnicalSkills()
                        .contains("HTML")
        );

        assertTrue(
                response.getTechnicalSkills()
                        .contains("CSS")
        );

        assertTrue(
                response.getSummary()
                        .contains("React Developer")
        );
    }

    @Test
    void shouldDetectMissingSkills() {
        String resumeText =
                "Java Spring Boot";

        AIResumeAnalysisResponse response =
                mockAIProvider.analyzeResume(
                        resumeText,
                        "Java Full Stack Developer"
                );

        assertNotNull(response);

        assertFalse(
                response.getMissingSkills().isBlank()
        );

        assertTrue(
                response.getMissingSkills()
                        .contains("MySQL")
        );

        assertTrue(
                response.getMissingSkills()
                        .contains("React")
        );
    }

    @Test
    void shouldGenerateRecommendations() {
        String resumeText =
                "Java Spring Boot";

        AIResumeAnalysisResponse response =
                mockAIProvider.analyzeResume(
                        resumeText,
                        "Java Full Stack Developer"
                );

        assertNotNull(response);

        assertFalse(
                response.getRecommendations().isBlank()
        );

        assertTrue(
                response.getRecommendations()
                        .contains("MySQL")
                        || response.getRecommendations()
                        .contains("React")
        );
    }

    @Test
    void shouldReturnValidScoreForEmptyResume() {
        AIResumeAnalysisResponse response =
                mockAIProvider.analyzeResume(
                        "",
                        "Java Full Stack Developer"
                );

        assertNotNull(response);

        assertTrue(response.getScore() >= 0);
        assertTrue(response.getScore() <= 100);

        assertFalse(
                response.getSummary().isBlank()
        );

        assertFalse(
                response.getMissingSkills().isBlank()
        );
    }

    @Test
    void shouldProduceDifferentResultsForDifferentRoles() {
        String resumeText =
                "Java Spring Boot MySQL React Python Django";

        AIResumeAnalysisResponse javaResponse =
                mockAIProvider.analyzeResume(
                        resumeText,
                        "Java Full Stack Developer"
                );

        AIResumeAnalysisResponse pythonResponse =
                mockAIProvider.analyzeResume(
                        resumeText,
                        "Python Backend Developer"
                );

        assertNotNull(javaResponse);
        assertNotNull(pythonResponse);

        assertNotEquals(
                javaResponse.getTechnicalSkills(),
                pythonResponse.getTechnicalSkills()
        );

        assertTrue(
                javaResponse.getSummary()
                        .contains("Java Full Stack Developer")
        );

        assertTrue(
                pythonResponse.getSummary()
                        .contains("Python Backend Developer")
        );
    }

    @Test
    void shouldRecognizeProjectExperience() {
        String resumeText =
                "Java Spring Boot MySQL project development Git";

        AIResumeAnalysisResponse response =
                mockAIProvider.analyzeResume(
                        resumeText,
                        "Backend Developer"
                );

        assertNotNull(response);

        assertTrue(
                response.getStrengths()
                        .contains("Project experience is mentioned")
        );
    }
}
