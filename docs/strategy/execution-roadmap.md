---
title: 'GTCX Operations — Execution Roadmap (story register)'
status: current
date: 2026-06-03
owner: gtcx-operations
document_id: OPS-ROADMAP-001
protocol: gtcx-docs/docs/governance/protocols/22-agent-work-selection/protocol.md
review_cycle: on-change
---

# GTCX Operations — Execution Roadmap

> **Canonical planning:** [`docs/specs/_project/planning/roadmap.md`](../specs/_project/planning/roadmap.md) (epics)  
> **This file:** Protocol 22 story register — agents update status here.

## Active phase: **P1 — Documentation, ClickUp, credentials, governance**

| Phase | OPS range | Focus |
| --- | --- | --- |
| P1 | OPS-01–OPS-07 | Q2 — docs, ClickUp, GW, P22, CI, integrations |
| P2 | OPS-08–OPS-12 | Q3 — event bus, markets, WhatsApp, CRM, budgets |
| P3 | OPS-13–OPS-14 | Q4 — autonomous follow-ups, compliance reports |

## Critical handoffs (Tier 2)

| Handoff | Story | Notes |
| --- | --- | --- |
| H-INF86 | OPS-01 | INF-86 XR-401 A/B/C compliance mirror |
| H-CLICKUP | OPS-02 | ClickUp list ID — blocks live task sync |
| H-GW | OPS-03 | Google Workspace credentials |
| H-P22 | OPS-04 | Protocol 22 established in repo |
| H-CI | OPS-06 | `pnpm validate` + audit in PR CI |

## Story register

| ID | Title | Feature | JTBD | Personas | Priority | Status |
| --- | --- | --- | --- | --- | --- | --- |
| OPS-01 | Mirror INF-86 XR-401 A/B/C agentic attestations | coordination | compliance evidence | compliance-officer | P0 | done |
| OPS-02 | Fix ClickUp list ID mapping in baseline-os | clickup | ops task sync | developer | P0 | in_progress |
| OPS-03 | Place Google Workspace credentials and verify APIs | google | email calendar crm | developer | P0 | in_progress |
| OPS-04 | Establish Protocol 22 agent work selection | governance | autonomous backlog | developer | P0 | done |
| OPS-05 | Fix README broken documentation links | docs | operator trust | developer | P1 | pending |
| OPS-06 | Add domain validate and pnpm audit to CI | ci | quality gate | developer | P1 | pending |
| OPS-07 | Test all integrations end-to-end | integrations | integration health | developer | P1 | pending |
| OPS-08 | Event bus integration publish to gtcx-core | events | ecosystem events | platform-architect | P0 | pending |
| OPS-09 | Push investor notifications to gtcx-markets portal | markets | investor comms | product-strategist | P0 | pending |
| OPS-10 | Automated WhatsApp campaign runner | whatsapp | producer outreach | developer | P1 | pending |
| OPS-11 | CRM bidirectional sync with Google Contacts | crm | contact sync | developer | P1 | pending |
| OPS-12 | Budget variance alerts Slack and email | finance | finance ops | developer | P1 | pending |
| OPS-13 | Auto-execute scheduled follow-ups with approve gate | orchestration | autonomous ops | developer | P2 | pending |
| OPS-14 | Monthly compliance report generation | compliance | SOC2 evidence | compliance-officer | P2 | pending |

## External / evidence (skip in development frame)

| ID | Title | Class | Status |
| --- | --- | --- | --- |
| OPS-E01 | SOC 2 CPA evidence review | external | pending |
| OPS-E02 | Pen-test vendor retest sign-off | external | pending |

---

*Update status in this table after each story. Run `pnpm agent:next-work` for next unit.*
