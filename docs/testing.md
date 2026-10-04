# Testing and Verification

> **Document type:** Verification guide  
> **Audience:** Developers, reviewers, maintainers, and release owners  
> **Status:** Maintained  
> **Source of truth:** Current repository test suite and frontend verification commands  
> **Scope:** Automated tests, regression coverage, frontend verification, and release checks

## Contents

- Verification objectives
- Test taxonomy
- Backend test structure
- Test responsibilities
- Requirement coverage
- Frontend verification
- Execution commands
- Regression scenarios
- Release gate
- Current limitations

---

## 1. Verification Objectives

Testing focuses on observable application behavior and high-risk boundaries:

- Authentication.
- Resource ownership.
- Resume file handling.
- Filesystem path safety.
- Text extraction.
- AI prompt construction.
- AI provider failures.
- AI response validation.
- Role-aware analysis persistence.

## 2. Test Taxonomy

### Unit-level verification

Isolates business and utility behavior such as prompt construction, AI service behavior, and text extraction.

### Application-context verification

Verifies that the Spring Boot application context can initialize under the test configuration.

### Service workflow verification

Verifies application-layer rules, including ownership and persistence decisions.

### Frontend verification

The current frontend verification uses linting and production build validation.

## 3. Backend Test Structure

~~~text
backend/src/test/java/com/vhub/smartplacement/
|-- BackendApplicationTests.java
|-- ai/
|   |-- AIResumePromptBuilderTest.java
|   +-- MockAIProviderTest.java
+-- service/
    |-- AIResumeAnalyzerServiceImplTest.java
    |-- ResumeAnalysisServiceTest.java
    +-- ResumeTextExtractionServiceTest.java
~~~

## 4. Test Responsibilities

### BackendApplicationTests

Verifies that the Spring Boot application context initializes successfully.

### AIResumePromptBuilderTest

Covers prompt inputs, role-aware criteria, structured output requirements, evidence-based scoring rules, and treatment of resume content as untrusted input.

### MockAIProviderTest

Verifies provider abstraction behavior used by the analysis service test suite.

### AIResumeAnalyzerServiceImplTest

Covers blank input rejection, provider invocation, null provider results, provider failures, and successful result propagation.

### ResumeAnalysisServiceTest

Covers user resolution, resume ownership, text extraction, AI invocation, response validation, and create/update persistence behavior.

### ResumeTextExtractionServiceTest

Covers valid extraction, missing files, invalid paths, empty extracted text, read failures, path containment, and whitespace normalization.

## 5. Requirement-to-Test Coverage

| Requirement / behavior | Primary verification |
|---|---|
| Spring application starts | BackendApplicationTests |
| Role-specific prompt criteria | AIResumePromptBuilderTest |
| Prompt injection defense instructions | AIResumePromptBuilderTest |
| AI provider invocation | AIResumeAnalyzerServiceImplTest |
| Null AI result rejection | AIResumeAnalyzerServiceImplTest |
| Provider failure handling | AIResumeAnalyzerServiceImplTest |
| Resume ownership | ResumeAnalysisServiceTest |
| AI response score validation | ResumeAnalysisServiceTest |
| Required AI field validation | ResumeAnalysisServiceTest |
| Resume text extraction | ResumeTextExtractionServiceTest |
| Path containment | ResumeTextExtractionServiceTest |
| Empty extracted text | ResumeTextExtractionServiceTest |
| Same resume + role update behavior | ResumeAnalysisServiceTest |
| Multiple roles per resume | ResumeAnalysisServiceTest |

## 6. Frontend Verification

From the frontend directory:

~~~bash
npm run lint
npm run build
~~~

The current repository does not document a frontend component or end-to-end test suite. Lint and production build validation are therefore the current automated frontend gates.

## 7. Execution Commands

Backend:

~~~powershell
.\mvnw.cmd clean test
~~~

Frontend:

~~~bash
npm run lint
npm run build
~~~

## 8. Regression Scenarios

### Authentication

1. Register a new student.
2. Attempt duplicate email registration.
3. Attempt duplicate username registration.
4. Login with valid credentials.
5. Verify invalid credentials return 401.
6. Verify protected endpoints reject missing authentication.

### Profile

1. Create a profile.
2. Retrieve the profile.
3. Update the profile.
4. Verify invalid field values are rejected.

### Resume lifecycle

1. Upload a valid PDF.
2. Upload a valid DOCX.
3. Reject unsupported file types.
4. Reject oversized files.
5. Retrieve owned resume metadata.
6. Download an owned resume.
7. Attempt access with another user's identity.
8. Upload a replacement resume.
9. Verify the previous resume and analyses are cleaned up.
10. Delete the active resume.

### AI analysis

1. Analyze a resume for a supported role.
2. Analyze the same resume for a different role.
3. Analyze the same resume and role again.
4. Verify the existing analysis is updated rather than duplicated.
5. Verify invalid AI scores are rejected.
6. Verify incomplete AI output is rejected.
7. Verify provider failures produce controlled 503 behavior.
8. Verify resume content is treated as untrusted input.

## 9. Release Gate

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

## 10. Current Limitations

The current verification documentation does not claim:

- A measured code coverage percentage.
- A CI/CD quality gate.
- Automated browser end-to-end coverage.
- Load testing.
- Security penetration testing.
- Production observability validation.

Those should only be documented as implemented when the repository contains the corresponding tooling and verification evidence.

## 11. Related Documentation

- setup.md - how to run verification locally
- architecture.md - boundaries being verified
- api.md - API behavior under test
- security.md - security controls and threat model
- ai-analysis.md - AI subsystem behavior
