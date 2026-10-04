# Testing and Verification

> **Document type:** Verification guide  
> **Audience:** Developers, reviewers, maintainers, and release owners  
> **Scope:** Automated tests, frontend verification, regression coverage, and release checks

## Verification Philosophy

Tests are organized around application boundaries and observable behavior. Particular attention is given to authentication, ownership, file handling, AI response validation, and role-aware persistence because failures in these areas can affect correctness or security.

## Contents

- Testing objectives
- Backend test structure
- Application context verification
- Prompt builder verification
- Provider boundary verification
- AI service verification
- Resume analysis verification
- Text extraction verification
- Backend execution
- Frontend verification
- Verification matrix
- Release regression checklist

---

# SmartPlacement-AI Testing Guide

## 1. Testing Strategy
The backend uses Spring Boot's test dependencies configured in Maven. The repository contains application-context tests, AI prompt tests, provider-boundary tests, analysis service tests, and text extraction tests.

## 2. Backend Test Layout
~~~text
backend/src/test/java/com/vhub/smartplacement/
|-- BackendApplicationTests.java
|-- ai/
|   |-- AIResumePromptBuilderTest.java
|   `-- MockAIProviderTest.java
`-- service/
    |-- AIResumeAnalyzerServiceImplTest.java
    |-- ResumeAnalysisServiceTest.java
    `-- ResumeTextExtractionServiceTest.java
~~~

## 3. Application Context
BackendApplicationTests verifies that the Spring Boot application context can initialize under the test configuration.

## 4. AI Prompt Tests
AIResumePromptBuilderTest covers required inputs, role-aware criteria, structured output requirements, evidence-based scoring rules, and treatment of resume content as untrusted input.

## 5. AI Analysis Tests
AIResumeAnalyzerServiceImplTest covers blank input rejection, provider invocation, null provider results, provider failures, and successful result propagation.

ResumeAnalysisServiceTest covers user resolution, resume ownership, text extraction, AI invocation, response validation, and create/update persistence behavior.

## 6. Text Extraction Tests
ResumeTextExtractionServiceTest covers valid extraction, missing files, invalid paths, empty extracted text, read failures, path containment, and whitespace normalization.

## 7. Run Backend Tests
From the backend directory:

~~~powershell
.\mvnw.cmd clean test
~~~

## 8. Frontend Validation
From the frontend directory:

~~~bash
npm run lint
npm run build
~~~

## 9. Regression Checklist
Before a release candidate:
1. Backend tests pass.
2. Frontend lint passes.
3. Frontend production build passes.
4. Registration and login work.
5. Protected endpoints reject missing authentication.
6. Profile create, read, and update work.
7. PDF and DOCX validation works.
8. Resume ownership is enforced.
9. Resume replacement removes stale analysis and files.
10. Resume text extraction works.
11. Role-aware analysis works.
12. Same resume and role updates the existing analysis.
13. Same resume with another role creates another analysis.
14. Invalid analysis output is rejected.
15. AI failures return controlled 503 responses.
16. Error responses do not expose internal implementation details.