package com.vhub.smartplacement.service;

import com.vhub.smartplacement.ai.AIProvider;
import com.vhub.smartplacement.dto.AIResumeAnalysisResponse;
import com.vhub.smartplacement.exception.AIAnalysisException;
import org.springframework.stereotype.Service;

@Service
public class AIResumeAnalyzerServiceImpl
        implements AIResumeAnalyzerService {

    private final AIProvider aiProvider;

    public AIResumeAnalyzerServiceImpl(
            AIProvider aiProvider
    ) {
        this.aiProvider = aiProvider;
    }

    @Override
    public AIResumeAnalysisResponse analyzeResume(
            String resumeText,
            String jobTitle
    ) {
        if (resumeText == null || resumeText.isBlank()) {
            throw new AIAnalysisException(
                    "Resume text is required for AI analysis"
            );
        }

        if (jobTitle == null || jobTitle.isBlank()) {
            throw new AIAnalysisException(
                    "Job title is required for AI analysis"
            );
        }

        try {
            AIResumeAnalysisResponse response =
                    aiProvider.analyzeResume(
                            resumeText,
                            jobTitle
                    );

            if (response == null) {
                throw new AIAnalysisException(
                        "AI provider returned no analysis"
                );
            }

            return response;
        } catch (AIAnalysisException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new AIAnalysisException(
                    "AI resume analysis failed",
                    exception
            );
        }
    }
}
