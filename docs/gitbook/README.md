---
title: "GitBook"
status: "current"
date: "2026-05-27"
owner: "gtcx-operations"
role: "protocol-architect"
agent_id: "agent://gtcx-operations/2026-05-27/session-backfill"
trust_score: 95
autonomy_level: "sovereign"
tier: "critical"
tags: ["documentation", "gitbook"]
review_cycle: "on-change"
---

---
title: 'GitBook'
status: 'current'
date: '2026-05-27'
owner: 'ops@gtcx.io'
role: 'ops@gtcx.io'
tier: 'standard'
tags: ['docs', 'api']
review_cycle: 'quarterly'
---

# GitBook

> External-facing documentation for GTCX Operations.

This folder is the GitBook content root. It contains user-facing guides, API reference, and getting started tutorials for external audiences.

---

## Structure

```
gitbook/
├── README.md     ← This file
└── api/          ← API reference for external consumers
    └── README.md
```

---

## Contents

| Document | Description |
|----------|-------------|
| [API Reference](./api/README.md) | Complete API reference for Google Workspace clients, WhatsApp client, validation utilities |

---

## Audience

- **Integrators** — Developers building on top of GTCX Operations APIs
- **Operators** — Team members running scripts and workflows
- **Partners** — External organizations integrating with GTCX
