# Architecture

> **Document type:** Architecture reference  
> **Audience:** Developers, reviewers, maintainers, and technical evaluators  
> **Scope:** Application structure, boundaries, runtime flow, and design decisions

## Document Conventions

This document describes the architecture implemented in the repository. It intentionally distinguishes implemented behavior from operational recommendations. It does not prescribe an alternative architecture.

## Contents

- System context
- Architectural boundaries
- Backend responsibilities
- Authentication architecture
- Resume architecture
- AI analysis architecture
- Persistence relationships
- Frontend architecture
- Error boundary
- Design principles

---

# SmartPlacement-AI Architecture

## 1. System Overview
SmartPlacement-AI is a full-stack student placement platform built with a React frontend and Spring Boot backend. The backend separates HTTP controllers, application services, persistence repositories, security, document processing, and AI analysis.

~~~text
React Frontend
     |
     | HTTP / JSON / multipart + Bearer JWT
     v
Spring Boot REST API
     |
     +--> Spring Security / JWT
     +--> Application Services
     +--> JPA Repositories --> MySQL
     +--> Resume File Storage
     +--> Resume Text Extraction
     +--> AI Provider Abstraction
~~~

## 2. Backend Layers
### Controllers
REST controllers expose the application contract. The principal controllers are AuthController, HealthController, StudentProfileController, ProfileController, ResumeController, and AIResumeAnalysisController.

### Services
Services implement application workflows including authentication, profile management, resume lifecycle management, text extraction, and role-aware analysis.

### Repositories
Spring Data JPA repositories provide persistence access for users, profiles, resumes, and resume analyses. Ownership-aware queries are used for protected resume operations.

### Entities
The core domain entities are User, StudentProfile, Resume, and ResumeAnalysis.

## 3. Authentication Flow
Registration validates the request, checks unique email and username values, hashes the password with BCrypt, creates a STUDENT user, and returns the registration response.

Login validates credentials and issues a signed JWT. Protected requests pass through JwtAuthenticationFilter, which validates the JWT, extracts the email, loads the user, and establishes the Spring Security context.

## 4. Resume Flow
Resume uploads are handled as multipart requests. ResumeFileValidationService validates presence, size, extension, and detected content type. ResumeService sanitizes the original filename, generates a UUID-based stored filename, persists metadata, and stores the physical file.

Resume operations resolve the authenticated user before accessing a resume. This prevents direct ID-based access to another user's documents.

Uploading a new resume replaces the user's existing resume. Existing analysis records and the previous physical file are removed before the old resume record is deleted.

## 5. AI Analysis Flow
~~~text
POST /api/ai/resume-analyze/{resumeId}
             |
             v
ResumeAnalysisService
             |
             +--> ownership validation
             +--> text extraction
             +--> AI analysis
             +--> response validation
             +--> create/update persistence
             v
ResumeAnalysisResponse
~~~

AIProvider is the provider boundary. AIResumeAnalyzerServiceImpl handles validation and provider invocation, while ResumeAnalysisService owns the end-to-end application workflow.

AIResumePromptBuilder defines role-specific evaluation criteria and a structured output contract.

## 6. Frontend Architecture
The React application is organized around authentication screens, the student dashboard, profile management, resume management, and resume analysis.

Axios is centralized in services/api.js. Its request interceptor reads the JWT from browser local storage and adds the Bearer Authorization header.

Service modules isolate API calls from UI components. Resume downloads use binary blob responses.

## 7. Persistence Relationships
~~~text
User 1 -------- 1 StudentProfile
User 1 -------- N Resume
Resume 1 ------ N ResumeAnalysis
~~~

ResumeAnalysis has a unique constraint on the combination of resume_id and job_title. This permits the same resume to be evaluated independently for different target roles.

## 8. Error Handling
GlobalExceptionHandler converts application and framework exceptions into controlled JSON responses. Spring Security separately handles unauthenticated and access-denied requests.

## 9. Architectural Principles
- Controllers handle HTTP concerns.
- Services own business workflows.
- Repositories own persistence access.
- Backend authorization is authoritative.
- Uploaded documents are treated as untrusted input.
- AI provider interaction is isolated behind an abstraction.
- Internal exception details are not exposed to API clients.