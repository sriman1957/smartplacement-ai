# API Reference

> **Document type:** HTTP API contract  
> **Audience:** Frontend developers, API consumers, testers, and maintainers  
> **Base path:** `/api`

## Contract Rules

The API reference documents the public application contract exposed by the backend. Authentication requirements, validation constraints, status codes, and response semantics are part of that contract.

Clients must not depend on internal Java classes, database schema names, filesystem paths, or implementation-specific exception messages.

## Contents

- API conventions
- Authentication
- Health
- Student profile
- Resume management
- Resume analysis
- Error contract
- Status codes

---

# SmartPlacement-AI API Reference

## 1. Conventions
Base URL used by the current frontend: http://localhost:8080/api

Protected endpoints require:

~~~http
Authorization: Bearer <JWT>
~~~

## 2. Authentication
### POST /auth/register
Creates a student account. Public endpoint.

Required fields: firstName, lastName, username, email, password.

Validation includes first and last names up to 50 characters, username from 3 to 30 characters using letters, numbers, and underscores, email up to 100 characters, and password from 6 to 100 characters.

Success: 201 Created.
Duplicate email or username: 409 Conflict.

### POST /auth/login
Authenticates a user and returns a JWT. Public endpoint.

Success: 200 OK.
Invalid credentials: 401 Unauthorized.

### GET /auth/username-availability
Checks whether a username is available. Public endpoint.

Query parameter: username.

Response:
~~~json
{
  "available": true
}
~~~

## 3. Health
### GET /health
Returns application health information. Public endpoint.

## 4. Student Profile
Base path: /student/profile

All profile operations require authentication.

### GET /student/profile
Returns the authenticated student's profile. Returns 404 when no profile exists.

### POST /student/profile
Creates the authenticated student's profile. Returns 201 Created.

Required fields: phone, college, degree, branch, graduationYear, skills.
Optional fields: githubUrl, linkedinUrl, portfolioUrl, profilePhotoUrl, careerObjective.

Phone validation requires exactly 10 digits. Graduation year must be between 2000 and 2100.

### PUT /student/profile
Updates the authenticated student's existing profile. Returns 200 OK.

## 5. Resume Management
Base path: /resumes

### POST /resumes/upload
Uploads a resume using multipart/form-data. The field name is file.

Accepted formats are PDF and DOCX. The backend validates the extension and actual detected content type. The application-level file limit is configured through app.file.max-size.

Success: 201 Created.

### GET /resumes
Returns resumes belonging to the authenticated user.

### GET /resumes/{id}
Returns metadata for an owned resume.

### GET /resumes/{id}/file
Returns the stored resume as a binary resource.

### DELETE /resumes/{id}
Deletes the owned resume, its physical file, and associated analysis records. Returns 204 No Content.

## 6. AI Resume Analysis
### POST /ai/resume-analyze/{resumeId}
Analyzes an owned resume for the requested target role.

Required query parameter: jobTitle.

Example:
~~~http
POST /api/ai/resume-analyze/15?jobTitle=Java%20Full%20Stack%20Developer
~~~

The workflow validates the job title, verifies ownership, extracts resume text, invokes the AI analysis layer, validates the returned result, and creates or updates the role-specific analysis record.

Job titles are limited to 100 characters.

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

## 7. Common Status Codes
| Status | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Resource created |
| 204 | Resource deleted |
| 400 | Invalid input or request body |
| 401 | Authentication required or invalid |
| 403 | Access denied |
| 404 | Resource not found |
| 409 | Resource or database conflict |
| 413 | Upload exceeds configured request limit |
| 415 | Unsupported content type |
| 503 | AI analysis unavailable |
| 500 | Unexpected server error |