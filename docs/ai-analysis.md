# SmartPlacement-AI Resume Analysis

## 1. Purpose
The AI subsystem evaluates a resume against a selected technical job role. It is role-aware, so the same resume can receive different assessments for different target roles.

## 2. Pipeline
~~~text
Resume ID + Job Title
        |
        v
Ownership Validation
        |
        v
Apache Tika Text Extraction
        |
        v
Role-Aware Prompt Construction
        |
        v
AI Provider
        |
        v
Response Validation
        |
        v
Create or Update ResumeAnalysis
        |
        v
API Response
~~~

## 3. Text Extraction
ResumeTextExtractionService resolves the stored UUID filename inside the configured storage directory, verifies that the file exists and is regular, extracts text with Apache Tika, normalizes whitespace, and rejects empty extracted content.

## 4. Role-Aware Criteria
Explicit criteria are defined for Java Full Stack Developer, Python Backend Developer, and Frontend Developer.

Java Full Stack Developer criteria include Java, Spring, Spring Boot, REST APIs, JPA/Hibernate, microservices, SQL databases, React, JavaScript, HTML, CSS, Git, testing, Docker, CI/CD, and cloud technologies.

Python Backend Developer criteria include Python, Django, FastAPI, REST APIs, PostgreSQL, MySQL, SQL, database design, Git, testing, Docker, CI/CD, and cloud technologies.

Frontend Developer criteria include HTML, CSS, JavaScript, React, responsive design, web accessibility, Git, testing, build tools, and CI/CD.

Other roles use a general technical, practical, and professional evaluation model.

## 5. Evidence-Based Evaluation
The prompt contract requires a score from 0 to 100 and instructs the evaluator to base the assessment only on evidence present in the resume.

The evaluator must not award credit for unsupported skills or treat ambiguous references as demonstrated skills.

## 6. Output Contract
The analysis response contains exactly seven logical fields:
- score
- technicalSkills
- strengths
- weaknesses
- missingSkills
- recommendations
- summary

Score must be an integer from 0 to 100. All textual fields must contain meaningful values before persistence.

## 7. Provider Boundary
AIProvider isolates provider interaction from application orchestration. AIResumeAnalyzerServiceImpl validates inputs, invokes the provider, rejects null results, and converts unexpected provider failures into AIAnalysisException.

## 8. Persistence
ResumeAnalysisService creates a new analysis when no record exists for the resume and job title. If the combination already exists, the stored analysis fields are updated.

The unique key is resume_id plus job_title.

## 9. Failure Handling
Invalid AI output is rejected before persistence. Analysis failures are returned to API clients as 503 Service Unavailable without exposing provider internals.

## 10. Security
Resume content is treated as untrusted input. Prompt instructions explicitly prohibit following instructions embedded in the uploaded resume and prohibit fabricated candidate evidence.