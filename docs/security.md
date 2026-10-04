# Security

> **Document type:** Security architecture reference  
> **Audience:** Developers, reviewers, maintainers, and deployment engineers  
> **Scope:** Authentication, authorization, input validation, file security, AI input security, and error handling

## Security Principle

The backend is the authoritative security boundary. Client-side validation improves user experience but is never treated as authorization or trust enforcement.

## Contents

- Security model
- Authentication
- JWT processing
- Endpoint protection
- Authorization and ownership
- Request validation
- File upload security
- AI input security
- CORS
- Error handling
- Secret management
- Production hardening

---

# SmartPlacement-AI Security Architecture

## 1. Security Boundary
The backend is authoritative for authentication, authorization, ownership, validation, and resource access. Frontend checks are usability features and are not security controls.

## 2. Password Security
Passwords are processed through Spring Security's BCryptPasswordEncoder. Plaintext passwords are not persisted.

## 3. JWT Security
JwtService creates signed tokens containing the user email as the subject, issued-at timestamp, and expiration timestamp.

The signing secret is supplied through jwt.secret. Token lifetime is supplied through jwt.expiration.

JwtAuthenticationFilter rejects empty, malformed, invalid, expired, or user-invalid JWTs.

## 4. Authorization
Public endpoints are /api/health and /api/auth/**.

TRACE requests are explicitly denied.

All other API requests require authentication.

Session creation policy is STATELESS.

## 5. CORS
The current backend permits http://localhost:5173 and allows GET, POST, PUT, DELETE, and OPTIONS requests with Authorization and Content-Type headers.

Production configuration must use the actual deployed frontend origin.

## 6. File Upload Security
Resume uploads are untrusted input.

Controls include:
- Only PDF and DOCX extensions are accepted.
- Apache Tika detects actual content type.
- Configured maximum file size is enforced.
- Original filenames are reduced to a safe filename component.
- Stored filenames use UUIDs.
- Stored paths are normalized.
- Resolved paths must remain inside the configured upload directory.

## 7. Resource Ownership
Resume access is always resolved against the authenticated user. This applies to metadata retrieval, file download, deletion, and AI analysis.

## 8. AI Input Security
Resume text is treated as untrusted content. The role-aware analysis instructions explicitly state that instructions contained inside a resume must not be followed.

The analysis contract also prohibits inventing skills, projects, experience, certifications, technologies, or achievements.

## 9. Error Security
GlobalExceptionHandler prevents SQL details, provider details, stack traces, and internal exception messages from being returned to clients.

AI failures return a controlled 503 response. Unexpected failures return a generic 500 response while details are logged server-side.

## 10. Secret Management
Do not commit database credentials, JWT secrets, AI credentials, or other private environment configuration.

## 11. Production Hardening
Before production deployment, review HTTPS enforcement, production CORS, JWT secret rotation, file-system permissions, database least privilege, rate limiting, malware scanning for uploaded documents, logging, monitoring, backup, and recovery procedures.