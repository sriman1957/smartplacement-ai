# Development Setup

> **Document type:** Developer guide  
> **Audience:** Contributors and maintainers  
> **Status:** Maintained  
> **Source of truth:** Current repository implementation  
> **Scope:** Local development, configuration, startup, verification, and troubleshooting

## Contents

- Prerequisites
- Repository layout
- Configuration
- Database
- Resume storage
- Backend startup
- Frontend startup
- Verification
- Troubleshooting
- First-run checklist

---

## 1. Prerequisites

- Java 21
- MySQL
- Node.js
- npm
- Git

The project uses the Maven wrapper for backend builds and npm for frontend dependency management.

## 2. Repository Layout

~~~text
SmartPlacement-AI/
|-- backend/
|   |-- pom.xml
|   |-- mvnw
|   |-- mvnw.cmd
|   +-- src/
|-- frontend/
|   |-- package.json
|   |-- package-lock.json
|   +-- src/
|-- docs/
+-- README.md
~~~

## 3. Configuration

The committed application.properties activates the local Spring profile. The repository does not contain a committed application-local.properties file.

The local runtime must supply the environment-specific values required by the application, including:

| Configuration area | Purpose |
|---|---|
| MySQL datasource | Database connection |
| JPA/Hibernate | Persistence behavior |
| jwt.secret | JWT signing secret |
| jwt.expiration | JWT lifetime |
| app.file.upload-dir | Resume filesystem location |
| app.file.max-size | Application resume size limit |
| Multipart limits | HTTP upload limits |
| AI provider configuration | AI service access |

Do not commit passwords, JWT secrets, AI credentials, or other private configuration.

## 4. Database

The backend uses MySQL through Spring Data JPA and Hibernate.

The repository does not contain a committed SQL migration directory. Schema creation and update behavior therefore depends on the active Spring/JPA configuration. A production deployment should establish an explicit database migration strategy before treating the schema as release-managed infrastructure.

## 5. Resume Storage

FileStorageConfig creates the configured resume directory during application startup. Stored resume filenames are generated as UUID-based names. Original filenames are retained only as sanitized metadata.

The configured storage directory is part of application state and must be writable by the backend process.

## 6. Start the Backend

From the backend directory:

~~~powershell
.\mvnw.cmd spring-boot:run
~~~

The frontend currently expects the backend API at:

~~~text
http://localhost:8080/api
~~~

## 7. Start the Frontend

From the frontend directory:

~~~bash
npm install
npm run dev
~~~

The current backend CORS configuration permits:

~~~text
http://localhost:5173
~~~

## 8. Verification

Backend:

~~~powershell
.\mvnw.cmd clean test
~~~

Frontend:

~~~bash
npm run lint
npm run build
npm run preview
~~~

A successful setup should allow registration, login, profile operations, resume upload/download/delete, and authenticated role-aware resume analysis.

## 9. Troubleshooting

### Frontend cannot reach the backend

Verify that the Spring Boot application is running on port 8080 and that the frontend is using the expected API base URL.

### Browser reports a CORS error

Verify that the frontend origin matches the configured backend origin. The current development configuration permits http://localhost:5173.

### Resume upload fails

Check the file extension, detected document type, configured application size limit, multipart request limits, and write permissions for the resume storage directory.

### AI analysis returns 503

The backend maps AI processing failures to 503 Service Unavailable. Check the local AI provider configuration and backend logs without exposing provider credentials.

### Database connection fails

Verify that MySQL is running and that the local datasource URL, username, password, and database configuration match the local environment.

## 10. First-Run Checklist

1. Install prerequisites.
2. Configure local MySQL access.
3. Configure JWT settings.
4. Configure resume storage.
5. Configure the integrated AI provider.
6. Start the backend.
7. Start the frontend.
8. Run backend tests.
9. Run frontend lint and build.
10. Register a student account.
11. Create the student profile.
12. Upload a PDF or DOCX resume.
13. Verify resume metadata and file retrieval.
14. Run role-aware analysis.
15. Verify that protected resources cannot be accessed without authentication.
