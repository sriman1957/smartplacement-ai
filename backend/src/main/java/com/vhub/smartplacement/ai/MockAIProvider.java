package com.vhub.smartplacement.ai;

import com.vhub.smartplacement.dto.AIResumeAnalysisResponse;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Component
public class MockAIProvider implements AIProvider {

    @Override
    public AIResumeAnalysisResponse analyzeResume(
            String resumeText,
            String jobTitle
    ) {
        String normalizedResume =
                resumeText.toLowerCase(Locale.ROOT);

        String normalizedJobTitle =
                jobTitle.trim().toLowerCase(Locale.ROOT);

        List<String> technicalSkills = new ArrayList<>();
        List<String> strengths = new ArrayList<>();
        List<String> weaknesses = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();
        List<String> recommendations = new ArrayList<>();

        List<String> roleSkills =
                getRoleSkills(normalizedJobTitle);

        int matchedSkills = 0;

        for (String skill : roleSkills) {
            if (normalizedResume.contains(
                    skill.toLowerCase(Locale.ROOT)
            )) {
                technicalSkills.add(skill);
                matchedSkills++;
            }
        }

        int score = roleSkills.isEmpty()
                ? 50
                : 40 + (matchedSkills * 60 / roleSkills.size());

        score = Math.min(score, 100);

        for (String skill : roleSkills) {
            if (!normalizedResume.contains(
                    skill.toLowerCase(Locale.ROOT)
            )) {
                missingSkills.add(skill);
            }
        }

        if (technicalSkills.isEmpty()) {
            technicalSkills.add(
                    "No matching technical skills detected"
            );

            weaknesses.add(
                    "No strong technical skill matches were "
                            + "detected for this role"
            );
        } else {
            strengths.add(
                    "Resume contains skills relevant to "
                            + jobTitle
            );
        }

        if (matchedSkills >= 3) {
            strengths.add(
                    "Good technical alignment with the selected role"
            );
        }

        if (!missingSkills.isEmpty()) {
            weaknesses.add(
                    "Some skills expected for the selected role "
                            + "are not clearly present in the resume"
            );
        }

        for (String skill : missingSkills) {
            recommendations.add(
                    "Consider adding practical experience with "
                            + skill
            );
        }

        recommendations.add(
                "Use measurable project outcomes to strengthen "
                        + "your resume for " + jobTitle
        );

        if (normalizedResume.contains("project")) {
            strengths.add(
                    "Project experience is mentioned in the resume"
            );
        } else {
            recommendations.add(
                    "Add relevant project experience"
            );
        }

        if (strengths.isEmpty()) {
            strengths.add(
                    "The resume provides some information for analysis"
            );
        }

        if (weaknesses.isEmpty()) {
            weaknesses.add(
                    "Some areas may need stronger evidence "
                            + "for the selected role"
            );
        }

        if (missingSkills.isEmpty()) {
            missingSkills.add(
                    "No major role-specific skills were identified "
                            + "as missing"
            );
        }

        if (recommendations.isEmpty()) {
            recommendations.add(
                    "Continue strengthening projects and measurable "
                            + "achievements for " + jobTitle
            );
        }

        String summary =
                buildSummary(
                        jobTitle,
                        score,
                        matchedSkills,
                        roleSkills.size()
                );

        return new AIResumeAnalysisResponse(
                score,
                String.join(", ", technicalSkills),
                String.join(". ", strengths),
                String.join(". ", weaknesses),
                String.join(", ", missingSkills),
                String.join(". ", recommendations),
                summary
        );
    }

    private List<String> getRoleSkills(
            String normalizedJobTitle
    ) {
        if (normalizedJobTitle.contains("python")
                && normalizedJobTitle.contains("backend")) {
            return List.of(
                    "Python",
                    "Django",
                    "FastAPI",
                    "REST API",
                    "PostgreSQL",
                    "Git"
            );
        }

        if (normalizedJobTitle.contains("react")) {
            return List.of(
                    "React",
                    "JavaScript",
                    "TypeScript",
                    "HTML",
                    "CSS",
                    "REST API",
                    "Git"
            );
        }

        if (normalizedJobTitle.contains("frontend")) {
            return List.of(
                    "HTML",
                    "CSS",
                    "JavaScript",
                    "TypeScript",
                    "React",
                    "Git"
            );
        }

        if (normalizedJobTitle.contains("backend")) {
            return List.of(
                    "Java",
                    "Spring Boot",
                    "REST API",
                    "MySQL",
                    "Git"
            );
        }

        if (normalizedJobTitle.contains("software developer")) {
            return List.of(
                    "Java",
                    "Python",
                    "Git",
                    "REST API",
                    "SQL"
            );
        }

        return List.of(
                "Java",
                "Spring Boot",
                "MySQL",
                "React",
                "JavaScript",
                "REST API",
                "Git"
        );
    }

    private String buildSummary(
            String jobTitle,
            int score,
            int matchedSkills,
            int totalRoleSkills
    ) {
        return "The resume has a "
                + score
                + "/100 alignment score for "
                + jobTitle
                + ". It matches "
                + matchedSkills
                + " of "
                + totalRoleSkills
                + " role-specific technical skills.";
    }
}
