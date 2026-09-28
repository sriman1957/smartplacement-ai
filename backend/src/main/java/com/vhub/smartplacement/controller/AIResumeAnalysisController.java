package com.vhub.smartplacement.controller;

import com.vhub.smartplacement.dto.ResumeAnalysisResponse;
import com.vhub.smartplacement.entity.ResumeAnalysis;
import com.vhub.smartplacement.service.ResumeAnalysisService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AIResumeAnalysisController {

    private final ResumeAnalysisService resumeAnalysisService;

    public AIResumeAnalysisController(
            ResumeAnalysisService resumeAnalysisService
    ) {
        this.resumeAnalysisService = resumeAnalysisService;
    }

    @PostMapping("/resume-analyze/{resumeId}")
    public ResponseEntity<ResumeAnalysisResponse> analyzeResume(
            @PathVariable Long resumeId,
            @RequestParam String jobTitle,
            Authentication authentication
    ) {
        String email = authentication.getName();

        ResumeAnalysis analysis =
                resumeAnalysisService.analyzeResume(
                        email,
                        resumeId,
                        jobTitle
                );

        ResumeAnalysisResponse response =
                ResumeAnalysisResponse.fromEntity(analysis);

        return ResponseEntity.ok(response);
    }
}
