# SmartPlacement-AI Setup Guide

## 1. Prerequisites
- Java 21
- MySQL
- Node.js
- npm
- Git

## 2. Repository Layout
~~~text
SmartPlacement-AI/
|-- backend/
|   |-- pom.xml
|   |-- mvnw
|   |-- mvnw.cmd
|   `-- src/
|-- frontend/
|   |-- package.json
|   |-- package-lock.json
|   `-- src/
|-- docs/
`-- README.md
~~~

## 3. Backend Configuration
The committed application.properties activates the local Spring profile. The repository does not contain a committed application-local.properties file, so local datasource, JWT, file-storage, multipart, and AI configuration must be supplied by the local runtime configuration.

Required configuration areas include:
- MySQL datasource
- JPA/Hibernate behavior
- jwt.secret
- jwt.expiration
- app.file.upload-dir
- app.file.max-size
- Multipart request limits
- AI provider configuration

Secrets must remain outside source control.

## 4. Database
The backend uses MySQL with Spring Data JPA and Hibernate. The repository does not contain a committed SQL migration directory. Database schema creation and update behavior therefore depends on the active Spring/JPA configuration.

## 5. Resume Storage
FileStorageConfig creates the configured resume directory during application startup. The directory is normalized to an absolute path. ResumeService generates UUID-based stored filenames.

## 6. Start Backend
From the backend directory:

~~~powershell
.\mvnw.cmd spring-boot:run
~~~

## 7. Start Frontend
From the frontend directory:

~~~bash
npm install
npm run dev
~~~

## 8. Frontend Validation
~~~bash
npm run lint
npm run build
npm run preview
~~~

## 9. Runtime API
The current Axios client uses http://localhost:8080/api as its base URL. The backend therefore needs to be reachable on port 8080 for the current frontend configuration.

## 10. Security Configuration
The backend currently permits the local frontend origin http://localhost:5173. Production deployment requires an explicit production origin configuration.