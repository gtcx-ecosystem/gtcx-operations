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
**Score:** 100/100 GREEN (`migrationComplete: true`)  
**Commit:** `cbe126b` (migration slice: `ccfbcd9` toolchain · `073c812` ops · `f9dff1f` governance · `cbe126b` evidence)

## Ecosystem evidence

| Artifact | Path |
| -------- | ---- |
| Scorecard JSON | `gtcx-agentic/05-audit/evidence/migration-health-gtcx-operations-latest.json` |
| P32 manifest | PASS — 23/23 documents |
| P33 spine | PASS — AGPL-3.0-or-later |

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
| `pnpm check:workspace-root-cleanliness:strict` | 0 |
| `pnpm config:stubs:check` | 0 |
| `pnpm layout:migrate:v6:check` | 0 |
| `pnpm ops:check` | 0 |
| `pnpm pm:sync` | 0 |
| `pnpm lint` | 0 |
| `pnpm typecheck` | 0 |
| `pnpm build` | 0 |
| `pnpm test` | 0 |
| `node 03-platform/scripts/check-agent-protocols.mjs` | 0 |

## Fixes applied (this session)

- Added `packages: ['.']` to `pnpm-workspace.yaml` (unblocks all pnpm scripts)
- Replaced broken monorepo `vitest.workspace.ts` with `config/toolchain/vitest.config.ts`
- Removed forbidden root `vitest.workspace.ts` stub (Protocol 31)
- Added `layout-drift-check.mjs`, `ops:check`, `lint`, `layout:migrate:v6:check` scripts
- Aligned protocol check paths to `01-docs/operations/` (layout v3)
- Fixed `check-agent-protocols.mjs` repo-root spawn `cwd`
- Added `LICENSE` (AGPL-3.0), governance spine tier-B docs, `CHANGELOG.md`
- Copied session pointer to `01-docs/05-audit/auto-dev-state.md`
- Fixed `ecosystem:validate` output path → `06-workstream/`

## Deferred (non-migration)

- OPS-02 ClickUp list ID mapping (baseline-os handoff)
- OPS-03 Google Workspace credentials placement
- OPS-05 README broken architecture doc links
- Engineering audit P0 items from `engineering-audit-2026-06-06.md` — resolved by this migration for toolchain gates

## Sibling repos

Not started in this session (per mission scope).
