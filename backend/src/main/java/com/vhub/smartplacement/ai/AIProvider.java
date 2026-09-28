package com.vhub.smartplacement.ai;

import com.vhub.smartplacement.dto.AIResumeAnalysisResponse;

public interface AIProvider {

    AIResumeAnalysisResponse analyzeResume(
            String resumeText,
            String jobTitle
    );
}
