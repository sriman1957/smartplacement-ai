package com.vhub.smartplacement.service;

import com.vhub.smartplacement.dto.AIResumeAnalysisResponse;
import com.vhub.smartplacement.entity.Resume;
import com.vhub.smartplacement.entity.ResumeAnalysis;
import com.vhub.smartplacement.entity.User;
import com.vhub.smartplacement.repository.ResumeAnalysisRepository;
import com.vhub.smartplacement.repository.ResumeRepository;
import com.vhub.smartplacement.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.test.util.ReflectionTestUtils;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class ResumeAnalysisServiceTest {

    @TempDir
    Path tempDirectory;

    private ResumeRepository resumeRepository;
    private ResumeAnalysisRepository resumeAnalysisRepository;
    private UserRepository userRepository;
    private ResumeTextExtractionService resumeTextExtractionService;
    private AIResumeAnalyzerService aiResumeAnalyzerService;
    private ResumeAnalysisService resumeAnalysisService;

    private static final String JAVA_FULL_STACK =
            "Java Full Stack Developer";

    private static final String PYTHON_BACKEND =
            "Python Backend Developer";

    @BeforeEach
    void setUp() {
        resumeRepository =
                org.mockito.Mockito.mock(ResumeRepository.class);

        resumeAnalysisRepository =
                org.mockito.Mockito.mock(ResumeAnalysisRepository.class);

        userRepository =
                org.mockito.Mockito.mock(UserRepository.class);

        resumeTextExtractionService =
                org.mockito.Mockito.mock(ResumeTextExtractionService.class);

        aiResumeAnalyzerService =
                org.mockito.Mockito.mock(AIResumeAnalyzerService.class);

        resumeAnalysisService = new ResumeAnalysisService(
                resumeRepository,
                resumeAnalysisRepository,
                userRepository,
                resumeTextExtractionService,
                aiResumeAnalyzerService
        );
    }

    @Test
    void shouldAnalyzeAndSaveResumeSuccessfully() {
        User user = createUser();

        Resume resume = createResume(user);

        AIResumeAnalysisResponse response =
                createValidAnalysisResponse();

        org.mockito.Mockito.when(
                userRepository.findByEmail("student@example.com")
        ).thenReturn(Optional.of(user));

        org.mockito.Mockito.when(
                resumeRepository.findByIdAndUser(1L, user)
        ).thenReturn(Optional.of(resume));

        org.mockito.Mockito.when(
                resumeTextExtractionService.extractText(resume)
        ).thenReturn(
                "Java Spring Boot MySQL React REST API Git"
        );

        org.mockito.Mockito.when(
                aiResumeAnalyzerService.analyzeResume(
                        "Java Spring Boot MySQL React REST API Git",
                        JAVA_FULL_STACK
                )
        ).thenReturn(response);

        org.mockito.Mockito.when(
                resumeAnalysisRepository.findByResumeAndJobTitle(
                        resume,
                        JAVA_FULL_STACK
                )
        ).thenReturn(Optional.empty());

        org.mockito.Mockito.when(
                resumeAnalysisRepository.save(
                        org.mockito.ArgumentMatchers.any(ResumeAnalysis.class)
                )
        ).thenAnswer(invocation -> invocation.getArgument(0));

        ResumeAnalysis result =
                resumeAnalysisService.analyzeResume(
                        "student@example.com",
                        1L,
                        JAVA_FULL_STACK
                );

        assertNotNull(result);
        assertSame(resume, result.getResume());

        assertEquals(
                JAVA_FULL_STACK,
                result.getJobTitle()
        );

        assertEquals(85, result.getScore());

        assertEquals(
                response.getTechnicalSkills(),
                result.getTechnicalSkills()
        );

        assertEquals(
                response.getStrengths(),
                result.getStrengths()
        );

        assertEquals(
                response.getWeaknesses(),
                result.getWeaknesses()
        );

        assertEquals(
                response.getMissingSkills(),
                result.getMissingSkills()
        );

        assertEquals(
                response.getRecommendations(),
                result.getRecommendations()
        );

        assertEquals(
                response.getSummary(),
                result.getSummary()
        );

        org.mockito.Mockito.verify(
                resumeTextExtractionService
        ).extractText(resume);

        org.mockito.Mockito.verify(
                aiResumeAnalyzerService
        ).analyzeResume(
                "Java Spring Boot MySQL React REST API Git",
                JAVA_FULL_STACK
        );

        org.mockito.Mockito.verify(
                resumeAnalysisRepository
        ).save(
                org.mockito.ArgumentMatchers.any(ResumeAnalysis.class)
        );
    }

    @Test
    void shouldUpdateExistingAnalysisDuringReanalysis() {
        User user = createUser();

        Resume resume = createResume(user);

        ResumeAnalysis existingAnalysis =
                new ResumeAnalysis(
                        resume,
                        JAVA_FULL_STACK,
                        60,
                        "Java",
                        "Good Java knowledge",
                        "Limited Spring knowledge",
                        "Spring Boot, React",
                        "Learn Spring Boot and React",
                        "Beginner Java Full Stack profile"
                );

        ReflectionTestUtils.setField(
                existingAnalysis,
                "id",
                10L
        );

        AIResumeAnalysisResponse response =
                new AIResumeAnalysisResponse(
                        90,
                        "Java, Spring Boot, MySQL, React",
                        "Strong Java and Spring Boot skills",
                        "Limited cloud experience",
                        "Docker, AWS",
                        "Improve Docker and AWS knowledge",
                        "Strong Java Full Stack profile"
                );

        org.mockito.Mockito.when(
                userRepository.findByEmail("student@example.com")
        ).thenReturn(Optional.of(user));

        org.mockito.Mockito.when(
                resumeRepository.findByIdAndUser(1L, user)
        ).thenReturn(Optional.of(resume));

        org.mockito.Mockito.when(
                resumeTextExtractionService.extractText(resume)
        ).thenReturn(
                "Updated Java Spring Boot MySQL React resume"
        );

        org.mockito.Mockito.when(
                aiResumeAnalyzerService.analyzeResume(
                        "Updated Java Spring Boot MySQL React resume",
                        JAVA_FULL_STACK
                )
        ).thenReturn(response);

        org.mockito.Mockito.when(
                resumeAnalysisRepository.findByResumeAndJobTitle(
                        resume,
                        JAVA_FULL_STACK
                )
        ).thenReturn(Optional.of(existingAnalysis));

        org.mockito.Mockito.when(
                resumeAnalysisRepository.save(existingAnalysis)
        ).thenReturn(existingAnalysis);

        ResumeAnalysis result =
                resumeAnalysisService.analyzeResume(
                        "student@example.com",
                        1L,
                        JAVA_FULL_STACK
                );

        assertSame(existingAnalysis, result);

        assertEquals(
                JAVA_FULL_STACK,
                result.getJobTitle()
        );

        assertEquals(90, result.getScore());

        assertEquals(
                "Java, Spring Boot, MySQL, React",
                result.getTechnicalSkills()
        );

        assertEquals(
                "Strong Java and Spring Boot skills",
                result.getStrengths()
        );

        assertEquals(
                "Limited cloud experience",
                result.getWeaknesses()
        );

        assertEquals(
                "Docker, AWS",
                result.getMissingSkills()
        );

        assertEquals(
                "Improve Docker and AWS knowledge",
                result.getRecommendations()
        );

        assertEquals(
                "Strong Java Full Stack profile",
                result.getSummary()
        );

        org.mockito.Mockito.verify(
                resumeAnalysisRepository
        ).save(existingAnalysis);
    }

    @Test
    void shouldCreateSeparateAnalysisForDifferentJobTitle() {
        User user = createUser();

        Resume resume = createResume(user);

        AIResumeAnalysisResponse response =
                new AIResumeAnalysisResponse(
                        70,
                        "Python, FastAPI, PostgreSQL",
                        "Good backend fundamentals",
                        "Limited cloud experience",
                        "Docker, AWS",
                        "Improve Docker and AWS knowledge",
                        "Good Python backend foundation"
                );

        org.mockito.Mockito.when(
                userRepository.findByEmail("student@example.com")
        ).thenReturn(Optional.of(user));

        org.mockito.Mockito.when(
                resumeRepository.findByIdAndUser(1L, user)
        ).thenReturn(Optional.of(resume));

        org.mockito.Mockito.when(
                resumeTextExtractionService.extractText(resume)
        ).thenReturn(
                "Python FastAPI PostgreSQL Git"
        );

        org.mockito.Mockito.when(
                aiResumeAnalyzerService.analyzeResume(
                        "Python FastAPI PostgreSQL Git",
                        PYTHON_BACKEND
                )
        ).thenReturn(response);

        org.mockito.Mockito.when(
                resumeAnalysisRepository.findByResumeAndJobTitle(
                        resume,
                        PYTHON_BACKEND
                )
        ).thenReturn(Optional.empty());

        org.mockito.Mockito.when(
                resumeAnalysisRepository.save(
                        org.mockito.ArgumentMatchers.any(ResumeAnalysis.class)
                )
        ).thenAnswer(invocation -> invocation.getArgument(0));

        ResumeAnalysis result =
                resumeAnalysisService.analyzeResume(
                        "student@example.com",
                        1L,
                        PYTHON_BACKEND
                );

        assertNotNull(result);
        assertSame(resume, result.getResume());

        assertEquals(
                PYTHON_BACKEND,
                result.getJobTitle()
        );

        assertEquals(
                70,
                result.getScore()
        );

        org.mockito.Mockito.verify(
                resumeAnalysisRepository
        ).findByResumeAndJobTitle(
                resume,
                PYTHON_BACKEND
        );

        org.mockito.Mockito.verify(
                resumeAnalysisRepository
        ).save(
                org.mockito.ArgumentMatchers.any(ResumeAnalysis.class)
        );
    }

    @Test
    void shouldRejectResumeOwnedByAnotherUser() {
        User user = createUser();

        org.mockito.Mockito.when(
                userRepository.findByEmail("student@example.com")
        ).thenReturn(Optional.of(user));

        org.mockito.Mockito.when(
                resumeRepository.findByIdAndUser(1L, user)
        ).thenReturn(Optional.empty());

        assertThrows(
                RuntimeException.class,
                () -> resumeAnalysisService.analyzeResume(
                        "student@example.com",
                        1L,
                        JAVA_FULL_STACK
                )
        );

        org.mockito.Mockito.verify(
                resumeTextExtractionService,
                org.mockito.Mockito.never()
        ).extractText(
                org.mockito.ArgumentMatchers.any()
        );

        org.mockito.Mockito.verify(
                aiResumeAnalyzerService,
                org.mockito.Mockito.never()
        ).analyzeResume(
                org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.anyString()
        );
    }

    @Test
    void shouldRejectInvalidAIResponse() {
        User user = createUser();

        Resume resume = createResume(user);

        AIResumeAnalysisResponse invalidResponse =
                new AIResumeAnalysisResponse(
                        150,
                        "Java",
                        "Strength",
                        "Weakness",
                        "Missing skill",
                        "Recommendation",
                        "Summary"
                );

        org.mockito.Mockito.when(
                userRepository.findByEmail("student@example.com")
        ).thenReturn(Optional.of(user));

        org.mockito.Mockito.when(
                resumeRepository.findByIdAndUser(1L, user)
        ).thenReturn(Optional.of(resume));

        org.mockito.Mockito.when(
                resumeTextExtractionService.extractText(resume)
        ).thenReturn("Java resume");

        org.mockito.Mockito.when(
                aiResumeAnalyzerService.analyzeResume(
                        "Java resume",
                        JAVA_FULL_STACK
                )
        ).thenReturn(invalidResponse);

        assertThrows(
                IllegalStateException.class,
                () -> resumeAnalysisService.analyzeResume(
                        "student@example.com",
                        1L,
                        JAVA_FULL_STACK
                )
        );

        org.mockito.Mockito.verify(
                resumeAnalysisRepository,
                org.mockito.Mockito.never()
        ).save(
                org.mockito.ArgumentMatchers.any(ResumeAnalysis.class)
        );
    }

    private User createUser() {
        User user = org.mockito.Mockito.mock(User.class);

        org.mockito.Mockito.when(
                user.getEmail()
        ).thenReturn("student@example.com");

        return user;
    }

    private Resume createResume(User user) {
        Path resumePath =
                tempDirectory.resolve("resume.pdf");

        try {
            Files.writeString(
                    resumePath,
                    "Java Spring Boot resume"
            );
        } catch (Exception exception) {
            throw new RuntimeException(exception);
        }

        Resume resume = new Resume(
                user,
                "resume.pdf",
                "stored-resume.pdf",
                "application/pdf",
                100L,
                resumePath.toString()
        );

        ReflectionTestUtils.setField(
                resume,
                "id",
                1L
        );

        return resume;
    }

    private AIResumeAnalysisResponse createValidAnalysisResponse() {
        return new AIResumeAnalysisResponse(
                85,
                "Java, Spring Boot, MySQL, React",
                "Good Java and Spring Boot knowledge",
                "Limited cloud experience",
                "Docker, AWS",
                "Improve Docker and AWS knowledge",
                "Good Java Full Stack foundation"
        );
    }
}