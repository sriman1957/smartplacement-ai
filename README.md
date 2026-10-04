# SmartPlacement-AI

SmartPlacement-AI is an AI-powered student placement platform that helps students prepare for placement opportunities through secure profile management, resume management, and role-aware AI resume analysis.

The application provides an end-to-end workflow:

1. Register an account.
2. Log in securely using JWT authentication.
3. Create and maintain a student placement profile.
4. Upload and manage a resume.
5. Select a target job role.
6. Analyze the resume with the integrated AI provider.
7. Review a structured analysis containing a score, skills, strengths, weaknesses, missing skills, recommendations, and a summary.

## Project Status

SmartPlacement-AI is implemented as a full-stack application with the following completed areas:

- Project foundation
- User registration
- Password hashing
- JWT authentication
- Protected REST APIs
- Student profile management
- Resume upload and management
- PDF and DOCX validation
- Resume text extraction
- Role-aware AI resume analysis
- Structured AI analysis persistence
- Security hardening
- Backend automated testing
- Frontend production build
- Technical documentation

## Core Features

### 1. Authentication

- User registration
- Unique username and email validation
- Secure password hashing with BCrypt
- Login using email and password
- JWT token generation
- Stateless Spring Security authentication
- JWT signature and expiration validation
- Protected application endpoints
- Username availability check
- Authentication and authorization error handling

### 2. Student Profile

Students can maintain placement-oriented profile information including:

- First name and last name
- Phone number
- College
- Degree
- Branch
- Graduation year
- Skills
- GitHub URL
- LinkedIn URL
- Portfolio URL
- Profile photo URL
- Career objective

The profile belongs to the authenticated user and is protected by the backend authorization layer.

### 3. Resume Management

The resume module provides:

- PDF upload
- DOCX upload
- Resume metadata persistence
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
- Safe filename handling
- UUID-based stored filenames
- Path traversal protection
- Cleanup of related analysis records when a resume is replaced or deleted

The application enforces a 10 MB application-level resume limit.

### 4. AI-Powered Role-Aware Resume Analysis

Students can analyze their resume against a selected target role.

The analysis considers the requested role and returns structured results including:

- Overall score from 0 to 100
- Technical skills
- Strengths
- Weaknesses
- Missing skills
- Recommendations
- Summary

The analysis is persisted against the resume and target job title. A resume can therefore have separate analysis results for different target roles.

The feature is role-aware rather than job-description matching. The target role determines the evaluation context used by the AI analysis workflow.

### 5. Resume Text Extraction

Uploaded PDF and DOCX files are processed with Apache Tika.

The backend:

1. Validates the uploaded file.
2. Detects the actual document type.
3. Extracts readable text.
4. Normalizes the extracted text.
5. Passes the resume content and selected role into the AI analysis workflow.

### 6. AI Analysis Workflow

The AI analysis pipeline is organized into clear application layers:

```
Authenticated Student
        |
        v
Resume + Target Job Role
        |
        v
Resume Ownership Validation
        |
        v
Resume File Validation
        |
        v
Text Extraction
        |
        v
Role-Aware AI Analysis
        |
        v
Structured Analysis Result
        |
        v
ResumeAnalysis Persistence
        |
        v
API Response
```

The AI layer uses a provider abstraction so the application-level analysis workflow remains separated from provider-specific communication.

The prompt-processing layer also treats resume content as untrusted input and instructs the AI system to use the resume as evidence rather than following instructions embedded inside the uploaded document.

## Technology Stack

### Backend

- Java 21
- Spring Boot 4.1.1
- Spring Security
- Spring Data JPA
- Hibernate
- MySQL
- JJWT 0.12.6
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
- JPA/Hibernate

### AI

- Production AI provider integration
- Provider abstraction
- Role-aware prompt construction
- Structured analysis response handling
- Persistent analysis results

## Repository Structure

```
SmartPlacement-AI/
|
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.*
│
├── docs/
│   ├── architecture.md
│   ├── setup.md
│   ├── api.md
│   ├── database.md
│   ├── security.md
│   ├── ai-analysis.md
│   └── testing.md
│
├── .gitignore
└── README.md
```

## Backend Architecture

The backend follows a layered Spring Boot architecture.

```
REST Controllers
       |
       v
Application Services
       |
       +----------------------+
       |                      |
       v                      v
Repositories            Security / AI
       |                      |
       v                      v
     MySQL             Supporting Services
```

Important backend areas include:

- Controllers
- Services
- Repositories
- Entities
- DTOs
- Security
- AI analysis
- File validation
- Text extraction
- Exception handling
- Configuration

The authenticated user's identity is obtained from the security context. User-controlled IDs are not used as the primary authorization mechanism for profile and resume ownership.

## Frontend Architecture

The React application communicates with the Spring Boot API through Axios.

The frontend is responsible for:

