---
title: 'Coordination — cross-repo pickup (mirror)'
status: current
date: 2026-06-03
owner: gtcx-operations
document_id: COORD-OPS-001
review_cycle: on-change
---

# Coordination (`docs/coordination`)

Cross-repo specs are authored in **gtcx-protocols** per Protocol 24. This repo holds **implementation pointers** and **compliance mirrors** only — not runtime trust runners.

## INF-86 ecosystem critical path (step 4 of 4)

**Canonical messages (do not fork):** https://github.com/gtcx-ecosystem/gtcx-protocols/tree/main/docs/coordination/messages

| Step | Owner | Ops role |
| --- | --- | --- |
| 1 | gtcx-infrastructure | XR-402 → protocols #61 — **not us** |
| 2 | gtcx-protocols | XR-403 after SPKI — **not us** |
| 3 | baseline-os | report-work — **not us** |
| 4 | **gtcx-operations** | Optional compliance mirror — **[done](./ECOSYSTEM-CRITICAL-PATH-INF-86-POINTER.md)** |

Hub `gtcx-docs` INF-86 register stays current when siblings close items; no product implementation in gtcx-docs.

## Index

| Doc | Purpose |
| --- | --- |
| [from-gtcx-protocols-inf-86-agentic-attestations-2026-06-03.md](./from-gtcx-protocols-inf-86-agentic-attestations-2026-06-03.md) | **INF-86 XR-401 A/B/C** — mirror index + verify commands |
| [from-gtcx-protocols-agentic-trust-2026-06-03.md](./from-gtcx-protocols-agentic-trust-2026-06-03.md) | XR-401-A detail + pickup checklist |
| [Protocol adoption registry](../operations/protocol-adoption-registry.md) | P19, P22, P24, P26, P27, COORD-ATR-001 |

## Canonical hub (read-only)

| Artifact | Location |
| --- | --- |
| Coordination index | `gtcx-protocols/docs/coordination/README.md` |
| Full spec (COORD-ATR-001) | `gtcx-protocols/docs/coordination/agentic-trust-roles-24x7-2026-06-03.md` |
| Evidence (A/B/C) | `gtcx-protocols/docs/audit/evidence/inf-86-xr-401*-latest.json` |
| Implementation owner | **gtcx-agentic** (`agents/reviewers/trust-attestation/`) |

Do not copy protocol source into this repo; link only.
