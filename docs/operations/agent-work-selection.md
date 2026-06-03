---
title: 'Agent Work Selection Manifest'
status: current
date: 2026-06-03
owner: gtcx-operations
document_id: OPS-AWS-001
protocol: gtcx-docs/docs/governance/protocols/22-agent-work-selection/protocol.md
adoption_status: established
reference_implementation: exploration-os
---

# Agent Work Selection — gtcx-operations

> **Status:** Protocol 22 **established** (Tier 2/3 operations).  
> **Reference:** [exploration-os agent-work-selection](https://github.com/gtcx-ecosystem/exploration-os/blob/main/docs/operations/agent-work-selection.md)  
> **Agent paste brief:** [`AGENT-PROTOCOL-22-BRIEF.md`](./AGENT-PROTOCOL-22-BRIEF.md)  
> **CI/local gate:** `pnpm agent:work-selection:check`  
> **Rule:** Agents compute next work from the execution roadmap. **Never ask the operator which story to pick.**

## Canonical paths

| Artifact | Path |
| --- | --- |
| Execution roadmap (story register) | [`docs/strategy/execution-roadmap.md`](../strategy/execution-roadmap.md) |
| Epic roadmap (human) | [`docs/specs/_project/planning/roadmap.md`](../specs/_project/planning/roadmap.md) |
| Session pointer | [`docs/audit/auto-dev-state.md`](../audit/auto-dev-state.md) |
| Baseline session memory | [`.baseline/memory/session.md`](../../.baseline/memory/session.md) |
| Cross-repo blockers | [`.baseline/memory/dependencies.md`](../../.baseline/memory/dependencies.md) |
| Selection script | [`scripts/agent-next-work.mjs`](../../scripts/agent-next-work.mjs) |

## Commands

```bash
pnpm agent:next-work
pnpm agent:work-selection:check

# Regulatory-audit frame — include evidence/external stories
AGENT_FRAME=regulatory-audit pnpm agent:next-work
```

## Active phase

Read from roadmap heading:

`## Active phase: **P1 — Documentation, ClickUp, credentials, governance**`

| Phase | OPS range | Focus |
| --- | --- | --- |
| P1 | OPS-01–07 | Q2 activation |
| P2 | OPS-08–12 | Q3 event bus + markets |
| P3 | OPS-13–14 | Q4 autonomous ops |

**Handoffs override phase** — see execution-roadmap § Critical handoffs.

## Pilot handoffs (Tier 2)

| Handoff | Story | Status |
| --- | --- | --- |
| H-INF86 | OPS-01 | done — XR-401 A/B/C mirror |
| H-CLICKUP | OPS-02 | in_progress — ClickUp list ID |
| H-GW | OPS-03 | in_progress — Workspace credentials |
| H-P22 | OPS-04 | done — Protocol 22 wiring |
| H-CI | OPS-06 | pending — CI validate + audit |

## Implementation classes

| Class | Detection | Development frame |
| --- | --- | --- |
| `code` | Default — scripts, schemas, integrations | **Select** |
| `ops-docs` | Author `docs/`, runbook, manifest, pointer | **Select** |
| `evidence-capture` | UAT-, manual sign-off only | **Skip** |
| `external` | SOC 2 CPA, pen-test vendor, Legal sign-off | **Skip** |

## Session workflow

1. Complete AGENTS.md startup (Phases 1–5.3).
2. **Phase 5.4:** `pnpm agent:next-work`.
3. State story ID in session summary — no menu, no ask.
4. Mark `in_progress` in `docs/strategy/execution-roadmap.md`.
5. Run verification ladder (Protocol 27): `pnpm agent:verify-ladder` — report exit codes.
6. Mark `done`; refresh `auto-dev-state.md` and `.baseline/memory/session.md`.
7. Re-run `pnpm agent:next-work`.

## Cross-repo (Protocol 24)

P0 stories blocked on sibling repos (OPS-02 → baseline-os, OPS-08 → gtcx-core): file `docs/coordination/to-<repo>-*.md` and update `dependencies.md` in the **same session**. See [`cross-repo-coordination.md`](./cross-repo-coordination.md).

## Forbidden

- “Which story should I work on next?”
- Picking OPS-08 while H-CLICKUP (OPS-02) is still pending without user override.
- Waiting for product direction when this manifest and roadmap exist.

## Escalation (allowed)

- Missing credentials (Google, ClickUp) — document in session; use vault MCP per Protocol 19.
- User message **explicitly** names a story ID (override for that session only).
- P0 cross-repo blocker — Protocol 24 E1–E4 before other work.
