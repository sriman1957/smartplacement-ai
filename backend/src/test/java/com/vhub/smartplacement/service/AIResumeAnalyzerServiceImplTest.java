package com.vhub.smartplacement.service;

import com.vhub.smartplacement.ai.AIProvider;
import com.vhub.smartplacement.dto.AIResumeAnalysisResponse;
import com.vhub.smartplacement.exception.AIAnalysisException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AIResumeAnalyzerServiceImplTest {

    @Mock
    private AIProvider aiProvider;

    private AIResumeAnalyzerServiceImpl aiResumeAnalyzerService;

    @BeforeEach
    void setUp() {
        aiResumeAnalyzerService =
                new AIResumeAnalyzerServiceImpl(aiProvider);
    }

    @Test
    void shouldAnalyzeResumeSuccessfully() {
        String resumeText =
                "Java Spring Boot MySQL React Git";

        String jobTitle =
                "Java Full Stack Developer";

        AIResumeAnalysisResponse expectedResponse =
                new AIResumeAnalysisResponse(
                        85,
                        "Java, Spring Boot, MySQL, React, Git",
                        "Strong technical foundation",
                        "Limited cloud experience",
                        "AWS",
                        "Add cloud deployment experience",
                        "Good alignment with the selected role"
                );

        when(aiProvider.analyzeResume(
                resumeText,
                jobTitle
        )).thenReturn(expectedResponse);

        AIResumeAnalysisResponse actualResponse =
                aiResumeAnalyzerService.analyzeResume(
                        resumeText,
                        jobTitle
                );

        assertNotNull(actualResponse);
        assertEquals(85, actualResponse.getScore());
        assertEquals(
                "Java, Spring Boot, MySQL, React, Git",
                actualResponse.getTechnicalSkills()
        );
        assertEquals(
                "Good alignment with the selected role",
                actualResponse.getSummary()
        );

        verify(aiProvider).analyzeResume(
                resumeText,
                jobTitle
        );
    }

    @Test
    void shouldRejectBlankResumeText() {
        AIAnalysisException exception =
                assertThrows(
                        AIAnalysisException.class,
                        () -> aiResumeAnalyzerService.analyzeResume(
                                "   ",
                                "Java Full Stack Developer"
                        )
                );

        assertEquals(
                "Resume text is required for AI analysis",
                exception.getMessage()
        );

        verifyNoInteractions(aiProvider);
    }

    @Test
    void shouldRejectNullResumeText() {
        AIAnalysisException exception =
                assertThrows(
                        AIAnalysisException.class,
                        () -> aiResumeAnalyzerService.analyzeResume(
                                null,
                                "Java Full Stack Developer"
                        )
                );

        assertEquals(
                "Resume text is required for AI analysis",
                exception.getMessage()
        );

        verifyNoInteractions(aiProvider);
    }

    @Test
    void shouldRejectBlankJobTitle() {
        AIAnalysisException exception =
                assertThrows(
                        AIAnalysisException.class,
                        () -> aiResumeAnalyzerService.analyzeResume(
                                "Java Spring Boot MySQL",
                                "   "
                        )
                );

        assertEquals(
                "Job title is required for AI analysis",
                exception.getMessage()
        );

        verifyNoInteractions(aiProvider);
    }

    @Test
    void shouldRejectNullJobTitle() {
        AIAnalysisException exception =
                assertThrows(
                        AIAnalysisException.class,
                        () -> aiResumeAnalyzerService.analyzeResume(
                                "Java Spring Boot MySQL",
                                null
                        )
                );

        assertEquals(
                "Job title is required for AI analysis",
                exception.getMessage()
        );

        verifyNoInteractions(aiProvider);
    }

    @Test
    void shouldForwardSelectedJobTitleToAIProvider() {
        String resumeText =
                "Python Django FastAPI PostgreSQL Git";

        String jobTitle =
                "Python Backend Developer";

        AIResumeAnalysisResponse response =
                new AIResumeAnalysisResponse(
                        90,
                        "Python, Django, FastAPI, PostgreSQL, Git",
                        "Strong backend experience",
                        "Limited testing experience",
                        "Automated testing",
                        "Add automated tests",
                        "Strong backend role alignment"
                );

        when(aiProvider.analyzeResume(
                resumeText,
                jobTitle
        )).thenReturn(response);

        aiResumeAnalyzerService.analyzeResume(
                resumeText,
                jobTitle
        );

        verify(aiProvider, times(1)).analyzeResume(
                resumeText,
                jobTitle
        );
    }

    @Test
    void shouldRejectNullAIProviderResponse() {
        String resumeText =
                "Java Spring Boot MySQL";

        String jobTitle =
                "Backend Developer";

        when(aiProvider.analyzeResume(
                resumeText,
                jobTitle
        )).thenReturn(null);

        AIAnalysisException exception =
                assertThrows(
                        AIAnalysisException.class,
                        () -> aiResumeAnalyzerService.analyzeResume(
                                resumeText,
                                jobTitle
                        )
                );

        assertEquals(
                "AI provider returned no analysis",
                exception.getMessage()
        );
    }

    @Test
    void shouldWrapUnexpectedProviderException() {
        String resumeText =
                "Java Spring Boot MySQL";

        String jobTitle =
                "Backend Developer";

        RuntimeException providerException =
                new RuntimeException("Provider unavailable");

        when(aiProvider.analyzeResume(
                resumeText,
                jobTitle
        )).thenThrow(providerException);

        AIAnalysisException exception =
                assertThrows(
                        AIAnalysisException.class,
                        () -> aiResumeAnalyzerService.analyzeResume(
                                resumeText,
                                jobTitle
                        )
                );

        assertEquals(
                "AI resume analysis failed",
                exception.getMessage()
        );

        assertSame(
                providerException,
                exception.getCause()
        );
    }

    @Test
    void shouldRethrowAIAnalysisExceptionWithoutWrapping() {
        String resumeText =
                "Java Spring Boot MySQL";

        String jobTitle =
                "Backend Developer";

        AIAnalysisException providerException =
                new AIAnalysisException(
                        "AI provider analysis failed"
                );

        when(aiProvider.analyzeResume(
                resumeText,
                jobTitle
        )).thenThrow(providerException);

        AIAnalysisException exception =
                assertThrows(
                        AIAnalysisException.class,
                        () -> aiResumeAnalyzerService.analyzeResume(
                                resumeText,
                                jobTitle
                        )
                );

        assertSame(
                providerException,
                exception
        );
    }
}
