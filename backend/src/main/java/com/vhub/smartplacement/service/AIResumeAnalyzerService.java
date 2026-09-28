package com.vhub.smartplacement.service;

import com.vhub.smartplacement.dto.AIResumeAnalysisResponse;

public interface AIResumeAnalyzerService {

    AIResumeAnalysisResponse analyzeResume(String resumeText, String jobTitle);
}
