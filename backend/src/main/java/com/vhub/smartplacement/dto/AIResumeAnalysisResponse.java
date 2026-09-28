package com.vhub.smartplacement.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AIResumeAnalysisResponse {

    @NotNull
    @Min(0)
    @Max(100)
    private Integer score;

    @NotBlank
    private String technicalSkills;

    @NotBlank
    private String strengths;

    @NotBlank
    private String weaknesses;

    @NotBlank
    private String missingSkills;

    @NotBlank
    private String recommendations;

    @NotBlank
    private String summary;

    public AIResumeAnalysisResponse() {
    }

    public AIResumeAnalysisResponse(
            Integer score,
            String technicalSkills,
            String strengths,
            String weaknesses,
            String missingSkills,
            String recommendations,
            String summary
    ) {
        this.score = score;
        this.technicalSkills = technicalSkills;
        this.strengths = strengths;
        this.weaknesses = weaknesses;
        this.missingSkills = missingSkills;
        this.recommendations = recommendations;
        this.summary = summary;
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
}
