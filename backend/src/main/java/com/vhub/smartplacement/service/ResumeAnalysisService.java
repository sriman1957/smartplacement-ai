package com.vhub.smartplacement.service;

import com.vhub.smartplacement.dto.AIResumeAnalysisResponse;
import com.vhub.smartplacement.entity.Resume;
import com.vhub.smartplacement.entity.ResumeAnalysis;
import com.vhub.smartplacement.entity.User;
import com.vhub.smartplacement.exception.ResumeNotFoundException;
import com.vhub.smartplacement.exception.ResumeValidationException;
import com.vhub.smartplacement.repository.ResumeAnalysisRepository;
import com.vhub.smartplacement.repository.ResumeRepository;
import com.vhub.smartplacement.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ResumeAnalysisService {

    private final ResumeRepository resumeRepository;
    private final ResumeAnalysisRepository resumeAnalysisRepository;
    private final UserRepository userRepository;
    private final ResumeTextExtractionService resumeTextExtractionService;
    private final AIResumeAnalyzerService aiResumeAnalyzerService;

    public ResumeAnalysisService(
            ResumeRepository resumeRepository,
            ResumeAnalysisRepository resumeAnalysisRepository,
            UserRepository userRepository,
            ResumeTextExtractionService resumeTextExtractionService,
            AIResumeAnalyzerService aiResumeAnalyzerService
    ) {
        this.resumeRepository = resumeRepository;
        this.resumeAnalysisRepository = resumeAnalysisRepository;
        this.userRepository = userRepository;
        this.resumeTextExtractionService = resumeTextExtractionService;
        this.aiResumeAnalyzerService = aiResumeAnalyzerService;
    }

    @Transactional
    public ResumeAnalysis analyzeResume(
            String email,
            Long resumeId,
            String jobTitle
    ) {
        validateJobTitle(jobTitle);

        User user = findUserByEmail(email);

        Resume resume = resumeRepository
                .findByIdAndUser(resumeId, user)
                .orElseThrow(() ->
                        new ResumeNotFoundException(
                                "Resume not found"
                        )
                );

        String resumeText =
                resumeTextExtractionService.extractText(resume);

        AIResumeAnalysisResponse analysisResponse =
                aiResumeAnalyzerService.analyzeResume(
                        resumeText,
                        jobTitle
                );

        validateAnalysisResponse(analysisResponse);

        ResumeAnalysis resumeAnalysis =
                resumeAnalysisRepository
                        .findByResumeAndJobTitle(
                                resume,
                                jobTitle
                        )
                        .orElseGet(() ->
                                new ResumeAnalysis(
                                        resume,
                                        jobTitle,
                                        analysisResponse.getScore(),
                                        analysisResponse.getTechnicalSkills(),
                                        analysisResponse.getStrengths(),
                                        analysisResponse.getWeaknesses(),
                                        analysisResponse.getMissingSkills(),
                                        analysisResponse.getRecommendations(),
                                        analysisResponse.getSummary()
                                )
                        );

        if (resumeAnalysis.getId() != null) {
            resumeAnalysis.updateAnalysis(
                    analysisResponse.getScore(),
                    analysisResponse.getTechnicalSkills(),
                    analysisResponse.getStrengths(),
                    analysisResponse.getWeaknesses(),
                    analysisResponse.getMissingSkills(),
                    analysisResponse.getRecommendations(),
                    analysisResponse.getSummary()
            );
        }

        return resumeAnalysisRepository.save(resumeAnalysis);
    }

    private void validateJobTitle(String jobTitle) {

        if (jobTitle == null || jobTitle.isBlank()) {
            throw new ResumeValidationException(
                    "Job title is required for analysis."
            );
        }

        if (jobTitle.trim().length() > 100) {
            throw new ResumeValidationException(
                    "Job title must not exceed 100 characters."
            );
        }
    }

    private void validateAnalysisResponse(
            AIResumeAnalysisResponse response
    ) {
        if (response == null) {
            throw new IllegalStateException(
                    "AI analysis returned no result."
            );
        }

        Integer score = response.getScore();

        if (score == null || score < 0 || score > 100) {
            throw new IllegalStateException(
                    "AI analysis returned an invalid score."
            );
        }

        if (isBlank(response.getTechnicalSkills()) ||
                isBlank(response.getStrengths()) ||
                isBlank(response.getWeaknesses()) ||
                isBlank(response.getMissingSkills()) ||
                isBlank(response.getRecommendations()) ||
                isBlank(response.getSummary())) {

            throw new IllegalStateException(
                    "AI analysis returned incomplete information."
            );
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private User findUserByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Authenticated user not found"
                        )
                );
    }
}
