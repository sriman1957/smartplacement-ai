# API Reference

> **Document type:** HTTP API contract  
> **Audience:** Frontend developers, API consumers, testers, and maintainers  
> **Status:** Maintained  
> **Source of truth:** Current Spring Boot controllers, DTOs, validation, security configuration, and exception handlers  
> **Base path:** /api

## Contents

- Contract conventions
- Authentication
- Health
- Student profile
- Resume management
- Resume analysis
- Error contract
- Status codes
- Ownership semantics

---

## 1. Contract Conventions

Protected endpoints require:

~~~http
Authorization: Bearer <JWT>
~~~

The current frontend uses http://localhost:8080/api as its development base URL.

Clients must not depend on Java class names, database schema names, filesystem paths, or internal exception messages.

## 2. Authentication

### Public endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | /health | Application health |
| POST | /auth/register | Create student account |
| POST | /auth/login | Authenticate user |
| GET | /auth/username-availability | Check username availability |

All other endpoints require authentication.

### POST /auth/register

Creates a student account. New registrations receive the STUDENT role.

Request fields:

| Field | Type | Required | Constraints |
|---|---|---:|---|
| firstName | string | Yes | Maximum 50 characters |
| lastName | string | Yes | Maximum 50 characters |
| username | string | Yes | 3-30 characters, letters/numbers/underscore |
| email | string | Yes | Maximum 100 characters |
| password | string | Yes | 6-100 characters |

Responses:

- 201 Created
- 400 Bad Request
- 409 Conflict

### POST /auth/login

Authenticates a user and returns a signed JWT.

Responses:

- 200 OK
- 401 Unauthorized

### GET /auth/username-availability?username={username}

Checks whether the requested username is available.

Example:

~~~json
{
  "available": true
}
~~~

## 3. Health

### GET /health

Public health endpoint used to verify that the backend is reachable.

Response: 200 OK when the endpoint is available.

## 4. Student Profile

Base path: /student/profile.

Authentication is required.

### GET /student/profile

Returns the authenticated student's profile.

- 200 OK when a profile exists.
- 404 Not Found when no profile exists.

### POST /student/profile

Creates the authenticated user's profile.

Required fields: phone, college, degree, branch, graduationYear, skills.

Optional fields: githubUrl, linkedinUrl, portfolioUrl, profilePhotoUrl, careerObjective.

Constraints:

- phone: exactly 10 digits.
- college: maximum 200 characters.
- degree: maximum 100 characters.
- branch: maximum 100 characters.
- graduationYear: 2000-2100.
- skills: maximum 2000 characters.
- URL fields: HTTPS validation.
- careerObjective: maximum 2000 characters.

Responses:

- 201 Created
- 400 Bad Request
- 409 Conflict

### PUT /student/profile

Updates the authenticated user's existing profile.

Responses:

- 200 OK
- 400 Bad Request
- 404 Not Found

## 5. Resume Management

Base path: /resumes.

Authentication is required.

### POST /resumes/upload

Uploads a resume using multipart/form-data.

Multipart field:

~~~text
file
~~~

Supported formats are PDF and DOCX. The backend validates extension, configured size limits, and detected content type.

Response: 201 Created.

Uploading a new resume replaces the user's existing resume. Associated analyses and the previous physical file are cleaned up by the replacement workflow.

### GET /resumes

Returns resume metadata belonging to the authenticated user.

Response: 200 OK.

### GET /resumes/{id}

Returns metadata for an owned resume.

- 200 OK when the resource belongs to the authenticated user.
- 404 Not Found when it cannot be resolved for that user.

### GET /resumes/{id}/file

Returns the stored resume as a binary resource.

The content type is detected from the stored file when possible. The fallback is application/octet-stream.

Responses:

- 200 OK
- 401 Unauthorized
- 404 Not Found

### DELETE /resumes/{id}

Deletes the owned resume, associated analysis records, and physical resume file.

Response: 204 No Content.

## 6. Resume Analysis

### POST /ai/resume-analyze/{resumeId}?jobTitle={jobTitle}

Analyzes an owned resume for the requested target role.

Parameters:

| Parameter | Location | Required | Constraint |
|---|---|---:|---|
| resumeId | Path | Yes | Existing resume owned by caller |
| jobTitle | Query | Yes | Maximum 100 characters |

Example:

~~~http
POST /api/ai/resume-analyze/15?jobTitle=Java%20Full%20Stack%20Developer
Authorization: Bearer <JWT>
~~~

The workflow performs ownership validation, text extraction, role-aware prompt construction, AI provider invocation, response validation, and persistence.

Response fields:

- id
- resumeId
- jobTitle
- score
- technicalSkills
- strengths
- weaknesses
- missingSkills
- recommendations
- summary
- createdAt

Responses:

- 200 OK
- 400 Bad Request
- 401 Unauthorized
- 404 Not Found
- 503 Service Unavailable

## 7. Error Contract

### Validation errors

Request validation returns:

~~~json
{
  "message": "Validation failed",
  "errors": {
    "email": "..."
  }
}
~~~

### General application errors

Most controlled application errors use:

~~~json
{
  "message": "..."
}
~~~

### Authentication

401 Unauthorized:

~~~json
{
  "message": "Authentication is required"
}
~~~

### Authorization

403 Forbidden:

~~~json
{
  "message": "You do not have permission to access this resource"
}
~~~

### AI failures

AI processing failures return 503 Service Unavailable with a client-safe message. Provider internals are not exposed.

## 8. Status Code Reference

| Status | Meaning |
|---|---|
| 200 | Request succeeded |
| 201 | Resource created |
| 204 | Resource deleted |
| 400 | Invalid input or malformed request |
| 401 | Authentication required or invalid |
| 403 | Authenticated request is forbidden |
| 404 | Resource not found for the request context |
| 405 | HTTP method is not supported |
| 409 | Request conflicts with existing data |
| 413 | Upload exceeds permitted size |
| 415 | Unsupported content type |
| 503 | AI analysis unavailable |
| 500 | Unexpected server error |

## 9. Ownership Semantics

Protected resume operations are scoped to the authenticated user.

~~~text
resumeId + authenticated user
             |
             v
      findByIdAndUser
             |
       +-----+-----+
       |           |
     match       no match
       |           |
    allow       not found
~~~

This rule applies to resume metadata retrieval, file access, deletion, and AI analysis.

## 10. Related Documentation

- architecture.md - runtime and component architecture
- security.md - authentication, authorization, and threat model
- database.md - persisted resource model
- ai-analysis.md - analysis subsystem contract
