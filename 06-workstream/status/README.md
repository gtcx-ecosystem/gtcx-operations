---
title: 'Workstream status outputs'
status: current
date: 2026-06-06
owner: gtcx-operations
---

# Workstream status

Generated and agent-maintained operational snapshots live here.

| Artifact | Producer | Refresh |
| --- | --- | --- |
| `ecosystem-health.json` / `.md` | `pnpm ecosystem:health` | On demand / CI |
| Coordination reports | `pnpm ecosystem:repo:report-work` (via baseline-os hub) | Per handoff |
| Sprint / roadmap pointers | Agents update `01-docs/strategy/execution-roadmap.md` | Per story |

Do not hand-edit JSON health files — regenerate via the CLI. Human narrative status belongs in `01-docs/05-audit/auto-dev-state.md`.
