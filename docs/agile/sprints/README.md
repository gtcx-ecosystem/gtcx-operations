# Sprint Docs

Sprint documentation for GTCX Operations follows the standard GTCX sprint format.

## File Structure

```
docs/agile/sprints/
├── current.md      # Active sprint (always points to current)
├── sprint-46.md    # Sprint 46: Setup & Infrastructure
└── archive/        # Past sprints
```

## Sprint Format

Each sprint doc has YAML frontmatter:

```yaml
sprint: 46
period: "2026-05-12 to 2026-05-25"
objective: "Set up gtcx-operations repo and initial templates"
commitments:
  - id: "ops-46.1"
    name: "Create legal contract templates (NDA, MSA, Employment)"
    status: "in-progress"
    priority: "p1-critical"
  - id: "ops-46.2"
    name: "Set up budget YAML schema for Q2-Q4"
    status: "on-track"
    priority: "p1-critical"
```

## Status Values

- `not-started` — Committed but not begun
- `in-progress` — Actively being worked
- `on-track` — In progress, no blockers
- `at-risk` — Blocked or may miss deadline
- `completed` — Done and verified
