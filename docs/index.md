# SmartPlacement-AI Documentation

> **Documentation hub**  
> **Status:** Maintained  
> **Source of truth:** Current repository implementation

SmartPlacement-AI documentation is organized by engineering concern. Each document describes implemented behavior and explicitly identifies operational limitations where applicable.

## Documentation Map

| Document | Purpose | Primary audience |
|---|---|---|
| [Architecture](architecture.md) | System structure, boundaries, runtime flows, and architectural decisions | Developers, reviewers |
| [Setup](setup.md) | Local development, configuration, startup, and troubleshooting | Developers |
| [API Reference](api.md) | HTTP endpoints, request constraints, responses, errors, and ownership semantics | Frontend developers, API consumers |
| [Database](database.md) | Entities, relationships, constraints, lifecycle, and schema management | Backend developers |
| [Security](security.md) | Threat model, trust boundaries, security controls, residual risks, and hardening | Developers, reviewers |
| [AI Analysis](ai-analysis.md) | Role-aware analysis pipeline, prompt contract, validation, persistence, and security | AI/backend developers |
| [Testing](testing.md) | Test structure, requirement coverage, regression scenarios, and release gates | Developers, reviewers |
| [Architecture Decisions](decisions.md) | Durable decisions, rationale, and consequences | Developers, maintainers |
| [Contributing](../CONTRIBUTING.md) | Repository workflow and documentation/code contribution expectations | Contributors |

## Recommended Reading Order

### New developer

1. [Setup](setup.md)
2. [Architecture](architecture.md)
3. [API Reference](api.md)
4. [Database](database.md)
5. [AI Analysis](ai-analysis.md)
6. [Security](security.md)
7. [Testing](testing.md)
8. [Architecture Decisions](decisions.md)

### API consumer

1. [API Reference](api.md)
2. [Security](security.md)

### Reviewer

1. [Architecture](architecture.md)
2. [Security](security.md)
3. [Database](database.md)
4. [Testing](testing.md)
5. [AI Analysis](ai-analysis.md)

## Documentation Rules

These documents follow four rules:

1. **Implementation first.** Documentation must describe behavior supported by the repository.
2. **No invented capabilities.** Missing infrastructure is documented as missing rather than implied to exist.
3. **Contracts are explicit.** API, persistence, security, and AI behavior are documented as contracts where appropriate.
4. **Limitations are visible.** Residual risks and operational gaps are called out instead of hidden behind general recommendations.

If documentation and implementation diverge, verify the implementation and update the documentation rather than relying on an outdated description.