- Authentication screens
- Student dashboard
- Profile management
- Resume management
- Resume analysis interaction
- Display of structured analysis results
- API error handling
- Authenticated API requests

The backend remains responsible for authorization, validation, file processing, AI analysis, and persistence.

## API Overview

### Authentication

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/username-availability
```

### Health

```
GET /api/health
```

### Student Profile

```
GET  /api/student/profile
POST /api/student/profile
PUT  /api/student/profile
```

### Resumes

```
POST   /api/resumes/upload
GET    /api/resumes
GET    /api/resumes/{id}
GET    /api/resumes/{id}/file
DELETE /api/resumes/{id}
```

### AI Resume Analysis

```
POST /api/ai/resume-analyze/{resumeId}?jobTitle={jobTitle}
```

Detailed request and response documentation is maintained in `docs/api.md`.

## Database Model

The main domain entities are:

- User
- StudentProfile
- Resume
- ResumeAnalysis

The core relationships are:

```
User
 |
 +---- 1 : 1 ---- StudentProfile
 |
 +---- 1 : N ---- Resume
                     |
                     +---- 1 : N ---- ResumeAnalysis
```

Resume analyses are uniquely identified by the combination of:

- Resume
- Target job title

This allows the same resume to be analyzed for multiple target roles while preventing duplicate analysis records for the same resume and role.

Detailed database documentation is maintained in `docs/database.md`.

## Security

Security is enforced at the backend boundary.

Key controls include:

- BCrypt password hashing
- Stateless JWT authentication
- JWT signature validation
- JWT expiration validation
- Bearer token validation
- Authentication-required responses
- Access-denied responses
- Resume ownership checks
- Authenticated-user profile access
- PDF and DOCX extension validation
- Apache Tika content detection
- 10 MB application-level resume limit
- UUID-based stored filenames
- Original filename sanitization
- Path traversal protection
- Safe global exception responses
- Restricted CORS configuration
- TRACE request denial

Secrets, passwords, JWT keys, and AI provider credentials must be supplied through environment-specific configuration and must not be committed to source control.

Detailed security documentation is maintained in `docs/security.md`.

## Configuration

The base application configuration activates the local Spring profile.

Environment-specific configuration supplies values such as:

- MySQL connection details
- JWT secret
- JWT expiration
- Resume upload directory
- Resume size limit
- Multipart request limits
- AI provider credentials
- AI provider configuration

Actual secrets must never be committed to the repository.

## Running the Backend

From the `backend/` directory:

### macOS / Linux

```bash
./mvnw spring-boot:run
```

### Windows

```powershell
.\\mvnw.cmd spring-boot:run
```

The backend requires a configured MySQL database and the required environment-specific application properties.

## Running the Frontend

From the `frontend/` directory:

```bash
bun install
bun run dev
```

For a production build:

```bash
bun run build
```

## Testing

Backend tests are executed with:

```bash
./mvnw clean test
```

On Windows:

```powershell
.\\mvnw.cmd clean test
```

The project test suite covers the major backend application areas including authentication, profile management, resume processing, validation, AI analysis, and security behavior.

The frontend production build is verified with:

```bash
bun run build
```

Detailed testing information is maintained in `docs/testing.md`.

## Documentation

Detailed project documentation is organized under `docs/`:

- `docs/architecture.md` - application architecture and module responsibilities
- `docs/setup.md` - local development and configuration setup
- `docs/api.md` - REST API reference
- `docs/database.md` - database schema and relationships
- `docs/security.md` - security architecture and controls
- `docs/ai-analysis.md` - AI resume analysis workflow
- `docs/testing.md` - testing strategy and verification

## Project Scope

The completed project scope covers:

- Student authentication
- Student profile management
- Resume upload and management
- Resume text extraction
- Role-aware AI resume analysis
- Persistent analysis history by resume and target role
- Security hardening
- Backend validation
- Automated testing
- React frontend integration
- Technical documentation

The AI analysis feature is intentionally role-aware. It evaluates a resume for a selected target role and does not require a separate job-description matching workflow.

## End-to-End Flow

```
Student
  |
  v
React Frontend
  |
  | JWT-authenticated REST API
  v
Spring Boot Backend
  |
  +--> Authentication / Authorization
  |
  +--> Student Profile
  |
  +--> Resume Management
  |       |
  |       +--> File Validation
  |       +--> Apache Tika
  |       +--> File Storage
  |
  +--> AI Resume Analysis
          |
          +--> Text Extraction
          +--> Role-Aware Prompt
          +--> AI Provider
          +--> Structured Result
          +--> MySQL Persistence
  |
  v
MySQL
```

## Repository

GitHub:

https://github.com/sriman1957/smartplacement-ai

SmartPlacement-AI is structured as a production-oriented student placement application with a clear separation between frontend presentation, backend business logic, persistence, security, document processing, and AI analysis.
