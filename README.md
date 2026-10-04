# SmartPlacement-AI

<p align="center">
  <strong>AI-Powered Resume Intelligence for Student Placements</strong>
</p>

<p align="center">
  SmartPlacement-AI helps students build stronger placement profiles, manage resumes securely, and receive role-specific AI feedback before applying for technical opportunities.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white" alt="Java 21">
  <img src="https://img.shields.io/badge/Spring%20Boot-4.1.1-6DB33F?logo=springboot&logoColor=white" alt="Spring Boot 4.1.1">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19">
  <img src="https://img.shields.io/badge/MySQL-8+-4479A1?logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/AI-Powered-7C3AED" alt="AI Powered">
</p>

## Table of Contents

- [Overview](#overview)
- [Key Capabilities](#key-capabilities)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Application Workflow](#application-workflow)
- [Repository Structure](#repository-structure)
- [Security](#security)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Overview](#api-overview)
- [Testing](#testing)
- [Documentation](#documentation)
- [Project Scope](#project-scope)
- [Author](#author)

## Overview

SmartPlacement-AI is a full-stack student placement platform built around a simple goal: give students a secure place to manage their professional information and provide actionable, role-specific feedback on their resumes.

The platform combines:

- React for the web application
- Spring Boot for the backend API
- MySQL for persistent data
- Spring Security and JWT for authentication
- Apache Tika for document processing
- An integrated AI provider for resume analysis

The system separates presentation, business logic, persistence, security, document processing, and AI responsibilities so each layer can evolve independently.

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
- Resume metadata persistence
- Local file storage
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

The application enforces a 10 MB application-level resume size limit.

### AI-Powered Resume Analysis

Students can analyze a resume for a selected target role.

The analysis provides:

- Resume score from 0 to 100
- Technical skills
- Strengths
- Weaknesses
- Missing skills
- Recommendations
- Summary

Analysis results are persisted against both the resume and target job role. The same resume can therefore be evaluated for multiple target roles with separate analysis records.

The analysis is role-aware. It evaluates the resume in the context of the selected role rather than performing job-description matching.

### Resume Text Extraction

PDF and DOCX resumes are processed with Apache Tika.

The backend:

1. Validates the uploaded document.
2. Detects the actual document content type.
3. Extracts readable resume text.
4. Normalizes the extracted content.
5. Sends the relevant resume information into the AI analysis workflow.

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
              +---------------------+---------------------+
              |                     |                     |
              v                     v                     v
       Authentication        Application Services    AI Analysis
       & Authorization               |                  Layer
              |                      |                     |
              |                      v                     v
              |                Repositories          AI Provider
              |                      |
              +----------------------+---------------------+
                                    |
                                    v
                              +-----------+
                              |   MySQL   |
                              +-----------+
```

### Backend Responsibilities

The backend is responsible for:

- Authentication
- Authorization
- User management
- Student profiles
- Resume lifecycle management
- File validation
- Resume text extraction
- AI analysis orchestration
- Analysis persistence
- Exception handling
- API security

### Frontend Responsibilities

The React application is responsible for:

- Authentication screens
- Student dashboard
- Profile management
- Resume management
- Resume analysis interaction
- Analysis result presentation
- API communication
- Client-side application state

Authorization, validation, file processing, AI processing, and persistence remain backend responsibilities.

## Application Workflow

### Resume Analysis Workflow

```
Student
   |
   v
React Frontend
   |
   | JWT-authenticated request
   v
Spring Boot API
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
   |
   v
React Analysis View
```

### End-to-End Platform Flow

```
Student
   |
   v
Authentication
   |
   v
Student Profile
   |
   v
Resume Upload
   |
   +--> File Validation
   +--> Text Extraction
   +--> Secure File Storage
   |
   v
Select Target Role
   |
   v
AI Resume Analysis
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
Persistent Analysis Result
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

## Database Model

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

The database layer uses Spring Data JPA and Hibernate for persistence.

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

Uploaded resume content is treated as untrusted input during AI processing. The AI analysis workflow is designed to use resume content as evidence rather than treating instructions embedded inside the uploaded document as authoritative.

Sensitive values such as database credentials, JWT secrets, and AI provider credentials must be supplied through environment-specific configuration and must never be committed to source control.

## Getting Started

### Prerequisites

Install the following:

- Java 21
- MySQL
- Node.js
- npm
- Git

### Backend

Navigate to the backend directory:

```bash
cd backend
```

### Run the Application

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

## Configuration

The application uses the local Spring profile for development.

Environment-specific configuration provides values such as:

- MySQL connection details
- JWT secret
- JWT expiration
- Resume upload directory
- Resume size limits
- Multipart limits
- AI provider credentials
- AI provider configuration

Keep secrets outside version control. Use environment-specific configuration for credentials and private values.

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

All protected endpoints require a valid JWT bearer token.

Detailed API documentation is maintained in `docs/api.md`.

## Testing

Run the backend test suite from the `backend/` directory:

```powershell
.\mvnw.cmd clean test
```

Run the frontend production build:

```bash
cd frontend
npm run build
```

The test suite covers core application behavior including authentication, profile management, resume processing, validation, AI analysis, and security.

## Documentation

Detailed technical documentation is organized under `docs/`:

| Document | Description |
|---|---|
| [Architecture](docs/architecture.md) | System architecture and module responsibilities |
| [Setup](docs/setup.md) | Development environment and configuration |
| [API](docs/api.md) | REST API reference |
| [Database](docs/database.md) | Database schema and relationships |
| [Security](docs/security.md) | Security architecture and controls |
| [AI Analysis](docs/ai-analysis.md) | AI resume analysis workflow |
| [Testing](docs/testing.md) | Testing strategy and verification |

## Project Scope

SmartPlacement-AI covers the complete placement workflow for:

- Student authentication
- Student profile management
- Resume upload and management
- Resume text extraction
- Role-aware AI resume analysis
- Persistent analysis history by resume and target role
- Secure backend processing
- Validation and error handling
- React frontend integration
- Automated backend testing

The AI analysis feature is intentionally role-aware. It evaluates a resume for a selected target role and does not require a separate job-description matching workflow.

## Author

**Author:** Sriman

**Organization:** VHUB-ITCS
