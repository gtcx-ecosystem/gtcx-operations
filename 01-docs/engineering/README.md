---
title: "Engineering"
status: "current"
date: "2026-05-27"
owner: "gtcx-operations"
role: "protocol-architect"
agent_id: "agent://gtcx-operations/2026-05-27/session-backfill"
trust_score: 95
autonomy_level: "sovereign"
tier: "critical"
tags: ["documentation", "engineering"]
review_cycle: "on-change"
---

---
title: 'Engineering'
status: 'current'
date: '2026-05-27'
owner: 'ops@gtcx.trade'
role: 'ops@gtcx.trade'
tier: 'standard'
tags: ['engineering', 'guides']
review_cycle: 'on-change'
---

# Engineering

> How to build and contribute to GTCX Operations.

This folder contains developer setup, coding standards, testing, security, and CI/CD documentation.

---

## Structure

```
engineering/
├── README.md        ← This file
├── guides/          ← Developer onboarding, contributor handbook, how-tos
├── security/        ← Security policies, threat models
├── testing/         ← QA strategy, test coverage requirements
├── devops/          ← CI/CD pipelines, infrastructure as code
└── data/            ← Data governance, ETL pipelines
```

---

## Contents

| Document | Description |
|----------|-------------|
| [Google Workspace Setup Guide](./guides/google-workspace-setup.md) | Step-by-step setup for Gmail, Calendar, Drive, Sheets APIs |

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Validate all schemas
pnpm validate

# Run tests
pnpm test

# Test integrations (dry-run)
pnpm test:integrations

# Check credentials
pnpm check:credentials
```

---

## Coding Standards

- **TypeScript 5.x** with strict mode
- **Zod** for all schema validation
- **Conventional commits:** `type(scope): subject`
- No hardcoded secrets — use `.secrets/` or environment variables
- All scripts support `--dry-run` flag
