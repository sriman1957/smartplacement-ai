package com.vhub.smartplacement.dto;

import com.vhub.smartplacement.entity.ResumeAnalysis;

import java.time.LocalDateTime;

public class ResumeAnalysisResponse {

    private Long id;
    private Long resumeId;
    private String jobTitle;
    private Integer score;
    private String technicalSkills;
    private String strengths;
    private String weaknesses;
    private String missingSkills;
    private String recommendations;
    private String summary;
    private LocalDateTime createdAt;

    public ResumeAnalysisResponse() {
    }

    public ResumeAnalysisResponse(
            Long id,
            Long resumeId,
            String jobTitle,
            Integer score,
            String technicalSkills,
            String strengths,
            String weaknesses,
            String missingSkills,
            String recommendations,
            String summary,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.resumeId = resumeId;
        this.jobTitle = jobTitle;
        this.score = score;
        this.technicalSkills = technicalSkills;
        this.strengths = strengths;
        this.weaknesses = weaknesses;
        this.missingSkills = missingSkills;
        this.recommendations = recommendations;
        this.summary = summary;
        this.createdAt = createdAt;
    }

    public static ResumeAnalysisResponse fromEntity(
            ResumeAnalysis analysis
    ) {
        return new ResumeAnalysisResponse(
                analysis.getId(),
                analysis.getResume().getId(),
                analysis.getJobTitle(),
                analysis.getScore(),
                analysis.getTechnicalSkills(),
                analysis.getStrengths(),
                analysis.getWeaknesses(),
                analysis.getMissingSkills(),
                analysis.getRecommendations(),
                analysis.getSummary(),
                analysis.getCreatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public Long getResumeId() {
        return resumeId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public Integer getScore() {
        return score;
    }

    public String getTechnicalSkills() {
        return technicalSkills;
    }

    public String getStrengths() {
        return strengths;
    }

    public String getWeaknesses() {
        return weaknesses;
    }

    public String getMissingSkills() {
        return missingSkills;
    }

    public String getRecommendations() {
        return recommendations;
    }

    public String getSummary() {
        return summary;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
