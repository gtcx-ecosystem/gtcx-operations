---
title: 'gtcx-operations — Engineering Audit (Lane 1)'
status: current
date: '2026-06-06'
owner: gtcx-operations
audit_lane: engineering-completeness-quality
audit_command: engineering-audit
alias_commands: ['full-audit', 'forensic-audit']
audit_quality_1to10: 8.5
readiness_signoff: 7.8
readiness_completion: 6.2
readiness_lane_score: 6.3
tags: ['audit', 'engineering', 'lane-1']
review_cycle: quarterly
commit: 512a4af
reverified_at: '2026-06-06T21:06:00Z'
revision: 2
prior_revision: 1
prior_commit: 6d054b5
---

# gtcx-operations — Engineering Completeness & Quality (Lane 1)

**Repo:** `gtcx-ecosystem/gtcx-operations`  
**HEAD:** `512a4af`  
**Prior:** [revision 1 @ `6d054b5`](./engineering-audit-2026-06-06.md) — **delta reverify** same day  
**Domain forensics cited:** none &lt;30 days (no `api-audit` or `deployment-audit` in-repo)

---

## Executive summary

| Metric            |      Value | Notes                                                                 |
| ----------------- | ---------: | --------------------------------------------------------------------- |
| Gate signoff      | **7.8/10** | Core pnpm path **green**; `format:check` / `architecture:check` absent |
| Completion depth  | **6.2/10** | Zod schemas, Google/WhatsApp clients, 32 unit tests; no coverage/fuzz |
| **Lane headline** | **6.3/10** | Weighted dimension score (below)                                      |

**Verdict:** **Substantially improved** since revision 1 — P0 toolchain blockers (pnpm workspace, Vitest config, protocol manifest drift, ecosystem validate path) are **resolved**. CI and agent protocol gates are now green at HEAD. Remaining gaps are **P2 doc hygiene** (stale README link, duplicate session pointer), **compiled `.js` artifacts in `src/`**, and missing prompt-standard gates (`format:check`, `architecture:check`).

**Delta from revision 1:** Lane score **5.0 → 6.3** (+1.3); gate signoff **4.2 → 7.8** (+3.6).

---

## Gate results (Protocol 27)

Audited **2026-06-06** (revision 2) on `512a4af`. Commands run in-session from repo root unless noted.

| Gate                         | Command                                              | Exit | Notes                                                                 |
| ---------------------------- | ---------------------------------------------------- | ---: | --------------------------------------------------------------------- |
| Format                       | `pnpm format:check`                                  | **254** | Script **not defined** in `package.json`                              |
| Lint                         | `pnpm lint`                                          | **0** | Delegates to `lint:policies`; 2 warnings on incident runbook        |
| Typecheck                    | `pnpm typecheck`                                     | **0** | Strict TS passes                                                      |
| Test                         | `pnpm test`                                          | **0** | **32/32** tests pass (6 files) via `config/toolchain/vitest.config.ts` |
| Build                        | `pnpm build`                                         | **0** | Compiles `03-platform/src` → `dist/`                                  |
| Validate                     | `pnpm validate`                                      | **0** | **14/14** domain files pass                                           |
| Architecture                 | `pnpm architecture:check`                            | **254** | Script **not defined** in `package.json`                              |
| Agent protocols              | `pnpm agent:protocols:check`                         | **0** | P19, P22, P24, P26, P27 all pass                                      |
| Agent work selection         | `pnpm agent:work-selection:check`                    | **0** | Manifest paths resolve                                              |
| Agent execution obligation   | `pnpm agent:execution-obligation:check`              | **0** | P27 wiring OK                                                         |
| Agent proceed confirmation   | `pnpm agent:proceed-confirmation:check`              | **0** | P26 wiring OK                                                         |
| Agent credentials            | `pnpm agent:credentials:check`                       | **0** | P19 wiring OK                                                         |
| Ecosystem validate           | `pnpm ecosystem:validate`                            | **0** | Report → `06-workstream/ecosystem-consistency.md` (132/176, 75%)    |
| Config stubs                 | `pnpm config:stubs:check`                            | **0** | Root stubs match SoR                                                  |
| Workspace domains (P29)      | `pnpm ops:check`                                     | **0** | All workspace checks pass                                             |
| Root hygiene (strict)        | `pnpm check:workspace-root-cleanliness:strict`       | **0** | **PASS** — root allowlist clean (was BLOCKED in rev 1)              |

---

## Dimension scorecard

