---
title: 'Cross-Repo Coordination (Protocol 24)'
status: current
date: 2026-06-03
owner: gtcx-operations
document_id: OPS-P24-001
protocol: gtcx-docs/01-docs/governance/protocols/24-cross-repo-coordination/protocol.md
review_cycle: on-change
---

# Cross-Repo Coordination — Protocol 24

**Normative spec:** `gtcx-docs/01-docs/governance/protocols/24-cross-repo-coordination/protocol.md`

**Layer:** Tier 2/3 hybrid — corporate operations satellite with platform integrations.

## This repo owns

- Local roadmap and OPS-* story execution
- Compliance mirrors (`01-docs/04-ops/compliance/`, `01-docs/06-coordination/`)
- Corporate domain data (legal, finance, CRM, comms)

## Link only (do not duplicate)

| Artifact | Canonical location |
| --- | --- |
| Coordination report | `baseline-os/workstream/coordination/coordination-report-latest.md` |
| INF-86 evidence | `gtcx-protocols/01-docs/05-audit/evidence/` |
| Agentic trust runners | `gtcx-agentic/agents/reviewers/trust-attestation/` |
| Deployment proof index | `gtcx-protocols/01-docs/05-audit/evidence/deployment-proof-index.md` |

## Ticket naming

| Direction | Pattern |
| --- | --- |
| Outbound | `01-docs/06-coordination/to-<repo>-<topic>-YYYY-MM-DD.md` |
| Inbound | `01-docs/06-coordination/from-<repo>-<topic>-YYYY-MM-DD.md` |

## P0 escalation (same session)

1. Update [`.baseline/memory/dependencies.md`](../../.baseline/memory/dependencies.md).
2. File coordination doc under `01-docs/06-coordination/`.
3. From `baseline-os`: `pnpm ecosystem:repo:report-work --repo=gtcx-operations --item="P0: …" --status=blocked`.
4. Record path in `01-docs/05-audit/auto-dev-state.md` and `.baseline/memory/session.md`.

**Do not** end session with P0 blocker only in chat. **Do not** copy outbound ack into multiple repos.

## Active coordination docs

| Doc | Target |
| --- | --- |
| [ECOSYSTEM-CRITICAL-PATH-INF-86-POINTER.md](../coordination/ECOSYSTEM-CRITICAL-PATH-INF-86-POINTER.md) | INF-86 step 4 — mirror only |
| [from-gtcx-protocols-inf-86-agentic-attestations-2026-06-03.md](../coordination/from-gtcx-protocols-inf-86-agentic-attestations-2026-06-03.md) | protocols / agentic |
| [from-gtcx-protocols-agentic-trust-2026-06-03.md](../coordination/from-gtcx-protocols-agentic-trust-2026-06-03.md) | XR-401-A detail |

**Messages SoR:** https://github.com/gtcx-ecosystem/gtcx-protocols/tree/main/01-docs/06-coordination/messages (`ff21706a+`)  
**One-pager:** `gtcx-protocols/01-docs/06-coordination/ECOSYSTEM-CRITICAL-PATH-INF-86-2026-06-03.md` — do not duplicate bodies in this repo.
