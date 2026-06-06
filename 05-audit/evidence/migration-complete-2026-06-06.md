---
title: 'Migration complete — gtcx-operations'
status: current
date: '2026-06-06'
owner: gtcx-operations
tier: standard
tags: ['audit', 'migration', 'layout-v3']
review_cycle: on-change
---

# Migration complete — gtcx-operations

**Date:** 2026-06-06  
**Score:** L1 **100/100** · L2 **100/100** · L3 **100/100** GREEN (`migrationComplete: true`, `worldClass: true`)

## Ecosystem evidence

| Artifact | Path |
| -------- | ---- |
| Scorecard JSON | `gtcx-agentic/05-audit/evidence/migration-health-gtcx-operations-latest.json` |
| Consolidation review | `01-docs/04-ops/workspace/repo-consolidation-review.md` |
| P33 spine | PASS — AGPL-3.0 |

## Dimension rollup

| ID | Dimension | Score |
| -- | --------- | ----: |
| S | Structure | 15/15 |
| P | Path references | 20/20 |
| L | Links & docs | 15/15 |
| O | Ops & config | 10/10 |
| B | Build | 15/15 |
| T | Tests | 25/25 |

## Gate exit codes (owner repo)

| Command | Exit |
| ------- | ---: |
| `pnpm ops:check` | 0 |
| `pnpm layout:migrate:v6:check` | 0 |
| `pnpm layout:strings:check` | 0 |
| `pnpm check:workspace-root-cleanliness:strict` | 0 |
| `pnpm typecheck` | 0 |
| `pnpm test` | 0 |
| `pnpm validate` | 0 |
| `pnpm agent:protocols:check` | 0 |
| `pnpm agent:bootstrap:check` | 0 |

## L3 bootstrap (2026-06-06)

- `config/sor-map.json`, `config/paths.mjs`, `config/repo-kind.json`, `config/governance-spine.json`
- `03-platform/scripts/agent-bootstrap-check.mjs` + `pnpm agent:bootstrap:check`
- `repoKind: corporate-ops` (single-package profile)

## Layout v3 completion (2026-06-06 session)

- `config/ops.manifest.json` — `deploy: 04-deploy`, v3 aliases, `workstream/` → `06-workstream/`
- `02-ops/manifest.json` — layout v3 pointer, `pnpm ops:check`
- Archived duplicate `01-docs/audit/` → `00-archive/01-docs-audit-legacy-2026-06-06/`
- Added `03-platform/README.md`, `repo-consolidation-review.md`, IA map in `01-docs/README.md`
- `migration_tier: stable` on root allowlist; `hygiene.config.json` → `04-deploy` + `06-workstream`
- README operational domains section + fixed architecture doc link
- Renamed `02-ops/*/README.md` headers from legacy `workspace/` paths
