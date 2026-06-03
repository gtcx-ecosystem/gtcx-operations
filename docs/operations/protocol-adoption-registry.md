---
title: 'GTCX Protocol Adoption Registry — gtcx-operations'
status: current
date: 2026-06-03
owner: gtcx-operations
document_id: OPS-PROTO-001
review_cycle: quarterly
---

# Protocol adoption registry

Protocols required for agents operating on this repo. Hub: `gtcx-docs/docs/governance/protocols/`.

| ID | Protocol | Status | Repo artifact | Verify |
| --- | --- | --- | --- | --- |
| INST-003 | Agent startup | **established** | `AGENTS.md` §1.6, Phases 5.4–5.7 | Startup attestation in PR |
| P19 | Credential access | **established** | `AGENTS.md` (vault MCP) | No secrets in git |
| P22 | Agent work selection | **established** | [`agent-work-selection.md`](./agent-work-selection.md) | `pnpm agent:work-selection:check` |
| P24 | Cross-repo coordination | **established** | [`cross-repo-coordination.md`](./cross-repo-coordination.md) | `docs/coordination/` + `dependencies.md` |
| P26 | Proceed confirmation | **referenced** | `AGENTS.md` Phase 5.6 | Proceed brief in session |
| P27 | Execution obligation | **established** | [`agent-execution-obligation.md`](./agent-execution-obligation.md) | `pnpm agent:verify-ladder` |
| COORD-ATR-001 | Agentic trust roles (INF-86) | **mirror** | [`docs/coordination/`](../coordination/) | `pnpm sync:agentic-attestation` |
| COORD-CP-INF86 | INF-86 critical path (step 4) | **done** | [`ECOSYSTEM-CRITICAL-PATH-INF-86-POINTER.md`](../coordination/ECOSYSTEM-CRITICAL-PATH-INF-86-POINTER.md) | Link only — messages on protocols |

## Not owned here

| Item | Owner repo |
| --- | --- |
| XR-401 attestation runners | gtcx-agentic |
| KMS / Terraform ceremony | gtcx-infrastructure |
| Protocol CSP / bog.json | gtcx-protocols |
| Constitution / REGISTRY host | gtcx-docs |

## Session opener (all protocols)

See [`AGENT-PROTOCOL-22-BRIEF.md`](./AGENT-PROTOCOL-22-BRIEF.md) plus INST-003 Phases 1–5.7 in `AGENTS.md`.
