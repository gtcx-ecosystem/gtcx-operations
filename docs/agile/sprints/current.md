---
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
  - id: "ops-46.3"
    name: "Create HR policy templates (Remote Work, PTO, Code of Conduct)"
    status: "not-started"
    priority: "p2-high"
  - id: "ops-46.4"
    name: "Set up IP asset registry structure"
    status: "not-started"
    priority: "p2-high"
  - id: "ops-46.5"
    name: "Create fundraising pipeline template"
    status: "not-started"
    priority: "p3-medium"
  - id: "ops-46.6"
    name: "Write operational runbook template"
    status: "not-started"
    priority: "p3-medium"
velocity: 0
---

# Sprint 46: Operations Setup

## Objective

Establish gtcx-operations as the corporate functions source of truth. Create templates and schemas for legal, finance, HR, IP, fundraising, and operations.

## Key Decisions

- All contracts as YAML + markdown with structured frontmatter
- Budgets as quarterly YAML with variance tracking
- IP registry as JSON with filing deadline alerts
- Fundraising pipeline as YAML with investor-state tracking

## Blockers

None.

## Notes

- Initial repo created 2026-05-17
- Templates should be reusable across portfolio companies
