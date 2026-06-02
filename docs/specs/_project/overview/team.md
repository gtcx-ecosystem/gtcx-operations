---
title: "GTCX Operations — Agile Team"
status: "current"
date: "2026-05-27"
owner: "gtcx-operations"
role: "product-agent"
agent_id: "agent://gtcx-operations/2026-05-27/session-backfill"
trust_score: 60
autonomy_level: "permissioned"
tier: "standard"
tags: ["documentation", "specs"]
review_cycle: "on-change"
---

---
title: 'GTCX Operations — Agile Team'
status: 'current'
date: '2026-05-27'
owner: 'ops@gtcx.trade'
role: 'ops@gtcx.trade'
tier: 'standard'
tags: ['team', 'agile', 'operations']
review_cycle: 'on-change'
---

# GTCX Operations — Agile Team

> **Team Charter:** Build the agentic operations engine for corporate functions — legal, HR, finance, IP, fundraising, and multi-channel communications — so the entire GTCX organization runs as observable, versioned software. This squad is the single owner of all work for gtcx-operations — **leading** the integration architecture, **managing** the backlog and sprint commitments, **documenting** workflows and API contracts, **organizing** ceremonies and vendor communication, **verifying** quality through integration testing, and **ensuring** the highest standard of deliverables across every commit.  
> **Squad Size:** 2–3 people (target: 4)  
> **Last Updated:** 2026-05-27

## Responsibilities by Function

This squad owns the full lifecycle of work for `gtcx-operations`:

| Function | What It Means | Primary Owner |
|----------|---------------|---------------|
| **Lead** | Technical direction for Google Workspace, WhatsApp, email integrations | Engineering Lead |
| **Manage** | Backlog grooming, sprint planning, ClickUp task sync, stakeholder updates | Product Manager |
| **Document** | Integration docs, API contracts, runbooks, vendor setup guides | Engineering Lead + PM |
| **Organize** | Sprint ceremonies, vendor sync, release coordination, stakeholder demos | Scrum Master |
| **Verify** | Integration tests, schema validation, message delivery verification | QA Lead |
| **Ensure Quality** | Final sign-off on releases, data integrity, compliance checks | Whole Squad |

## ClickUp Work Management

This squad manages all `gtcx-operations` work in ClickUp. Source of truth for sprint commitments and backlog priority is git (`docs/specs/_project/planning/`), but ClickUp is the operational execution layer.

| Activity | ClickUp Action | Owner |
|----------|---------------|-------|
| Sprint planning | Create sprint list, assign tasks, set due dates | Scrum Master |
| Daily standup | Update task status, log blockers, move cards | All squad members |
| Backlog grooming | Tag priorities, estimate effort, link to epics | Product Manager |
| Task creation | Create ClickUp tasks from sprint commitments and backlog items | Scrum Master |
| Status sync | Bi-directional sync between git sprint docs and ClickUp | Scrum Master + Automation |
| Release tracking | Mark tasks complete, update milestones, notify stakeholders | Product Manager |

**ClickUp List ID:** TBD (set during onboarding)

## Roles & Responsibilities

### Product Manager

| Field | Value |
|-------|-------|
| **Name** | @amanianai |
| **Type** | Full-time (shared with baseline-os, gtcx-markets) |
| **Responsibilities** | Own the backlog and roadmap for gtcx-operations. Manage stakeholder communication. Ensure ClickUp reflects current priorities. Document integration specs and acceptance criteria. Organize vendor relationships. |
| **Accountable For** | Sprint completion rate, stakeholder satisfaction, roadmap accuracy, ClickUp list hygiene, integration uptime |
| **Current Status** | 🟢 Staffed |

### Scrum Master / Agile Lead

| Field | Value |
|-------|-------|
| **Name** | @amanianai (acting) |
| **Type** | Agent-assisted |
| **Responsibilities** | Facilitate all ceremonies. Manage ClickUp task creation and status sync. Track velocity and blocker resolution. Organize cross-channel orchestration scheduling. Document sprint outcomes. |
| **Accountable For** | Sprint health, blocker resolution time, team velocity, ClickUp completeness, follow-up execution rate |
| **Current Status** | 🟡 Recruiting |

### Engineering Lead

