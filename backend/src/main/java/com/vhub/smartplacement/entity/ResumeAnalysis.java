package com.vhub.smartplacement.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "resume_analyses",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_resume_analysis_resume_job",
                        columnNames = {
                                "resume_id",
                                "job_title"
                        }
                )
        }
)
public class ResumeAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(
            name = "resume_id",
            nullable = false
    )
    private Resume resume;

    @Column(
            name = "job_title",
            nullable = false,
            length = 100
    )
    private String jobTitle;

    @Column(nullable = false)
    private Integer score;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String technicalSkills;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String strengths;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String weaknesses;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String missingSkills;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String recommendations;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String summary;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    protected ResumeAnalysis() {
    }

    public ResumeAnalysis(
            Resume resume,
            String jobTitle,
            Integer score,
            String technicalSkills,
            String strengths,
            String weaknesses,
            String missingSkills,
            String recommendations,
            String summary
    ) {
        this.resume = resume;
        this.jobTitle = jobTitle;
        this.score = score;
        this.technicalSkills = technicalSkills;
        this.strengths = strengths;
        this.weaknesses = weaknesses;
        this.missingSkills = missingSkills;
        this.recommendations = recommendations;
        this.summary = summary;
    }

    @PrePersist
    private void setCreatedAt() {
        createdAt = LocalDateTime.now();
    }

    public void updateAnalysis(
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

    public Long getId() {
        return id;
    }

    public Resume getResume() {
        return resume;
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
