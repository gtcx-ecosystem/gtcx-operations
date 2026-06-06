---
title: 'gtcx-operations — Engineering Audit (Lane 1)'
status: current
date: '2026-06-06'
owner: gtcx-operations
audit_lane: engineering-completeness-quality
audit_command: engineering-audit
alias_commands: ['full-audit', 'forensic-audit']
audit_quality_1to10: 8.0
readiness_signoff: 4.2
readiness_completion: 5.8
readiness_lane_score: 5.0
tags: ['audit', 'engineering', 'lane-1']
review_cycle: quarterly
commit: 6d054b5b215458b265ab75fde9d52b4a4aa7cc56
reverified_at: '2026-06-06T17:20:00Z'
revision: 1
---

# gtcx-operations — Engineering Completeness & Quality (Lane 1)

**Repo:** `gtcx-ecosystem/gtcx-operations`  
**HEAD:** `6d054b5`  
**Prior:** none — **baseline** lane-1 forensic for this repo  
**Domain forensics cited:** none &lt;30 days (no `api-audit` or `deployment-audit` in-repo)

---

## Executive summary

| Metric            |      Value | Notes                                                                 |
| ----------------- | ---------: | --------------------------------------------------------------------- |
| Gate signoff      | **4.2/10** | Core TS/validate green via direct binaries; **`pnpm *` exit 1**; CI path red |
| Completion depth  | **5.8/10** | Zod schemas, Google/WhatsApp clients, 32 unit tests; toolchain miswired |
| **Lane headline** | **5.0/10** | Weighted dimension score (below)                                      |

**Verdict:** Functional corporate-ops automation layer with validated domain data and passing schema tests, but **not engineering-ready for CI/agent gates** until workspace (`pnpm-workspace.yaml`), Vitest workspace, and protocol manifest path drift are fixed. Class R domain work (validate, scripts) is unblocked via `tsx`/`tsc` direct invocation.

---

## Gate results (Protocol 27)

Audited **2026-06-06** on `6d054b5`. Commands run in-session from repo root unless noted.

| Gate                         | Command                                              | Exit | Notes                                                                 |
| ---------------------------- | ---------------------------------------------------- | ---: | --------------------------------------------------------------------- |
| Format                       | `pnpm format:check`                                  | **1** | Script **not defined** in `package.json`                              |
| Lint                         | `pnpm lint`                                          | **1** | Script **not defined**                                                |
| Typecheck                    | `pnpm typecheck`                                     | **1** | `pnpm-workspace.yaml` missing `packages` field                        |
| Typecheck (direct)           | `./node_modules/.bin/tsc --noEmit`                   | **0** | Strict TS passes                                                      |
| Test                         | `pnpm test`                                          | **1** | Same pnpm workspace error                                             |
| Test (workaround)            | `vitest run --config /tmp/vitest-ops.config.ts`      | **0** | **32/32** tests pass (6 files)                                        |
| Test (default)               | `./node_modules/.bin/vitest run`                     | **1** | `vitest.workspace.ts` refs missing `03-platform/tools/vitest.config.ts` |
| Build                        | `pnpm build`                                         | **1** | pnpm workspace error                                                  |
| Build (direct)               | `./node_modules/.bin/tsc`                            | **0** | Compiles `03-platform/src` → `dist/`                                  |
| Validate                     | `pnpm validate`                                      | **1** | pnpm workspace error                                                  |
| Validate (direct)            | `tsx 03-platform/scripts/validate.ts`                | **0** | **14/14** domain files pass                                           |
| Policy lint                  | `tsx 03-platform/scripts/lint-policies.ts`           | **0** | 2 missing recommended fields (warnings)                               |
| Agent protocols              | `pnpm agent:protocols:check`                         | **1** | pnpm workspace error                                                  |
| Agent protocols (direct)     | `node 03-platform/scripts/check-agent-protocols.mjs` | **1** | Wrong spawn `cwd` + path drift (see P0/P1)                            |
| Agent work selection         | `node 03-platform/scripts/check-agent-work-selection.mjs` | **1** | Manifest paths expect `01-docs/04-ops/`; files at `01-docs/operations/` |
| Ecosystem validate           | `tsx 03-platform/scripts/validate-ecosystem-consistency.ts` | **1** | ENOENT writing `workstream/ecosystem-consistency.md` (layout v3 drift) |
| Config stubs                 | `node 03-platform/scripts/config/sync-root-stubs.mjs --check` | **0** | Root stubs match SoR                                              |
| Workspace domains (P29)      | `node 03-platform/scripts/workspace/check.mjs`     | **0** | All workspace checks pass                                           |
| Architecture                 | `pnpm architecture:check`                            | **—**  | **Not defined** in `package.json`                                     |
| Root hygiene (strict signal) | `python3 03-platform/scripts/ops/check-workspace-root-cleanliness.py` | **0** | Reports **BLOCKED**: forbidden root `vitest.workspace.ts` |

---

## Dimension scorecard

