---
title: 'Repo consolidation review — gtcx-operations'
status: current
date: 2026-06-06
owner: gtcx-operations
document_id: OPS-CONSOLIDATE-001
tags: ['operations', 'workspace', 'hygiene', 'layout-v3']
review_cycle: on-change
---

# Repo consolidation review — gtcx-operations

What was combined, nested, or relocated for **layout v3** (seven hubs + P29 nine domains).

## Implemented (2026-06-06)

| Change | Before | After | Why |
| ------ | ------ | ----- | --- |
| Root hubs | Informal domain folders at repo root | **Seven hubs** `00`–`06` | Protocol 29 closed-world root |
| Corporate data | Scattered `legal/`, `crm/`, … at root | `03-platform/{legal,crm,…}` | All implementation under `03-platform/` |
| Ship hub | `04-ship/` alias drift | `04-deploy/` | Layout v3 normative name |
| Workstream | Unnumbered `workstream/` (if present) | `06-workstream/` | Same shape in every repo |
| Ops domains | `workspace/` (v1) | `02-ops/{pm,gtm,coordination,…}` | P29 machine-readable domains |
| Session pointer duplicate | `01-docs/audit/auto-dev-state.md` | `01-docs/05-audit/auto-dev-state.md` only | Single SoR; legacy archived |
| Ops manifest | `ship: 04-ship`, v2 layout pointer | `deploy: 04-deploy`, v3 pointer | Align with gtcx-docs spec |
| Toolchain | Broken `vitest.workspace.ts` at root | `config/toolchain/vitest.config.ts` | Protocol 31 root cleanliness |

**Witness:** `05-audit/evidence/migration-complete-2026-06-06.md` · `01-docs/05-audit/engineering-audit-2026-06-06.md`

## Hub map (this repo)

| Hub | Path | Role |
| --- | ---- | ---- |
| 00 | `00-archive/` | Superseded docs (incl. legacy `01-docs/audit/`) |
| 01 | `01-docs/` | Narrative documentation |
| 02 | `02-ops/` | Nine P29 domains (JSON manifests) |
| 03 | `03-platform/` | Domain YAML/JSON + TypeScript automation |
| 04 | `04-deploy/` | Deploy artifacts (minimal today) |
| 05 | `05-audit/` | Audit workflow entry |
| 06 | `06-workstream/` | Sprints, status, P24 markdown handoffs |

## Intentionally kept separate

| Path | Why not merged |
| ---- | -------------- |
| `02-ops/attestation/evidence-index.json` + `witness/evidence-index.json` | Different artifact classes |
| `01-docs/05-audit/` (forensics) vs `05-audit/` (entry) | Narrative vs workflow entry hub |
| `01-docs/operations/` vs `01-docs/04-ops/` | Tier-B repo policy vs P29 ops domain docs |

## Verification

```bash
pnpm ops:check
pnpm layout:migrate:v6:check
pnpm check:workspace-root-cleanliness:strict
pnpm layout:strings:check
```
