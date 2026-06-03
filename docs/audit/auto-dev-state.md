---
title: 'Auto-Dev State — gtcx-operations'
status: current
date: 2026-06-03
owner: gtcx-operations
tier: standard
tags: ['audit', 'protocol-22', 'session']
review_cycle: on-change
---

# Auto-Dev State — gtcx-operations

**Updated:** 2026-06-03

## Next work (computed)

Run `pnpm agent:next-work` for authoritative selection.

| Field | Value |
| --- | --- |
| **Story** | OPS-02 (expected — resume in_progress) |
| **Tier** | resume-in_progress or handoff H-CLICKUP |
| **Command** | `pnpm agent:next-work` |

## Current position

- **Branch:** `main`
- **Active phase:** P1 (OPS-01–07)
- **Execution roadmap:** `docs/strategy/execution-roadmap.md`
- **Epic roadmap:** `docs/specs/_project/planning/roadmap.md`

## Recently completed

| Story | Title | Date |
| --- | --- | --- |
| OPS-01 | INF-86 XR-401 A/B/C compliance mirror | 2026-06-03 |
| OPS-04 | Protocol 22 + P24 governance wiring | 2026-06-03 |

## INF-86 critical path (sibling repos)

| Step | Owner | Status |
| --- | --- | --- |
| 1 XR-402 + SPKI | gtcx-infrastructure → protocols #61 | **waiting** (not gtcx-operations) |
| 2 XR-403 | gtcx-protocols after SPKI | **waiting** |
| 3 report-work | baseline-os | **waiting** (see protocols MESSAGE-baseline-os-report-work) |
| 4 compliance mirror | gtcx-operations | **done** — `pnpm sync:agentic-attestation` |

Pointer: `docs/coordination/ECOSYSTEM-CRITICAL-PATH-INF-86-POINTER.md`

## Cross-repo blockers

| Story | Blocked on | Ticket / path |
| --- | --- | --- |
| OPS-02 | baseline-os ClickUp mapping | `baseline-os/workstream/coordination/clickup-mapping.json` |
| OPS-08 | gtcx-core event bus | TBD — file `docs/coordination/to-gtcx-core-event-bus-*.md` when started |

## Protocol gates

| Check | Command |
| --- | --- |
| P22 wiring | `pnpm agent:work-selection:check` |
| Domain data | `pnpm validate` |
| INF-86 mirror | `pnpm sync:agentic-attestation` |