| Field | Value |
|-------|-------|
| **Name** | @amanianai |
| **Type** | Full-time |
| **Responsibilities** | Lead technical direction for Google Workspace API clients, WhatsApp Business API, email provider abstraction, and orchestration engine. Document API contracts and integration patterns. Organize technical reviews. Verify deployment readiness. |
| **Accountable For** | System reliability, technical debt, code review throughput, architecture doc completeness, API integration reliability |
| **Current Status** | 🟢 Staffed |

### QA / Quality Lead

| Field | Value |
|-------|-------|
| **Name** | @amanianai (acting) |
| **Type** | Agent-assisted |
| **Responsibilities** | Define test strategy for integration suite. Verify all releases through automated testing. Document test plans and coverage. Ensure schema validation and CRM data integrity. Organize quality gates. |
| **Accountable For** | Test coverage (29/29 tests), defect escape rate, release confidence, QA documentation, data consistency |
| **Current Status** | 🟡 Recruiting |

### DevOps / Platform Engineer

| Field | Value |
|-------|-------|
| **Name** | @amanianai (acting) |
| **Type** | Shared resource |
| **Responsibilities** | Manage credential rotation and script scheduling. Organize release orchestration. Verify Google Workspace service account health. Document runbooks and secret management procedures. |
| **Accountable For** | Deployment frequency, mean time to recovery, `.secrets/` hygiene, API key rotation every 90 days |
| **Current Status** | 🟣 Shared |

### Security / Compliance Officer

| Field | Value |
|-------|-------|
| **Name** | @amanianai (acting) |
| **Type** | Shared resource |
| **Responsibilities** | Manage email audit trail and WhatsApp message logs. Verify contract compliance. Document legal template review procedures. Organize compliance checks. Ensure data retention policies. |
| **Accountable For** | Audit log completeness, legal enforceability of generated contracts, compliance gap closure |
| **Current Status** | 🟣 Shared |

---

## RACI Matrix

| Activity | PM | SM | Eng Lead | QA | DevOps | Security |
|----------|----|----|----------|----|--------|----------|
| **Lead** technical direction | C | I | **A** | C | I | I |
| **Manage** backlog & ClickUp | **A** | **R** | C | I | I | I |
| **Document** architecture | C | I | **A** | I | C | I |
| **Organize** ceremonies | C | **A** | C | C | I | I |
| **Verify** code quality | I | C | C | **A** | I | C |
| **Ensure** release quality | C | C | C | C | **A** | C |
| Sprint planning | **A** | **R** | C | C | I | I |
| Daily standup | C | **A** | C | C | I | I |
| Code review | I | I | **A** | C | I | C |
| Test strategy | C | C | C | **A** | I | C |
| Deployment | I | I | C | C | **A** | C |
| Incident response | C | C | **A** | C | **A** | C |
| Stakeholder demo | **A** | C | C | C | I | I |

---

## Team Health

| Metric | Target | Current | Trend |
|--------|--------|---------|-------|
| Integration tests passing | 35/35 | 29/29 | ↗️ |
| Google APIs operational | 5/5 | 0/5 | ➡️ (pending credentials) |
| ClickUp sync success rate | > 90% | 0% | ➡️ (pending list ID) |
| WhatsApp delivery rate | > 95% | — | — |
| Documentation coverage | 100% | 100% | ✅ |
| Sprint completion rate | > 80% | 65% | ↗️ |
| ClickUp task sync accuracy | > 95% | — | — |

---

## Communication

| Channel | Purpose | Cadence |
|---------|---------|---------|
| Daily standup | Blockers, progress, plans, ClickUp updates | Daily 09:00 UTC |
| Sprint planning | Commitments, estimation, ClickUp tasking | Bi-weekly Monday |
| Sprint review | Demo, stakeholder feedback | Bi-weekly Thursday |
| Retrospective | Process improvement, quality reflection | Bi-weekly Friday |
| Slack #gtcx-operations | Async updates, alerts | Continuous |
| ClickUp | Task tracking, status updates, blocker logging | Continuous |

---

## Hiring Priority

| Priority | Role | When | Why |
|----------|------|------|-----|
| P1 | Operations Engineer | Q3 2026 | Google Workspace + WhatsApp ops need dedicated owner; ClickUp management needs owner |
| P2 | QA Engineer | Q3 2026 | Integration test expansion beyond 29 tests |
| P3 | Communications Specialist | Q4 2026 | WhatsApp campaign content and audience segmentation |
