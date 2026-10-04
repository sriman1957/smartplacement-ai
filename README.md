# SmartPlacement-AI

SmartPlacement-AI is a student placement web application built with React and Spring Boot. The current implementation provides user authentication, student profile management, resume management, and role-aware resume analysis through an AI provider abstraction.

The application is designed around a student workflow:

1. Register and log in.
2. Maintain a placement profile.
3. Upload and manage a resume.
4. Select a target job role.
5. Analyze the resume for the selected role.
6. View a structured resume analysis.

The current AI provider is MockAIProvider. A live external AI provider is not connected in the current implementation.

## Current Status

The current implementation for the active project scope is complete.

- Day 1: Project foundation
- Day 2: Registration and password encryption
- Day 3: JWT authentication and secured APIs
- Day 4: Student profile and dashboard
- Day 5: Resume upload and management
- Day 6: Role-aware resume analysis
- Security hardening: completed
- Automated backend tests: 37/37 passing
- Frontend production build: passing
- Git branch: main
- Latest commit: dc3b974
- Working tree: clean at the documented handoff point

Multiple-resume quality testing and additional Day-6 homework items are intentionally deferred to manager review.

## Features

### Authentication

- User registration
- Username and email uniqueness
- Password hashing with BCrypt
- Login with JWT
- Stateless Spring Security authentication
- JWT validation
- Public authentication and health endpoints
- Protected application endpoints
- Username availability check

### Student Profile

- Create student profile
- View authenticated student's profile
- Update student profile
- One-to-one User to StudentProfile relationship
- Profile validation
- Placement-oriented profile fields
- Profile completion information in the React dashboard

### Resume Management

- Upload PDF resumes
- Upload DOCX resumes
- Resume metadata persistence in MySQL
- Local file-system storage
- Resume listing
- Resume metadata retrieval
- Resume download
- Resume deletion
- Resume replacement
- Resume ownership enforcement
- Apache Tika content detection
- File-size validation
- Extension validation
- Safe original filename handling
- UUID-based stored filenames
- Path traversal protection
- Cleanup of related AI analyses when a resume is replaced or deleted

### Role-Aware Resume Analysis

- PDF and DOCX text extraction
- Resume text normalization
- Job-title-based analysis
- AI provider abstraction
- MockAIProvider
- Controlled prompt builder for future provider integration
- Resume score
- Technical skills
- Strengths
- Weaknesses
- Missing skills
- Recommendations
- Summary
- Analysis persistence in MySQL
- Resume ownership verification before analysis

The current analysis is role-aware. It is not job-description matching.

## Technology Stack

### Backend

- Java 21
- Spring Boot 4.1.1
- Spring Security
- Spring Data JPA
- Hibernate
- MySQL
- JWT using JJWT 0.12.6
- Apache Tika 3.2.3
- Maven
- Lombok

### Frontend

- React 19
- Vite 8
- JavaScript
- JSX
- Axios
- Lucide React
- React Icons

### Database

- MySQL
- JPA/Hibernate schema management

## Architecture

The application follows a layered full-stack architecture.

```
React Frontend
     |
     | Axios + JWT
     v
Spring Boot REST API
     |
     +--------------------+
     |                    |
     v                    v
Services             Spring Security
     |                    |
     v                    v
Repositories        JWT Authentication
     |
     v
MySQL

Resume analysis flow:

Resume File
     |
     v
Text Extraction
     |
     v
Role-aware Analysis Service
     |
     v
AIProvider abstraction
     |
     v
MockAIProvider
     |
     v
Structured Analysis
     |
     v
ResumeAnalysis
     |
     v
MySQL
```

## Core Backend Modules

The backend is organized around controllers, services, repositories, entities, DTOs, security components, AI components, and exception handling.

Important areas include:

- `controller/`
- `service/`
- `repository/`
- `entity/`
- `dto/`
- `config/`
- `security/`
- `ai/`
- `exception/`

