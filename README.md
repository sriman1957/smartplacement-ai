# SmartPlacement-AI

<p align="center">
  <strong>AI-Powered Resume Intelligence for Student Placements</strong>
</p>

<p align="center">
  Build a stronger placement profile, manage resumes securely, and receive role-specific AI feedback before applying for technical opportunities.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white" alt="Java 21">
  <img src="https://img.shields.io/badge/Spring%20Boot-4.1.1-6DB33F?logo=springboot&logoColor=white" alt="Spring Boot 4.1.1">
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

The platform is built with a clear separation between the web application, backend services, persistence, security, document processing, and AI analysis layers.

## Why SmartPlacement-AI

Traditional resume review is often generic. SmartPlacement-AI makes the analysis role-aware so that the same resume can be evaluated differently for different technical career paths.

For example, a student can evaluate the same resume for:

- Java Full Stack Developer
- Python Backend Developer
- Frontend Developer
- Other supported technical roles

The result is a structured analysis rather than an unstructured block of AI-generated text.

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

| Result | Description |
|---|---|
| Score | Overall resume score from 0 to 100 |
| Technical Skills | Relevant technical skills identified from the resume |
| Strengths | Strong areas supported by the resume |
| Weaknesses | Areas that reduce alignment with the target role |
| Missing Skills | Relevant skills not sufficiently represented |
| Recommendations | Actionable improvement suggestions |
| Summary | Concise role-specific assessment |

Analysis results are persisted against both the resume and target job role. The same resume can therefore be evaluated for multiple target roles with separate analysis records.

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

### Architectural Responsibilities

**Frontend**

- User interface
- Authentication screens
- Student dashboard
- Profile management
- Resume management
- Resume analysis interaction
- Analysis result presentation
- API communication

**Backend**

- Authentication and authorization
- Business logic
- Profile management
- Resume lifecycle management
- File validation
- Text extraction
- AI analysis orchestration
- Persistence
- Error handling

**Database**

- User data
- Student profiles
- Resume metadata
- AI analysis results

**AI Layer**

- Role-aware analysis
- Prompt construction
- Structured result processing
- Provider integration

## Application Workflow

### Resume Analysis Flow

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
Authentication
      |
      v
Student Profile
      |
      v
Resume Upload
      |
      +----> File Validation
      |
      +----> Text Extraction
      |
      +----> Secure File Storage
      |
      v
Target Role Selection
      |
      v
AI Resume Analysis
      |
      +----> Score
      +----> Technical Skills
      +----> Strengths
      +----> Weaknesses
      +----> Missing Skills
      +----> Recommendations
      +----> Summary
      |
      v
Persistent Analysis Result
```

## Security

Security is enforced at the backend boundary rather than relying on client-side controls.

### Authentication

- BCrypt password hashing
- Stateless JWT authentication
- JWT signature validation
- JWT expiration validation
- Bearer token validation

### Authorization

- Authenticated-user profile access
- Resume ownership verification
- Protected application endpoints
- Centralized access-denied handling

### File Security

- PDF and DOCX validation
- Apache Tika content detection
- 10 MB application-level size validation
- UUID-based file storage
- Filename sanitization
- Path traversal protection

### Application Security

- Centralized exception handling
- Restricted CORS configuration
- TRACE request denial
- No exposure of sensitive backend details through API errors

### AI Input Security

Uploaded resume content is treated as untrusted input during AI processing. The analysis workflow is designed to use resume content as evidence rather than treating instructions embedded inside the uploaded document as authoritative.

Sensitive values such as database credentials, JWT secrets, and AI provider credentials must be supplied through environment-specific configuration and must never be committed to source control.

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
├── README.md
└── README.snapshot.md
```

## Getting Started

### Prerequisites

Install the following:

- Java 21
- MySQL
- Node.js
- npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/sriman1957/smartplacement-ai.git
cd smartplacement-ai
```

### 2. Configure the Backend

Navigate to the backend:

```bash
cd backend
```

Configure the required environment-specific values for:

- MySQL connection
- JWT secret
- JWT expiration
- Resume storage
- Resume size limits
- AI provider credentials
- AI provider configuration

### 3. Run the Application

```powershell
.\mvnw.cmd spring-boot:run
```

### 4. Start the Frontend

Open a new terminal and navigate to:

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

| Configuration Area | Purpose |
|---|---|
| MySQL | Database connection |
| JWT secret | Token signing |
| JWT expiration | Authentication lifetime |
| Resume upload directory | File storage location |
| Resume size limit | Upload validation |
| Multipart limits | Request-level upload limits |
| AI provider credentials | AI service authentication |
| AI provider configuration | AI analysis behavior |

Keep secrets outside version control. Use environment-specific configuration for credentials and private values.

## API Overview

| Method | Endpoint | Purpose | Authentication |
|---|---|---|---|
| POST | `/api/auth/register` | Register a user | Public |
| POST | `/api/auth/login` | Authenticate a user | Public |
| GET | `/api/auth/username-availability` | Check username availability | Public |
| GET | `/api/health` | Health check | Public |
| GET | `/api/student/profile` | Get student profile | JWT |
| POST | `/api/student/profile` | Create student profile | JWT |
| PUT | `/api/student/profile` | Update student profile | JWT |
| POST | `/api/resumes/upload` | Upload resume | JWT |
| GET | `/api/resumes` | List resumes | JWT |
| GET | `/api/resumes/{id}` | Get resume metadata | JWT |
| GET | `/api/resumes/{id}/file` | Download resume | JWT |
| DELETE | `/api/resumes/{id}` | Delete resume | JWT |
| POST | `/api/ai/resume-analyze/{resumeId}` | Analyze resume for a target role | JWT |

The AI analysis endpoint accepts the target role through the `jobTitle` query parameter.

All protected endpoints require a valid JWT bearer token.

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

The test suite covers core application behavior including:

- Authentication
- Profile management
- Resume processing
- File validation
- AI analysis
- Security behavior

## Documentation

Detailed technical documentation is organized under `docs/`:

| Document | Description |
|---|---|
| `architecture.md` | System architecture and module responsibilities |
| `setup.md` | Development environment and configuration |
| `api.md` | REST API reference |
| `database.md` | Database schema and relationships |
| `security.md` | Security architecture and controls |
| `ai-analysis.md` | AI resume analysis workflow |
| `testing.md` | Testing strategy and verification |

## Engineering Principles

SmartPlacement-AI is built around the following engineering principles:

- **Backend-enforced security** - authorization is enforced by the API rather than trusted to the client.
- **Separation of concerns** - presentation, business logic, persistence, security, document processing, and AI responsibilities are separated.
- **Secure document handling** - uploaded resumes are validated and stored using controlled server-side paths and generated filenames.
- **Role-aware intelligence** - resume analysis is evaluated in the context of a selected target role.
- **Structured AI output** - analysis results are represented as defined application data rather than unstructured text.
- **Provider abstraction** - AI integration is separated from the surrounding application workflow.
- **Validated input** - request data and uploaded files are validated before business processing.
- **Persistent analysis** - AI analysis results are stored and associated with the resume and target role.

## Project Scope

SmartPlacement-AI covers the placement workflow for:

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