| #   | Dimension             | Weight | Score | Conf | Evidence                                                                                  |
| --- | --------------------- | -----: | ----: | :--: | ----------------------------------------------------------------------------------------- |
| 1   | CI / quality gates    |    25% |   8.0 |  A   | pnpm typecheck/test/build/validate **0**; agent protocols **0**; 2 prompt gates missing   |
| 2   | Package completeness  |    20% |   7.0 |  A   | 70+ scripts; Zod + clients; `pnpm-workspace.yaml` fixed; 19 compiled `.js` in `src/`    |
| 3   | Test depth            |    20% |   6.0 |  A   | 32 schema unit tests; Vitest entry fixed; no integration/coverage/property tests        |
| 4   | Crypto / safety hooks |    15% |   4.5 |  B   | No FIPS/fuzz campaign; external Google/Twilio APIs; `.secrets/` gitignored pattern OK     |
| 5   | Operational signals   |    10% |   5.5 |  B   | Cross-channel orchestration rules; sent/ audit logs; no OTel/metrics hooks in code        |
| 6   | Doc–code fidelity     |    10% |   4.5 |  A   | README stale architecture link; duplicate `auto-dev-state.md`; arch docs placeholders     |

**Weighted lane score:** `(8.0×25 + 7.0×20 + 6.0×20 + 4.5×15 + 5.5×10 + 4.5×10) ÷ 100` = **6.28** → rounded **6.3** headline

**Gate signoff formula:** 6 of 8 prompt-standard gates pass (2 undefined) + all agent/ecosystem gates pass → **7.8/10**

**Completion depth formula:** Strong schema/client layer; missing coverage, fuzz, domain forensics → **6.2/10**

---

## Findings

### Resolved since revision 1 (2026-06-06)

| ID (rev 1) | Finding | Status |
| ---------- | ------- | ------ |
| E-P0-1 | `pnpm-workspace.yaml` missing `packages` field | **Fixed** — `packages: ['.']` present |
| E-P0-2 | `vitest.workspace.ts` references missing configs | **Fixed** — removed; SoR at `config/toolchain/vitest.config.ts` |
| E-P0-3 | CI workflows invoke broken pnpm path | **Fixed** — `pnpm typecheck` / `test` / `validate` exit **0** |
| E-P1-1 | Protocol manifest path drift | **Fixed** — `agent:work-selection:check` exit **0** |
| E-P1-2 | `check-agent-protocols.mjs` wrong `cwd` | **Fixed** — `agent:protocols:check` exit **0** |
| E-P1-3 | Session pointer path mismatch | **Fixed** — check reads `01-docs/05-audit/auto-dev-state.md` |
| E-P1-4 | `ecosystem:validate` writes to missing `workstream/` | **Fixed** — writes `06-workstream/ecosystem-consistency.md` |
| E-P2-5 | Root `vitest.workspace.ts` hygiene violation | **Fixed** — file removed; strict hygiene **PASS** |

### P1 — High

| ID   | Finding | Owner | Evidence |
| ---- | ------- | ----- | -------- |
| E-P1-5 | **Duplicate session pointer** — `01-docs/audit/auto-dev-state.md` stale copy alongside canonical `01-docs/05-audit/auto-dev-state.md` | gtcx-operations | Both files exist; check uses `05-audit/` only |

### P2 — Medium

| ID   | Finding | Owner | Evidence |
| ---- | ------- | ----- | -------- |
| E-P2-1 | README links **`01-docs/architecture/overview.md`** (missing) | gtcx-operations | `README.md:45` — use `01-docs/architecture/README.md` |
| E-P2-2 | **19 compiled `.js` artifacts** co-located in `03-platform/src/` alongside `.ts` sources | gtcx-operations | `find 03-platform/src -name '*.js'` → 19 |
| E-P2-3 | Prompt-standard gates **`format:check`**, **`architecture:check`** not wired in `package.json` | gtcx-operations | `pnpm format:check` / `architecture:check` exit **254** |
| E-P2-4 | Policy lint warnings — missing `review_date`, `status` on incident runbook | gtcx-operations | `03-platform/ops/runbooks/incident-response.md` |

### P3 — Low

| ID   | Finding | Notes |
| ---- | ------- | ----- |
| E-P3-1 | Architecture docs (`system-overview.md`, `ecosystem-integration.md`) are placeholders | OPS-05 backlog |
| E-P3-2 | No coverage gate or report configured | Add Vitest coverage threshold when integration tests land |

---

## Evidence gaps

- **API domain** — no `api-audit` forensic; Google/WhatsApp clients exist but no OpenAPI surface
- **Deployment domain** — no `deployment-audit`; `04-deploy/` present but no staging witness in-repo
- **Integration E2E** — `pnpm test:integrations` not re-run (requires credentials); OPS-07 pending
- **Coverage signal** — no coverage gate or report configured

---

## Post-audit checklist

- [x] `01-docs/05-audit/engineering-audit-2026-06-06.md` (revision 2)
- [x] `01-docs/05-audit/engineering-completeness-quality-2026-06-06.md` index updated
- [x] `01-docs/05-audit/latest.json` → `lanes.engineeringCompletenessQuality`

---

## Agent Context Attestation

- [x] AGENTS.md + engineering-scoring read
- [x] P27 gates run in-session (exit codes above)
- [x] Lane 1 only — no bank-grade composite or GCR claims
- [x] Delta documented vs revision 1 @ `6d054b5`