## API Overview

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/username-availability`

### Health

- `GET /api/health`

### Student Profile

- `GET /api/student/profile`
- `POST /api/student/profile`
- `PUT /api/student/profile`

### Resumes

- `POST /api/resumes/upload`
- `GET /api/resumes`
- `GET /api/resumes/{id}`
- `GET /api/resumes/{id}/file`
- `DELETE /api/resumes/{id}`

### AI Resume Analysis

- `POST /api/ai/resume-analyze/{resumeId}?jobTitle={jobTitle}`

Protected endpoints use the authenticated JWT identity. Resume and profile operations do not accept a frontend-supplied user ID as the authorization source.

Detailed endpoint documentation will be maintained in `docs/api.md`.

## Security

The application uses stateless JWT authentication through Spring Security.

Security controls include:

- BCrypt password hashing
- JWT signature validation
- JWT expiration validation
- Rejection of malformed or invalid bearer tokens
- User lookup during JWT authentication
- Authentication-required responses
- Access-denied responses
- Resume ownership checks
- Profile ownership through authenticated identity
- PDF and DOCX extension validation
- Apache Tika content validation
- 10 MB application-level resume limit
- UUID-based stored filenames
- Original filename sanitization
- Path traversal protection
- Safe global exception responses
- CORS restricted to the configured React development origin
- TRACE requests denied

Real secrets and API keys must not be committed to the repository.

## File Storage

Resume files are stored on the application file system. Resume metadata is stored in MySQL.

The configured application-level resume size limit is 10 MB.

The multipart request configuration remains 20 MB. The application-level resume validation still enforces the 10 MB resume limit.

Stored filenames use UUIDs rather than the original filename.

## Database Model

The main application entities are:

- User
- StudentProfile
- Resume
- ResumeAnalysis

Relationships:

```
User
 |
 +---- 1:1 ---- StudentProfile
 |
 +---- 1:N ---- Resume
                    |
                    +---- 1:N ---- ResumeAnalysis
```

Resume analysis records are unique for a given resume and job title combination.

Detailed database documentation will be maintained in `docs/database.md`.

## AI Analysis

The AI layer is provider-agnostic.

The current structure contains:

- `AIProvider` interface
- `MockAIProvider`
- `AIResumePromptBuilder`
- `AIResumeAnalyzerService`
- `ResumeAnalysisService`
- `ResumeTextExtractionService`
- `ResumeAnalysis` entity

The current provider performs deterministic role-skill matching. It does not call OpenAI, Gemini, or another external generative AI service.

The provider abstraction exists so a future provider integration does not require redesigning the surrounding resume-analysis workflow.

Detailed AI documentation will be maintained in `docs/ai-analysis.md`.

## Configuration

The committed base configuration contains the application name and active profile.

Local database, JWT, and file-storage values are supplied through the active local configuration.

Important configuration values include:

- MySQL connection settings
- `jwt.secret`
- `jwt.expiration`
- `app.file.upload-dir`
- `app.file.max-size`
- Spring multipart limits

Do not place real credentials or secrets in committed source files.

## Running the Backend

From the `backend/` directory:

```bash
./mvnw spring-boot:run
```

On Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend uses the configured local Spring profile and MySQL connection.

## Running the Frontend

From the `frontend/` directory:

```bash
npm install
npm run dev
```

The Vite development server is configured for the React frontend.

## Testing

Backend tests are run with:

```bash
./mvnw clean test
```

On Windows:

```powershell
.\mvnw.cmd clean test
```

The documented handoff state reports 37/37 backend tests passing.

The frontend production build is verified with:

```bash
npm run build
```

Manual testing has also covered resume management, AI analysis, JWT failures, and cross-user resume access.

Detailed testing documentation will be maintained in `docs/testing.md`.

## Documentation

Detailed documentation is maintained under `docs/`.

Planned documents:

- `docs/architecture.md`
- `docs/setup.md`
- `docs/api.md`
- `docs/database.md`
- `docs/security.md`
- `docs/ai-analysis.md`
- `docs/testing.md`

These documents describe the current implementation and are not a feature roadmap.

## Current Scope

The current scope includes:

- Authentication
- Student profile management
- Resume management
- Role-aware resume analysis
- Security hardening
- Testing
- Technical documentation

The current scope does not include:

- Live AI provider integration
- Job-description matching
- Resume-to-JD scoring
- Interview preparation
- Separate skill-gap recommendation features
- UI/UX redesign

Skill gaps are already part of the current resume-analysis result.

## Manager Handoff

The next ownership area is live AI provider integration.

The provider abstraction is already present. Future work should replace or extend the provider implementation without changing the existing resume ownership, text extraction, persistence, and API boundaries unless a documented requirement demands such a change.

Additional Day-6 quality exercises and UI polishing are also deferred for manager review.