| #   | Dimension             | Weight | Score | Conf | Evidence                                                                                  |
| --- | --------------------- | -----: | ----: | :--: | ----------------------------------------------------------------------------------------- |
| 1   | CI / quality gates    |    25% |   4.0 |  A   | Direct tsc/validate **0**; pnpm/CI path **1**; vitest workspace **1**; protocol checks **1** |
| 2   | Package completeness  |    20% |   6.0 |  A   | 70+ scripts; Zod schemas + clients; broken `pnpm-workspace.yaml`; compiled `.js` in `src/` |
| 3   | Test depth            |    20% |   5.5 |  A   | 32 schema unit tests; no integration/property tests; default vitest entry broken          |
| 4   | Crypto / safety hooks |    15% |   4.5 |  B   | No FIPS/fuzz campaign; external Google/Twilio APIs; `.secrets/` gitignored pattern OK     |
| 5   | Operational signals   |    10% |   5.5 |  B   | Cross-channel orchestration rules; sent/ audit logs; no OTel/metrics hooks in code          |
| 6   | Doc–code fidelity     |    10% |   4.0 |  A   | README stale architecture link; AGENTS paths vs `01-docs/operations/`; arch docs placeholders |

**Weighted lane score:** `(4.0×25 + 6.0×20 + 5.5×20 + 4.5×15 + 5.5×10 + 4.0×10) ÷ 100` = **4.93** → rounded **5.0** headline

---

## Findings

### P0 — Critical

| ID   | Finding | Owner | Evidence |
| ---- | ------- | ----- | -------- |
| E-P0-1 | **`pnpm-workspace.yaml` missing `packages` field** — all `pnpm run` / `pnpm test` fail | gtcx-operations | `pnpm-workspace.yaml:1-5`; `pnpm typecheck` exit **1** |
| E-P0-2 | **`vitest.workspace.ts` references non-existent configs** — default test runner cannot start | gtcx-operations | `vitest.workspace.ts:8-13`; `vitest run` exit **1** |
| E-P0-3 | **CI workflows invoke broken pnpm path** — `.github/workflows/ci.yml` and `validate.yml` will fail at install/run | gtcx-operations | `.github/workflows/ci.yml:21-37`; `.github/workflows/validate.yml:30-39` |

### P1 — High

| ID   | Finding | Owner | Evidence |
| ---- | ------- | ----- | -------- |
| E-P1-1 | Protocol manifest **path drift**: checks require `01-docs/04-ops/*`; established manifests live under `01-docs/operations/` | gtcx-operations | `check-agent-work-selection.mjs:20`; manifest at `01-docs/operations/agent-work-selection.md:1` |
| E-P1-2 | `check-agent-protocols.mjs` spawns checks with **`cwd: 03-platform/`** (not repo root) | gtcx-operations | `check-agent-protocols.mjs:9,21` |
| E-P1-3 | Session pointer at **`01-docs/audit/auto-dev-state.md`**; checks expect **`01-docs/05-audit/auto-dev-state.md`** | gtcx-operations | `check-agent-work-selection.mjs:23`; file at `01-docs/audit/auto-dev-state.md:15` |
| E-P1-4 | `ecosystem:validate` writes to **`workstream/`** (missing); layout v3 uses **`06-workstream/`** | gtcx-operations | `validate-ecosystem-consistency.ts:161` |

### P2 — Medium

| ID   | Finding | Owner | Evidence |
| ---- | ------- | ----- | -------- |
| E-P2-1 | README links **`01-docs/architecture/overview.md`** (missing) | gtcx-operations | `README.md:45` |
| E-P2-2 | **19 compiled `.js` artifacts** co-located in `03-platform/src/` alongside `.ts` sources | gtcx-operations | `find 03-platform/src -name '*.js'` → 19 |
| E-P2-3 | Prompt-standard gates **`format:check`**, **`lint`**, **`architecture:check`** not wired in `package.json` | gtcx-operations | `package.json` scripts block |
| E-P2-4 | Policy lint warnings — missing `review_date`, `status` on incident runbook | gtcx-operations | `03-platform/ops/runbooks/incident-response.md` |
| E-P2-5 | Root **`vitest.workspace.ts`** flagged by workspace hygiene allowlist | gtcx-operations | `check-workspace-root-cleanliness.py` → BLOCKED |

### P3 — Low

| ID   | Finding | Notes |
| ---- | ------- | ----- |
| E-P3-1 | Architecture docs (`system-overview.md`, `ecosystem-integration.md`) are placeholders | OPS-05 backlog |
| E-P3-2 | `01-docs/05-audit/` skeleton READMEs only — no prior lane forensics until this pass | Expected for first audit |

---

## Evidence gaps

- **API domain** — no `api-audit` forensic; Google/WhatsApp clients exist but no OpenAPI surface
- **Deployment domain** — no `deployment-audit`; `04-deploy/docker/` present but no staging witness in-repo
- **Integration E2E** — `pnpm test:integrations` not re-run (requires credentials); OPS-07 pending
- **Coverage signal** — no coverage gate or report configured

---

## Post-audit checklist

- [x] `01-docs/05-audit/engineering-audit-2026-06-06.md` (this file)
- [x] `01-docs/05-audit/engineering-completeness-quality-2026-06-06.md` index
- [x] `01-docs/05-audit/latest.json` → `lanes.engineeringCompletenessQuality`

---

## Agent Context Attestation

- [x] AGENTS.md + engineering-scoring read
- [x] P27 gates run in-session (exit codes above)
- [x] Lane 1 only — no bank-grade composite or GCR claims
