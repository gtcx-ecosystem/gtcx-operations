---
title: "Sprint Docs"
status: "current"
date: "2026-05-27"
owner: "gtcx-operations"
role: "protocol-architect"
agent_id: "agent://gtcx-operations/2026-05-27/session-backfill"
trust_score: 95
autonomy_level: "sovereign"
tier: "critical"
tags: ["documentation", "specs"]
review_cycle: "on-change"
---

# Sprint Docs

Sprint documentation for GTCX Operations follows the standard GTCX sprint format.

## File Structure

```
01-docs/specs/_project/planning/sprints/
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
```

## Status Values

- `not-started` — Committed but not begun
- `in-progress` — Actively being worked
- `on-track` — In progress, no blockers
- `at-risk` — Blocked or may miss deadline
- `completed` — Done and verified
