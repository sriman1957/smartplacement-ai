# Database Design

> **Document type:** Persistence reference  
> **Audience:** Backend developers, database reviewers, and maintainers  
> **Status:** Maintained  
> **Source of truth:** Current JPA entities, repositories, constraints, and service behavior  
> **Scope:** Entities, relationships, constraints, ownership, lifecycle, and schema management

## Contents

- Persistence model
- Entity relationships
- Data dictionary
- Constraints
- Ownership
- Lifecycle
- Analysis identity
- Schema management
- Operational considerations

---

## 1. Persistence Model

The application uses MySQL with Spring Data JPA, Hibernate, and Jakarta Persistence.

The database stores application state and resume metadata. Resume binary content is stored in the configured filesystem directory rather than as database blobs.

~~~text
users
  |
  +-- 1 : 1 --> student_profiles
  |
  +-- 1 : N --> resumes
                 |
                 +-- 1 : N --> resume_analyses
~~~

## 2. users

| Field | Purpose | Constraint / behavior |
|---|---|---|
| id | Primary key | Generated identifier |
| firstName | First name | Required, max 50 |
| lastName | Last name | Required, max 50 |
| username | Application username | Required, unique |
| name | Full-name compatibility field | Derived compatibility value |
| email | Login email | Required, unique |
| password | Password hash | BCrypt encoded |
| role | Application role | New registration uses STUDENT |
| createdAt | Creation timestamp | Set on entity creation |

## 3. student_profiles

| Field | Purpose | Constraint / behavior |
|---|---|---|
| id | Primary key | Generated identifier |
| user_id | User reference | Required, unique |
| phone | Contact number | Required, exactly 10 digits |
| college | College name | Required, max 200 |
| degree | Degree | Required, max 100 |
| branch | Branch | Required, max 100 |
| graduationYear | Graduation year | Required, 2000-2100 |
| skills | Candidate skills | Required, max 2000 |
| githubUrl | GitHub profile | Optional HTTPS URL |
| linkedinUrl | LinkedIn profile | Optional HTTPS URL |
| portfolioUrl | Portfolio | Optional HTTPS URL |
| profilePhotoUrl | Profile image URL | Optional HTTPS URL |
| careerObjective | Career objective | Optional, max 2000 |

The unique user relationship enforces one profile per user.

## 4. resumes

| Field | Purpose | Constraint / behavior |
|---|---|---|
| id | Primary key | Generated identifier |
| user_id | Resume owner | Required |
| originalFileName | User-visible filename | Sanitized before persistence |
| storedFileName | Filesystem filename | UUID-based |
| fileType | Detected content type | Detected from uploaded content |
| fileSize | File size | Controlled by upload limits |
| filePath | Controlled storage path | Must remain under configured storage root |
| uploadedAt | Upload timestamp | Set when stored |

Resume binary content remains in filesystem storage. The database stores metadata and the controlled storage path.

## 5. resume_analyses

| Field | Purpose | Constraint / behavior |
|---|---|---|
| id | Primary key | Generated identifier |
| resume_id | Parent resume | Required |
| job_title | Target role | Required, max 100 |
| score | AI evaluation score | Integer, 0-100 |
| technicalSkills | Detected skills | Required |
| strengths | Evidence-based strengths | Required |
| weaknesses | Role-relevant weaknesses | Required |
| missingSkills | Missing role skills | Required |
| recommendations | Improvement guidance | Required |
| summary | Overall assessment | Required |
| createdAt | Analysis timestamp | Persisted with analysis |

The unique constraint uk_resume_analysis_resume_job covers resume_id and job_title.

The domain rule is:

~~~text
Resume + Target Role = Analysis Identity
~~~

The same resume plus the same role updates the existing analysis. The same resume plus a different role creates another analysis.

## 6. Ownership

ResumeRepository provides ownership-aware lookup using the authenticated user.

~~~text
resume ID + authenticated user
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

This prevents resource access based only on a numeric resume identifier.

## 7. Lifecycle

### Resume creation

1. Validate uploaded file.
2. Generate a UUID-based storage filename.
3. Store the physical file.
4. Persist metadata.
5. Remove any previous resume for the same user.

### Resume replacement

The application removes the previous resume's analyses, physical file, and database record after the new resume is saved.

### Resume deletion

The application removes associated analyses first, then the physical file, then the resume database record.

The filesystem and database therefore participate in one logical resource lifecycle even though they are different storage systems.

## 8. Schema Management

No committed SQL migration directory exists in the repository.

Current schema behavior is therefore tied to the active JPA/Hibernate configuration rather than a repository-managed migration history.

**Operational implication:** Before production schema changes are managed as releases, an explicit migration strategy should be introduced and treated as part of deployment governance.

## 9. Operational Considerations

- Database credentials must remain outside source control.
- Resume storage requires filesystem permissions and backup consideration.
- Database backup alone does not contain resume binaries.
- Resume binary retention and database metadata retention should remain consistent.
- Unique constraints and ownership rules are part of the application contract and must be preserved during schema changes.

## 10. Related Documentation

- architecture.md - persistence and component boundaries
- api.md - resource-level API behavior
- security.md - ownership and data protection
- setup.md - local database configuration
