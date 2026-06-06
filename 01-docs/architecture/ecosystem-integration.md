---
title: "Ecosystem Integration"
status: "current"
date: "2026-06-06"
owner: "gtcx-operations"
role: "protocol-architect"
tier: "standard"
tags: ["documentation", "architecture", "ecosystem"]
review_cycle: "on-change"
---

# Ecosystem Integration

gtcx-operations is a **Tier 2/3 hybrid** corporate satellite. It consumes ecosystem standards from gtcx-docs and reports coordination through baseline-os.

## Upstream dependencies

| Repo | Integration |
| --- | --- |
| **gtcx-docs** | Institutional baseline, Protocol 22/24/26/27/33 specs |
| **baseline-os** | Coordination hub (`workstream/coordination/`), cost router, vault provider |
| **gtcx-agentic** | Orchestration events, ecosystem push/health scripts, audit rubric |
| **gtcx-agile** | Ecosystem graph for dependency mapping (`ecosystem:health`) |
| **gtcx-protocols** | Env var contracts, deployment-proof-index (link only — no duplicate harness) |
| **gtcx-core** | Financial events from budget sync (future) |
| **compliance-os** | Legal contracts feed compliance checks (future) |

## Downstream consumers

- **BaselineOS governance sync** — policies mirror to `baseline-os/01-docs/governance/`
- **Agentic orchestration** — domain events exposed to `gtcx-agentic`
- **ClickUp / GTM** — sprint pushes, pipeline status reports

## Coordination contract

| Action | Command / path |
| --- | --- |
| Report work | `pnpm ecosystem:repo:report-work` → `baseline-os/workstream/coordination/coordination-report-latest.md` |
| Health snapshot | `pnpm ecosystem:health` → `06-workstream/ecosystem-health.{json,md}` |
| Cross-repo blockers | `01-docs/06-coordination/to-*.md` + `.baseline/memory/dependencies.md` |
| Push (harness) | `pnpm --dir ../gtcx-agentic ecosystem:push-all` |

When P0 work is blocked on a sibling repo, file a Protocol 24 ticket in the same session — do not leave blockers chat-only.

## Credentials (Protocol 19)

Runtime secrets are product-owned; vault SoR is gtcx-agentic (`baseline_vault` MCP). Standard env vars: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `DATABASE_URL`, `REDIS_URL`, `BASELINE_MASTER_KEY`. Never commit secrets.

## Structure gates

Migration tier **stable** (`01-docs/operations/repo/root-allowlist.json`). L3 bootstrap: `pnpm agent:bootstrap:check`. Structure 10/10: `pnpm architecture:check` + `pnpm format:check`.
