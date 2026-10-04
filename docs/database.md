# SmartPlacement-AI Database Design

## 1. Persistence Stack
- MySQL
- Spring Data JPA
- Hibernate
- Jakarta Persistence

## 2. Entity Model
~~~text
users
  |
  +-- 1 : 1 --> student_profiles
  |
  `-- 1 : N --> resumes
                 |
                 `-- 1 : N --> resume_analyses
~~~

## 3. users
The User entity maps to users.

| Field | Purpose |
|---|---|
| id | Primary key |
| firstName | Required first name |
| lastName | Required last name |
| username | Required and unique |
| name | Full-name compatibility field |
| email | Required and unique |
| password | BCrypt password hash |
| role | Application role |
| createdAt | Creation timestamp |

New registrations are created with the STUDENT role.

## 4. student_profiles
The StudentProfile entity maps to student_profiles.

| Field | Purpose |
|---|---|
| id | Primary key |
| user_id | Required unique user reference |
| phone | Required 10-digit phone value |
| college | Required college |
| degree | Required degree |
| branch | Required branch |
| graduationYear | Required graduation year |
| skills | Required skills, maximum 2000 characters |
| githubUrl | Optional HTTPS GitHub URL |
| linkedinUrl | Optional HTTPS LinkedIn URL |
| portfolioUrl | Optional HTTPS URL |
| profilePhotoUrl | Optional HTTPS URL |
| careerObjective | Optional, maximum 2000 characters |

The unique user_id relationship enforces one profile per user.

## 5. resumes
The Resume entity maps to resumes.

| Field | Purpose |
|---|---|
| id | Primary key |
| user_id | Resume owner |
| originalFileName | Sanitized original filename |
| storedFileName | Unique generated storage filename |
| fileType | Detected content type |
| fileSize | Uploaded file size |
| filePath | Physical storage path |
| uploadedAt | Upload timestamp |

Resume binary data is stored on the filesystem. Database rows store metadata and the controlled storage path.

## 6. resume_analyses
The ResumeAnalysis entity maps to resume_analyses.

| Field | Purpose |
|---|---|
| id | Primary key |
| resume_id | Required resume reference |
| job_title | Required target role, maximum 100 characters |
| score | Required score from 0 to 100 |
| technicalSkills | Required analysis output |
| strengths | Required analysis output |
| weaknesses | Required analysis output |
| missingSkills | Required analysis output |
| recommendations | Required analysis output |
| summary | Required analysis output |
| createdAt | Creation timestamp |

The entity declares the unique constraint uk_resume_analysis_resume_job over resume_id and job_title.

Therefore:
- Same resume plus same role updates the existing analysis.
- Same resume plus different role creates another analysis.

## 7. Ownership
ResumeRepository provides findByIdAndUser so a resume lookup is constrained by both resource ID and authenticated owner.

## 8. Cleanup
Deleting or replacing a resume removes its analysis records and physical file before deleting the resume database record.

## 9. Schema Management
No committed SQL migration directory exists in the repository. Schema management should therefore be treated as an explicit deployment concern rather than assumed from repository migration files.