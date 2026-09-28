package com.vhub.smartplacement.repository;

import com.vhub.smartplacement.entity.Resume;
import com.vhub.smartplacement.entity.ResumeAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ResumeAnalysisRepository
        extends JpaRepository<ResumeAnalysis, Long> {

    Optional<ResumeAnalysis> findByResumeAndJobTitle(
            Resume resume,
            String jobTitle
    );

    Optional<ResumeAnalysis> findByResumeIdAndJobTitle(
            Long resumeId,
            String jobTitle
    );

    void deleteByResume(Resume resume);
}
