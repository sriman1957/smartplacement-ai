# Architecture

> **Document type:** Architecture reference  
> **Audience:** Developers, reviewers, maintainers, and technical evaluators  
> **Status:** Maintained  
> **Source of truth:** Current repository implementation  
> **Scope:** System structure, boundaries, runtime flows, persistence, security boundaries, and architectural decisions

## Contents

- System context
- Architectural boundaries
- Component responsibilities
- Dependency direction
- Runtime flows
- Security and trust boundary
- Persistence relationships
- Architectural decisions
- Design principles
- Related documentation

---

## 1. System Context

SmartPlacement-AI is a full-stack student placement platform. The React frontend communicates with a Spring Boot REST API. The backend owns authentication, authorization, profile management, resume lifecycle, text extraction, AI analysis orchestration, and persistence.

~~~text
Student
   |
   v
React Frontend
   | HTTP / JSON / multipart + Bearer JWT
   v
Spring Boot REST API
   |
   +--> Spring Security / JWT
   +--> Application Services
   +--> Spring Data JPA --> MySQL
   +--> Resume File Storage
   +--> Apache Tika
   +--> AI Provider abstraction --> Integrated AI provider
~~~

The browser is a client and is not an authorization boundary. The backend is authoritative for authenticated identity, resource ownership, validation, and protected operations.

## 2. Architectural Boundaries

### Frontend boundary

The frontend is responsible for presentation, user interaction, client-side form validation, authentication state handling, and API communication. Axios centralizes HTTP behavior and attaches the JWT from browser local storage to protected requests.

The frontend must not be treated as the source of truth for authorization or resource ownership.

### Backend boundary

The Spring Boot application is the application and security boundary. Controllers translate HTTP requests into application operations. Services implement business workflows. Repositories provide persistence access. Specialized services isolate filesystem, document extraction, and AI provider concerns.

### Persistence boundary

MySQL stores application state and resume metadata. Resume binary content is stored in the configured filesystem directory rather than in database blobs.

### AI boundary

AIProvider isolates the external AI capability from the application workflow. Resume content and AI output cross this boundary as untrusted data and are validated before persisted application state is updated.

## 3. Component Responsibilities

| Component | Responsibility |
|---|---|
| Controllers | HTTP routing, authentication context access, request/response mapping |
| Services | Business workflows and application rules |
| Repositories | Database access through Spring Data JPA |
| Security | JWT authentication, endpoint protection, CORS, stateless sessions |
| Resume validation | File type, content, and upload validation |
| File storage | Controlled filesystem persistence and path validation |
| Text extraction | Apache Tika based resume text extraction |
| AI prompt builder | Role-specific evaluation instructions and output contract |
| AI provider abstraction | Provider integration boundary |
| Exception handler | Consistent client-safe application errors |
| React services | Frontend API integration |

## 4. Dependency Direction

The application follows a layered dependency direction:

~~~text
HTTP / React client
       |
       v
Controllers
       |
       v
Application Services
       |
       +------> Repositories ------> MySQL
       |
       +------> File storage
       |
       +------> Text extraction
       |
       +------> AI abstraction ------> AI provider
~~~

Business workflows remain in services rather than controllers. Resource ownership checks are performed on the backend before protected resume operations proceed.

## 5. Runtime Flows

### Authentication

~~~text
Login request
    |
    v
AuthController
    |
    v
Authentication / Spring Security
    |
    +--> Verify BCrypt password
    +--> Issue signed JWT
    v
JWT returned to client
    |
    v
Protected API request
    |
    v
JwtAuthenticationFilter
    |
    +--> Validate token
    +--> Resolve authenticated user
    v
Spring Security context
    |
    v
Protected controller/service
~~~

The application uses stateless sessions. Public access is limited to the health endpoint and authentication endpoints. TRACE requests are explicitly denied.

### Resume upload

~~~text
Multipart upload
      |
      v
ResumeController
      |
      v
ResumeService
      |
      +--> Validate extension, size, and detected content type
      +--> Sanitize original filename
      +--> Generate UUID-based stored filename
      +--> Write file to configured storage directory
      +--> Persist resume metadata
      +--> Remove previous resume and analyses
      v
ResumeResponse
~~~

### AI analysis

~~~text
resumeId + jobTitle
       |
       v
AIResumeAnalysisController
       |
       v
ResumeAnalysisService
       |
       +--> Resolve authenticated user
       +--> Verify resume ownership
       +--> Extract resume text
       +--> Build role-aware prompt
       +--> Invoke AI provider
       +--> Validate structured AI result
       +--> Create/update ResumeAnalysis
       v
ResumeAnalysisResponse
~~~

The same resume can be evaluated for multiple target roles. The persisted analysis identity is the combination of resume_id and job_title.

## 6. Security and Trust Boundary

~~~text
UNTRUSTED INPUT
Browser input / uploaded file / extracted resume text / AI output
        |
        v
Backend validation + authorization
        |
        +--> Authentication
        +--> Ownership checks
        +--> File validation
        +--> Path containment
        +--> AI output validation
        v
Persisted application state
~~~

Uploaded resume text can contain adversarial instructions. The AI prompt explicitly treats resume content as evidence rather than executable instructions. AI output is also treated as untrusted until application validation succeeds.

## 7. Persistence Relationships

~~~text
User 1 -------- 1 StudentProfile
User 1 -------- N Resume
Resume 1 ------ N ResumeAnalysis
~~~

A resume analysis cannot be meaningfully addressed independently of its parent resume. Resume deletion and replacement clean up associated analyses and physical files.

## 8. Architectural Decisions

### Stateless JWT authentication

**Decision:** Use signed JWTs with stateless Spring Security sessions.

**Reason:** The frontend and backend communicate through a REST API without requiring server-side session state.

**Consequence:** Token lifetime, secret protection, and client-side token handling remain important security concerns.

### Role-aware analysis

**Decision:** Include the target job title as an explicit analysis input and apply role-specific criteria where supported.

**Reason:** Resume suitability depends on the intended technical role.

**Consequence:** The same resume can produce different analyses for different roles, and the role becomes part of analysis identity.

### Filesystem storage for resume binaries

**Decision:** Store resume binary content on the configured filesystem and persist metadata in MySQL.

**Reason:** The current implementation separates binary document storage from relational application state.

**Consequence:** File permissions, backup, path integrity, and storage lifecycle must be managed alongside database state.

### AI provider abstraction

**Decision:** Keep provider interaction behind AIProvider.

**Reason:** Application workflows should not depend directly on provider-specific client implementation.

**Consequence:** Provider integration can change without moving AI concerns into controllers or persistence.

## 9. Design Principles

- Backend authorization is authoritative.
- Controllers handle HTTP concerns rather than business workflows.
- Services own application behavior.
- Repositories own persistence access.
- Uploaded documents are untrusted input.
- AI responses are untrusted external data until validated.
- Resource ownership is enforced with authenticated identity.
- Provider-specific AI behavior is isolated behind an abstraction.
- Internal implementation details are not exposed through API errors.

## 10. Related Documentation

- setup.md - local development and configuration
- api.md - HTTP API contract
- database.md - persistence model
- security.md - security controls and threat model
- ai-analysis.md - AI subsystem contract
- testing.md - verification strategy
