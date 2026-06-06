---
title: "System Overview"
status: "current"
date: "2026-06-06"
owner: "gtcx-operations"
role: "protocol-architect"
tier: "standard"
tags: ["documentation", "architecture"]
review_cycle: "on-change"
---

# System Overview

GTCX Operations is the **corporate functions layer** of the GTCX ecosystem — legal contracts, HR policies, finance budgets, IP assets, fundraising pipeline, CRM, and operational runbooks in machine-actionable formats (YAML, JSON Schema, Handlebars).

## Layout (v3)

Seven hubs partition the repo by lifecycle:

| Hub | Purpose |
| --- | --- |
| `00-archive` | Retired docs and one-off migrations |
| `01-docs` | Human + agent documentation (strategy, architecture, operations) |
| `02-ops` | P29 agent workspace domains (pm, credentials, universal) |
| `03-platform` | Domain data, schemas, TypeScript CLI automation |
| `04-deploy` | Deployment manifests (when applicable) |
| `05-audit` | Audit entry points and evidence |
| `06-workstream` | Generated status, health, coordination outputs |

Path authority lives in `config/sor-map.json` and `config/paths.mjs`. Agent protocol manifests are canonical under `01-docs/operations/`; `01-docs/04-ops/` holds layout pointers and redirect stubs.

## Corporate domains

Business data and automation are grouped by function — see [`03-platform/DOMAINS.md`](../../03-platform/DOMAINS.md):

- **Legal** — contracts (`03-platform/legal/`), generation via `generate-contract`
- **Finance** — budgets (`03-platform/finance/`), variance via `check:budgets`
- **HR** — policies (`03-platform/hr/`), lint via `lint:policies`
- **IP** — asset registry (`03-platform/ip/`)
- **Fundraising** — deal pipeline (`03-platform/fundraising/`)
- **CRM / comms** — Google Sheets sync, email, WhatsApp, Threads builders

Each domain exposes a validate script target in `package.json`; domain TypeScript lives in `03-platform/scripts/domains/`.

## Automation stack

| Layer | Location |
| --- | --- |
| Domain CLIs | `03-platform/scripts/domains/*.ts` |
| Ecosystem hooks | `03-platform/scripts/ecosystem/*.ts` |
| Agent gates (P19–P33) | `03-platform/scripts/agent/*.mjs` |
| Shared libs | `03-platform/src/` |

Runtime: Node.js 22, TypeScript 5.x, pnpm. Quality gates: `pnpm validate`, `pnpm test`, `pnpm typecheck`, `pnpm ops:check`, `pnpm architecture:check`.

## Agent identity

Automated commits use `gtcx-agent <agent@gtcx.trade>`. Work selection follows Protocol 22 (`pnpm agent:next-work`); verification ladder Protocol 27 (`pnpm agent:verify-ladder`).
