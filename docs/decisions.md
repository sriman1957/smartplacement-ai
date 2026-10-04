# Architecture Decisions

> **Document type:** Architecture decision record index  
> **Audience:** Developers, maintainers, reviewers  
> **Status:** Maintained  
> **Source of truth:** Current repository implementation and documented engineering rationale

Architecture decisions record choices that materially affect the structure, security, persistence, or extensibility of SmartPlacement-AI.

## Decision Status

- **Accepted:** Current implementation follows the decision.
- **Operational consideration:** The decision exists in the implementation, but deployment implications remain.
- **Superseded:** Replaced by a later decision.

---

## ADR-001: Stateless JWT Authentication

**Status:** Accepted

### Context

The frontend communicates with the backend through a REST API. Authentication must work without requiring server-side HTTP session state.

### Decision

Use signed JWTs with Spring Security configured for stateless sessions.

### Consequences

**Positive**

- Requests carry their authentication context.
- Backend HTTP sessions are not required.
- Frontend and backend remain independently deployable.

**Trade-offs**

- Token lifetime and secret protection become critical.
- Client-side token storage requires careful security consideration.
- Token revocation is not represented by server-side session invalidation.

---

## ADR-002: Backend as the Authorization Boundary

**Status:** Accepted

### Context

The browser is controlled by the client and cannot be trusted to enforce access rules.

### Decision

Authentication, authorization, resource ownership, and security-sensitive validation are enforced by the backend.

### Consequences

- Frontend validation is treated as a usability feature.
- Protected resume operations use the authenticated user together with the resource identifier.
- API clients cannot bypass ownership rules by changing frontend state.

---

## ADR-003: Filesystem Storage for Resume Binaries

**Status:** Operational consideration

### Context

Resume documents are binary files while relational tables primarily store application metadata.

### Decision

Store resume binaries in the configured filesystem directory and store resume metadata and controlled storage paths in MySQL.

### Consequences

**Positive**

- Database rows remain focused on metadata.
- Binary content is separated from relational application state.

**Trade-offs**

- Database backup alone does not restore resume files.
- Filesystem permissions and backup coordination are required.
- File and database lifecycle operations must remain consistent.

---

## ADR-004: Role-Aware Resume Analysis

**Status:** Accepted

### Context

A resume may be suitable for one technical role and less suitable for another.

### Decision

Require a target job title for analysis and apply role-specific evaluation criteria where supported.

### Consequences

- The same resume can have multiple role-specific analyses.
- resume_id plus job_title defines analysis identity.
- Role criteria remain in the prompt-building layer rather than the persistence model.

---

## ADR-005: AI Provider Abstraction

**Status:** Accepted

### Context

Application workflows should not be coupled directly to one provider-specific implementation.

### Decision

Expose AI interaction through the AIProvider abstraction.

### Consequences

- Provider-specific integration remains isolated.
- Analysis orchestration can remain provider-neutral.
- Provider replacement can be performed without redesigning controllers or persistence.

---

## ADR-006: Evidence-Based Structured AI Output

**Status:** Accepted

### Context

Free-form AI output is difficult to validate and can introduce unsupported claims.

### Decision

Require structured JSON containing score, technical skills, strengths, weaknesses, missing skills, recommendations, and summary. The backend validates the result before persistence.

### Consequences

- The frontend receives predictable application data.
- Unsupported or incomplete AI output is rejected.
- AI output remains untrusted until validated.

---

## ADR-007: No Repository-Managed SQL Migration History

**Status:** Operational consideration

### Context

The current repository does not contain a committed SQL migration directory.

### Decision

The current implementation relies on the active JPA/Hibernate schema behavior.

### Consequences

This is sufficient for the current repository workflow but is not equivalent to a release-managed migration history. A production schema lifecycle should introduce explicit migration tooling before schema changes become independently deployable release artifacts.

---

## ADR-008: Explicit Residual-Risk Documentation

**Status:** Accepted

### Context

Documentation that claims capabilities not present in the repository creates operational and security risk.

### Decision

Document implemented controls separately from recommended production hardening and residual risks.

### Consequences

Readers can distinguish current guarantees from deployment requirements without interpreting recommendations as completed features.
