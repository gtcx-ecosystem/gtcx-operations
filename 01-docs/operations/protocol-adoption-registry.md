---
title: 'GTCX Protocol Adoption Registry — gtcx-operations'
status: current
date: 2026-06-03
owner: gtcx-operations
document_id: OPS-PROTO-001
review_cycle: quarterly
---

# Protocol adoption registry

Protocols required for agents operating on this repo. Hub: `gtcx-docs/01-docs/governance/protocols/`.

| ID | Protocol | Status | Repo artifact | Verify |
| --- | --- | --- | --- | --- |
| INST-003 | Agent startup | **established** | `AGENTS.md` §1.6, Phases 5.4–5.7 | Startup attestation in PR |
| P19 | Credential access | **established** | [`agent-credential-access.md`](./agent-credential-access.md) | `pnpm agent:credentials:check` |
| P21 | UX documentation ops | **not-applicable** | [`agent-ux-documentation-ops.md`](./agent-ux-documentation-ops.md) | — |
| P22 | Agent work selection | **established** | [`agent-work-selection.md`](./agent-work-selection.md) | `pnpm agent:work-selection:check` |
| P24 | Cross-repo coordination | **established** | [`cross-repo-coordination.md`](./cross-repo-coordination.md) | `01-docs/06-coordination/` + `dependencies.md` |
| P26 | Proceed confirmation | **established** | [`agent-proceed-confirmation.md`](./agent-proceed-confirmation.md) | `pnpm agent:proceed-confirmation:check` |
| P27 | Execution obligation | **established** | [`agent-execution-obligation.md`](./agent-execution-obligation.md) | `pnpm agent:verify-ladder` |
| ALL | Unified gate | — | [`AGENT-PROTOCOL-ALL-BRIEF.md`](./AGENT-PROTOCOL-ALL-BRIEF.md) | `pnpm agent:protocols:check` |
| COORD-ATR-001 | Agentic trust roles (INF-86) | **mirror** | [`01-docs/06-coordination/`](../coordination/) | `pnpm sync:agentic-attestation` |
| COORD-CP-INF86 | INF-86 critical path (step 4) | **done** | [`ECOSYSTEM-CRITICAL-PATH-INF-86-POINTER.md`](../coordination/ECOSYSTEM-CRITICAL-PATH-INF-86-POINTER.md) | Canonical: protocols `messages/` (`ff21706a`) |

## Not owned here

| Item | Owner repo |
| --- | --- |
| XR-401 attestation runners | gtcx-agentic |
| KMS / Terraform ceremony | gtcx-infrastructure |
| Protocol CSP / bog.json | gtcx-protocols |
| Constitution / REGISTRY host | gtcx-docs |

## Session opener (all protocols)

See [`AGENT-PROTOCOL-ALL-BRIEF.md`](./AGENT-PROTOCOL-ALL-BRIEF.md) plus INST-003 Phases 1–5.7 in `AGENTS.md`.
