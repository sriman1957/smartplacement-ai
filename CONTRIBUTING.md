# Contributing to SmartPlacement-AI

> **Audience:** Developers and maintainers  
> **Status:** Maintained

## 1. Before Making Changes

Read the documentation relevant to the change:

- docs/index.md
- docs/architecture.md
- docs/api.md
- docs/database.md
- docs/security.md
- docs/ai-analysis.md
- docs/testing.md

For architectural changes, also review docs/decisions.md.

## 2. Engineering Expectations

Changes should:

- Preserve backend authorization as the authoritative security boundary.
- Keep controllers focused on HTTP concerns.
- Keep business workflows in services.
- Keep persistence access in repositories.
- Treat uploaded documents as untrusted input.
- Treat AI output as untrusted external data until validated.
- Avoid exposing internal exceptions or infrastructure details through API responses.
- Preserve resource ownership rules.
- Include tests for changed business behavior.
- Update documentation when a public contract or architectural behavior changes.

## 3. API Changes

When changing an endpoint, review all of the following together:

1. Controller behavior.
2. Request DTO validation.
3. Response DTO.
4. Exception handling.
5. Security configuration.
6. Ownership behavior.
7. docs/api.md.
8. Related frontend service code.

An API change is incomplete when the implementation changes but the API contract remains stale.

## 4. Database Changes

When changing entities or repositories:

1. Review relationship and ownership semantics.
2. Review unique constraints.
3. Review lifecycle and deletion behavior.
4. Review docs/database.md.
5. Review docs/decisions.md if the change is architectural.

Do not assume that a database change is isolated from filesystem or AI lifecycle behavior.

## 5. AI Changes

When changing resume analysis:

1. Preserve the evidence-only evaluation model.
2. Preserve the structured output contract unless the API contract is intentionally changed.
3. Validate provider output before persistence.
4. Preserve prompt-injection defenses.
5. Update docs/ai-analysis.md.
6. Update tests for changed role criteria or validation behavior.

## 6. Verification

Backend:

~~~powershell
.\mvnw.cmd clean test
~~~

Frontend:

~~~bash
npm run lint
npm run build
~~~

Run the relevant regression scenarios documented in docs/testing.md.

## 7. Documentation Standard

Documentation must distinguish:

- Implemented behavior.
- Design decisions.
- Operational considerations.
- Residual risks.
- Recommended future hardening.

Do not document planned infrastructure as though it already exists.

## 8. Commit Scope

Keep commits focused. A change should be understandable from its implementation and documentation together.

Examples of useful scopes:

- authentication
- resume lifecycle
- API contract
- AI analysis
- security
- database
- documentation
- frontend integration
