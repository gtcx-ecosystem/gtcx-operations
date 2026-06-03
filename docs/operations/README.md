---
title: "Operations"
status: "current"
date: "2026-05-27"
owner: "gtcx-operations"
role: "protocol-architect"
agent_id: "agent://gtcx-operations/2026-05-27/session-backfill"
trust_score: 95
autonomy_level: "sovereign"
tier: "critical"
tags: ["documentation", "operations"]
review_cycle: "on-change"
---

---
title: 'Operations'
status: 'current'
date: '2026-05-27'
owner: 'ops@gtcx.trade'
role: 'ops@gtcx.trade'
tier: 'standard'
tags: ['operations', 'runbooks']
review_cycle: 'on-change'
---

# Operations

> How to run and maintain GTCX Operations.

This folder contains incident response, compliance, organizational structure, and day-to-day operational documentation.

---

## Structure

```
operations/
├── README.md           ← This file
├── organization/       ← Team structure, roles, governance, workflows
├── runbooks/           ← Incident response, escalation, on-call procedures
├── compliance/         ← Regulatory requirements, data classification, audits
├── analytics/          ← KPI definitions, metrics framework, dashboards
└── accessibility/      ← WCAG compliance, accessibility testing
```

---

## Contents

### Organization

| Document | Description |
|----------|-------------|
| [Bot Identity](./organization/bot-identity.md) | gtcx-agent service account details, permissions, rotation |
| [Agent Operating Profile](./organization/agent-profile.md) | AI agent identity, domain expertise, prohibited patterns |

### Runbooks

| Document | Description |
|----------|-------------|
| [ClickUp Sync Workflow](./runbooks/clickup-sync.md) | Sync follow-ups and sprints to ClickUp |
| [Cross-Channel Orchestration](./runbooks/cross-channel-orchestration.md) | Automated follow-up sequences across channels |

### Compliance

| Document | Description |
|----------|-------------|
| [Attestation register](./compliance/attestation-register.yaml) | Mirror of INF-86 XR-401 agentic attestations (COORD-ATR-001) |
| [Procurement wording](./compliance/procurement-attestation-wording.md) | External pack checklist — agentic vs human CISO claims |
| [Coordination pointer](../coordination/from-gtcx-protocols-agentic-trust-2026-06-03.md) | Link to protocols spec; owner = gtcx-agentic |

Refresh register: `pnpm sync:agentic-attestation`

---

## Operational Cadence

| Activity | Frequency | Owner |
|----------|-----------|-------|
| Credential rotation | Every 90 days | DevOps |
| Integration health check | Weekly | QA Lead |
| Budget variance review | Bi-weekly | Finance |
| ClickUp sync | Daily / on-demand | Automation |
| Thread registry build | Daily | Automation |
