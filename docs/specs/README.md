---
title: "Specifications"
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

---
title: 'Specifications'
status: 'current'
date: '2026-05-27'
owner: 'ops@gtcx.io'
role: 'ops@gtcx.io'
tier: 'standard'
tags: ['specs', 'planning']
review_cycle: 'on-change'
---

# Specifications

> What we're building in GTCX Operations.

This folder contains per-service specifications, project-level planning, and all project-specific content. This is the one folder whose contents differ per repo — everything project-specific lives here.

---

## Structure

```
specs/
├── README.md              ← This file
├── _project/              ← Cross-cutting project docs
│   ├── overview/          ← Vision, team, risks
│   └── planning/          ← Roadmap, backlog, sprint plans
├── products/              ← Product/service specs (when applicable)
├── engines/               ← Internal processing specs (when applicable)
└── infrastructure/        ← Infrastructure specs (when applicable)
```

---

## Contents

### Project Overview

| Document | Description |
|----------|-------------|
| [Team Definition](./_project/overview/team.md) | Squad roles, responsibilities, RACI matrix |
| [Agent Operating Profile](./_project/overview/agent-profile.md) | AI agent identity, domain expertise, prohibited patterns |

### Project Planning

| Document | Description |
|----------|-------------|
| [Roadmap 2026](./_project/planning/roadmap.md) | Q2–Q4 milestones, epics, dependencies |
| [Product Backlog](./_project/planning/backlog.md) | Prioritized work beyond current sprint |
| [Sprint Docs](./_project/planning/sprints/) | Sprint documentation and archive |
| [Nyota Integration Plan](./_project/planning/nyota-operations-integration.md) | Cross-product integration strategy |

---

## Principles

- **Project-specific content lives here.** The other 5 root folders are universal.
- **One source of truth.** Roadmap, backlog, and sprint docs are canonical in git. ClickUp is a read-only mirror.
- **Specs before code.** Every significant capability has a spec doc before implementation begins.
