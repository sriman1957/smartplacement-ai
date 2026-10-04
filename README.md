# SmartPlacement-AI

SmartPlacement-AI is an AI-powered student placement platform designed to help students prepare for technical placement opportunities through secure profile management, resume management, and role-aware resume analysis.

## Overview

SmartPlacement-AI provides a complete student-focused placement workflow:

1. Create an account and authenticate securely.
2. Maintain a professional student profile.
3. Upload and manage a resume.
4. Select a target job role.
5. Analyze the resume using the integrated AI system.
6. Review structured feedback and identify areas for improvement.

The platform combines a React frontend with a Spring Boot REST API, MySQL persistence, secure JWT authentication, document processing, and AI-powered resume analysis.

## Features

### Authentication

- User registration and login
- Unique username and email validation
- BCrypt password hashing
- JWT-based authentication
- Stateless Spring Security
- JWT signature and expiration validation
- Protected REST endpoints
- Username availability checking
- Centralized authentication and authorization error handling

### Student Profile

Students can maintain placement-oriented information including:

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

Profile data is associated with the authenticated user and protected by backend authorization.

### Resume Management

The resume module supports:

- PDF uploads
- DOCX uploads
- Resume metadata storage
- Local file storage
- Resume listing
- Resume metadata retrieval
- Resume download
- Resume deletion
- Resume replacement
- Ownership enforcement
- File extension validation
- Apache Tika content detection
- File-size validation
- Safe filename handling
- UUID-based stored filenames
- Path traversal protection
- Related analysis cleanup

The application enforces a 10 MB application-level resume size limit.

### AI Resume Analysis

Students can analyze a resume for a selected target role.

The AI analysis provides:

- Resume score from 0 to 100
- Technical skills
- Strengths
- Weaknesses
- Missing skills
- Recommendations
- Summary

Analysis results are persisted against both the resume and target job role. This allows one resume to be evaluated for multiple roles while maintaining separate analysis results.

The analysis is role-aware. It evaluates the resume in the context of a selected role rather than performing job-description matching.

### Resume Text Extraction

PDF and DOCX resumes are processed with Apache Tika.

The backend validates the uploaded document, detects its content type, extracts the text, normalizes the extracted content, and sends the relevant resume information into the AI analysis workflow.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 |
| Frontend Build Tool | Vite 8 |
| Frontend HTTP Client | Axios |
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

```
                    +----------------------+
                    |    React Frontend    |
                    +----------+-----------+
                               |
                         Axios / JWT
                               |
                               v
                    +----------------------+
                    |   Spring Boot API    |
                    +----------+-----------+
                               |
              +----------------+----------------+
              |                |                |
              v                v                v
       Authentication     Application       AI Analysis
       & Authorization      Services           Layer
              |                |                |
              |                v                v
              |          Repositories      AI Provider
              |                |
              +----------------+----------------+
                               |
                               v
                         +-----------+
                         |   MySQL   |
                         +-----------+
```

### Resume Analysis Flow

```
Student
  |
  v
Resume + Target Role
  |
  v
Ownership Validation
  |
  v
File Validation
  |
  v
Text Extraction
  |
  v
Role-Aware AI Analysis
  |
  v
Structured Result
  |
  v
Database Persistence
  |
  v
API Response
```

## Repository Structure

```
SmartPlacement-AI/
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

## Backend Structure

The backend is organized around the following responsibilities:

- REST controllers
- Application services
- Repository layer
- JPA entities
- Request and response DTOs
- Authentication and authorization
- JWT processing
- AI analysis
- Resume validation
- Resume text extraction
- File storage
- Global exception handling
- Application configuration

The authenticated user's identity is obtained from Spring Security. Profile and resume ownership are enforced on the server.

## Frontend Structure

The React frontend provides the user-facing application experience.

Major responsibilities include:

- Authentication
- Student dashboard
- Profile management
- Resume management
- Resume analysis
- Analysis result presentation
- API communication
- Client-side application state

Axios is used for communication with the Spring Boot REST API.

## API

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

All protected endpoints require a valid JWT bearer token.

Detailed API documentation will be maintained in `docs/api.md`.

## Database

The primary domain entities are:

- User
- StudentProfile
- Resume
- ResumeAnalysis

Relationships:

```
User
├── StudentProfile       1 : 1
└── Resume               1 : N
      └── ResumeAnalysis 1 : N
```

Resume analyses are associated with both a resume and a target job title. This supports role-specific analysis for the same resume.

Detailed database documentation will be maintained in `docs/database.md`.

## Security

Security is enforced at the backend boundary.

The application includes:

- BCrypt password hashing
- Stateless JWT authentication
- JWT signature validation
- JWT expiration validation
- Bearer token validation
- Authentication and authorization controls
- Resume ownership verification
- Profile ownership verification
- PDF and DOCX validation
- Apache Tika content detection
- 10 MB resume size validation
- UUID-based file storage
- Filename sanitization
- Path traversal protection
- Centralized exception handling
- Restricted CORS configuration
- TRACE request denial

Sensitive values such as database credentials, JWT secrets, and AI provider credentials must be supplied through environment-specific configuration and must never be committed to source control.

## Configuration

The application uses the local Spring profile for development.

Environment-specific configuration provides:

- MySQL connection details
- JWT secret
- JWT expiration
- Resume upload directory
- Resume size limits
- Multipart limits
- AI provider credentials
- AI provider configuration

Do not commit secrets or private credentials to the repository.

## Getting Started

### Prerequisites

Install:

- Java 21
- Maven Wrapper included with the backend
- MySQL
- Node.js
- npm
- Git

### Backend

Navigate to the backend directory:

```bash
cd backend
```

## Run the Application

```powershell
.\mvnw.cmd spring-boot:run
```

Configure the required MySQL, JWT, file-storage, and AI provider settings before starting the backend.

### Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the frontend:

```bash
npm run build
```

## Testing

Run the backend test suite from the `backend/` directory:

```powershell
.\\mvnw.cmd clean test
```

Run the frontend production build:

```bash
cd frontend
npm run build
```

The test suite covers core application behavior including authentication, profile management, resume processing, validation, AI analysis, and security.

## Documentation

Detailed technical documentation is organized under `docs/`:

- `docs/architecture.md` - system architecture and module responsibilities
- `docs/setup.md` - development environment and configuration
- `docs/api.md` - REST API reference
- `docs/database.md` - database schema and relationships
- `docs/security.md` - security architecture and controls
- `docs/ai-analysis.md` - AI resume analysis workflow
- `docs/testing.md` - testing strategy and verification

## End-to-End Application Flow

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
   +--> Authentication
   |
   +--> Student Profile
   |
   +--> Resume Management
   |       |
   |       +--> File Validation
   |       +--> Text Extraction
   |       +--> File Storage
   |
   +--> AI Resume Analysis
           |
           +--> Role-Aware Processing
           +--> AI Provider
           +--> Structured Analysis
           +--> Persistence
   |
   v
MySQL
```

## Project Purpose

SmartPlacement-AI brings authentication, student profile management, resume handling, and AI-assisted resume evaluation into a single placement-focused platform.

The goal is to provide students with actionable, role-specific feedback on their resumes while maintaining secure backend processing and a clean separation between the frontend, business logic, persistence, and AI layers.

## Repository

GitHub: https://github.com/sriman1957/smartplacement-ai
