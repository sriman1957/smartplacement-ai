# SmartPlacement-AI

<p align="center">
  <strong>AI-Powered Resume Intelligence for Student Placements</strong>
</p>

<p align="center">
  Build a stronger placement profile, manage resumes securely, and receive role-specific AI feedback before applying for technical opportunities.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white" alt="Java 21">
  <img src="https://img.shields.io/badge/Spring%20Boot-4.1.1-6DB33F-6DB33F?logo=springboot&logoColor=white" alt="Spring Boot 4.1.1">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19">
  <img src="https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/AI-Powered-7C3AED" alt="AI Powered">
</p>

---

## Overview

SmartPlacement-AI is a full-stack student placement platform focused on resume intelligence and placement readiness.

It provides a secure workflow for students to:

- Create and manage a professional placement profile
- Upload and manage resumes
- Select a target technical role
- Analyze a resume with an integrated AI provider
- Review structured, role-specific feedback
- Identify strengths, weaknesses, missing skills, and improvement areas

The platform separates presentation, HTTP handling, business workflows, persistence, security, document processing, and AI analysis responsibilities.

## Why SmartPlacement-AI

Traditional resume review is often generic. SmartPlacement-AI evaluates a resume in the context of a selected technical role so that the same resume can produce different role-specific assessments.

Supported role-specific criteria currently include Java Full Stack Developer, Python Backend Developer, and Frontend Developer. Other job titles use the general technical, practical, and professional evaluation model implemented by the prompt builder.

## Key Capabilities

### Authentication and Authorization

- User registration and login
- Unique username and email validation
- BCrypt password hashing
- JWT-based authentication
- Stateless Spring Security
- JWT signature and expiration validation
- Protected REST APIs
- Username availability checking
- Centralized authentication and authorization error handling

### Student Profile Management

Students can maintain:

- Name
- Phone number
- College
- Degree
- Branch
- Graduation year
- Skills
- GitHub
- LinkedIn
- Portfolio
- Profile photo
- Career objective

Profile data is associated with the authenticated user.

### Resume Management

The resume module supports:

- PDF uploads
- DOCX uploads
- Resume metadata persistence
- Local filesystem storage
- Resume listing
- Resume metadata retrieval
- Resume download
- Resume deletion
- Resume replacement
- Resume ownership enforcement
- File extension validation
- Apache Tika content detection
- File-size validation
- Safe filename handling
- UUID-based stored filenames
- Path traversal protection
- Related analysis cleanup

The application-level resume size limit is configured through app.file.max-size.

### AI-Powered Resume Analysis

Students can analyze a resume for a selected target role.

The analysis returns:

| Result | Description |
|---|---|
| Score | Overall resume score from 0 to 100 |
| Technical Skills | Technical skills supported by resume evidence |
| Strengths | Strengths supported by resume evidence |
| Weaknesses | Role-relevant weaknesses or limited evidence |
| Missing Skills | Relevant skills not demonstrated |
| Recommendations | Practical improvement guidance |
| Summary | Concise role-specific assessment |

Analysis results are persisted against both the resume and target job role. The same resume can therefore have independent analyses for multiple target roles.

### Resume Text Extraction

PDF and DOCX resumes are processed with Apache Tika.

The backend:

1. Validates the uploaded document.
2. Detects the actual document content type.
3. Extracts readable resume text.
4. Normalizes extracted content.
5. Passes the extracted text into the role-aware analysis workflow.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 |
| Build Tool | Vite 8 |
| HTTP Client | Axios |
| Backend | Java 21 |
| Backend Framework | Spring Boot 4.1.1 |
| Security | Spring Security + JWT |
| Persistence | Spring Data JPA + Hibernate |
| Database | MySQL |
| Document Processing | Apache Tika 3.2.3 |
| Build Tool | Maven |
| AI | Integrated AI provider |
| UI Icons | Lucide React + React Icons |

## Architecture

SmartPlacement-AI follows a layered full-stack architecture.

~~~text
Student
   |
   v
React Frontend
   | Axios / JSON / multipart / Bearer JWT
   v
Spring Boot REST API
   |
   +--> Spring Security / JWT
   +--> Controllers
   +--> Application Services
   +--> Spring Data JPA --> MySQL
   +--> Resume File Storage
   +--> Apache Tika
   +--> AIProvider --> Integrated AI provider
~~~

The backend is the authoritative security boundary. Client-side validation is not treated as authorization.

## Core Workflow

~~~text
Authentication
      |
      v
Student Profile
      |
      v
Resume Upload
      |
      +--> File validation
      +--> Secure filesystem storage
      |
      v
Target Role
      |
      v
Resume Ownership Check
      |
      v
Text Extraction
      |
      v
Role-Aware AI Analysis
      |
      +--> Score
      +--> Technical Skills
      +--> Strengths
      +--> Weaknesses
      +--> Missing Skills
      +--> Recommendations
      +--> Summary
      |
      v
Validated Persistent Analysis
~~~

## Security

Security is enforced at the backend boundary.

### Authentication

- BCrypt password hashing
- Stateless JWT authentication
- JWT signature validation
- JWT expiration validation
- Bearer token processing

### Authorization

- Protected application endpoints
- Authenticated-user profile access
- Resume ownership verification
- Centralized 401 and 403 handling
- Explicit TRACE denial

### File Security

- PDF and DOCX validation
- Apache Tika content detection
- Configured upload limits
- UUID-based storage filenames
- Safe original filename handling
- Path containment protection

### AI Input Security

Uploaded resume content is treated as untrusted input. The prompt explicitly instructs the evaluator not to follow instructions embedded in the resume and not to invent candidate evidence. AI output is validated before persistence.

## Database Model

~~~text
User
├── StudentProfile       1 : 1
└── Resume               1 : N
      └── ResumeAnalysis 1 : N
~~~

A resume analysis is identified by the combination of the resume and target job title.

## Repository Structure

~~~text
SmartPlacement-AI/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   └── test/
│   └── pom.xml
├── frontend/
│   ├── src/
│   └── package.json
├── docs/
├── CONTRIBUTING.md
├── .gitignore
├── README.md
└── README.snapshot.md
~~~

## Getting Started

### Prerequisites

- Java 21
- MySQL
- Node.js
- npm
- Git

### Backend

From backend:

~~~powershell
.\mvnw.cmd spring-boot:run
~~~

### Frontend

From frontend:

~~~bash
npm install
npm run dev
~~~

### Verification

Backend:

~~~powershell
.\mvnw.cmd clean test
~~~

Frontend:

~~~bash
npm run lint
npm run build
~~~

The complete setup and troubleshooting procedure is documented in [docs/setup.md](docs/setup.md).

## API Overview

| Method | Endpoint | Purpose | Authentication |
|---|---|---|---|
| POST | /api/auth/register | Register a user | Public |
| POST | /api/auth/login | Authenticate a user | Public |
| GET | /api/auth/username-availability | Check username availability | Public |
| GET | /api/health | Health check | Public |
| GET | /api/student/profile | Get student profile | JWT |
| POST | /api/student/profile | Create student profile | JWT |
| PUT | /api/student/profile | Update student profile | JWT |
| POST | /api/resumes/upload | Upload resume | JWT |
| GET | /api/resumes | List resumes | JWT |
| GET | /api/resumes/{id} | Get resume metadata | JWT |
| GET | /api/resumes/{id}/file | Download resume | JWT |
| DELETE | /api/resumes/{id} | Delete resume | JWT |
| POST | /api/ai/resume-analyze/{resumeId} | Analyze resume for target role | JWT |

See [docs/api.md](docs/api.md) for the complete contract.

## Documentation

Start with the [documentation hub](docs/index.md).

| Document | Purpose |
|---|---|
| [Architecture](docs/architecture.md) | System structure, boundaries, runtime flows, and design decisions |
| [Setup](docs/setup.md) | Development environment, configuration, startup, and troubleshooting |
| [API Reference](docs/api.md) | HTTP contract, validation, responses, errors, and ownership |
| [Database](docs/database.md) | Data model, constraints, lifecycle, and schema management |
| [Security](docs/security.md) | Threat model, trust boundaries, controls, and residual risks |
| [AI Analysis](docs/ai-analysis.md) | AI processing contract, validation, persistence, and security |
| [Testing](docs/testing.md) | Test strategy, coverage mapping, regression scenarios, and release gates |
| [Architecture Decisions](docs/decisions.md) | Durable architectural decisions and consequences |
| [Contributing](CONTRIBUTING.md) | Engineering and documentation contribution standards |

## Engineering Principles

- **Backend-enforced security** - authorization is enforced by the API rather than trusted to the client.
- **Separation of concerns** - presentation, business logic, persistence, security, document processing, and AI responsibilities are separated.
- **Secure document handling** - uploaded resumes are validated and stored using controlled server-side paths and generated filenames.
- **Role-aware intelligence** - resume analysis is evaluated in the context of a selected target role.
- **Structured AI output** - AI results are validated against an application-defined contract before persistence.
- **Provider abstraction** - AI integration is separated from application orchestration.
- **Evidence-based evaluation** - unsupported candidate skills and achievements are not supposed to receive AI credit.
- **Explicit limitations** - operational gaps are documented rather than presented as completed capabilities.

## Project Scope

SmartPlacement-AI covers:

- Student authentication
- Student profile management
- Resume upload and management
- Resume text extraction
- Role-aware AI resume analysis
- Persistent analysis by resume and target role
- Backend security and ownership enforcement
- Validation and controlled error handling
- React frontend integration
- Automated backend testing

The AI analysis feature is intentionally role-aware. It evaluates a resume for a selected target role and does not implement a separate job-description matching workflow.

## Author

**Author:** Sriman

**Organization:** VHUB-ITCS
