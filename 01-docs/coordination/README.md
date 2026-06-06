---
title: 'Coordination — cross-repo pickup (mirror)'
status: current
date: 2026-06-03
owner: gtcx-operations
document_id: COORD-OPS-001
review_cycle: on-change
---

# Coordination (`01-docs/coordination`)

Cross-repo specs are authored in **gtcx-protocols** per Protocol 24. This repo holds **implementation pointers** and **compliance mirrors** only — not runtime trust runners.

## INF-86 ecosystem critical path (step 4 of 4)

**Canonical SoR:** https://github.com/gtcx-ecosystem/gtcx-protocols/tree/main/01-docs/06-coordination/messages (`gtcx-protocols` `ff21706a+`)

**One-pager:** [ECOSYSTEM-CRITICAL-PATH-INF-86-2026-06-03.md](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/01-docs/06-coordination/ECOSYSTEM-CRITICAL-PATH-INF-86-2026-06-03.md)

| Step | Owner | Ops role | Now |
| --- | --- | --- | --- |
| 1 | gtcx-infrastructure | XR-402 → protocols #61 — **not us** | **Infra’s turn** (real `spki_sha256`) |
| 2 | gtcx-protocols | XR-403 after SPKI — **not us** | **Standing by** |
| 3 | baseline-os | report-work — **not us** | Waiting on evidence |
| 4 | **gtcx-operations** | Optional compliance mirror — **[done](./ECOSYSTEM-CRITICAL-PATH-INF-86-POINTER.md)** | Mirror complete |

Hub `gtcx-docs` INF-86 register: update when siblings close steps; link to `messages/` only — no Terraform, CSP, runners, or product code in gtcx-docs.

## Index

| Doc | Purpose |
| --- | --- |
| [from-gtcx-protocols-inf-86-agentic-attestations-2026-06-03.md](./from-gtcx-protocols-inf-86-agentic-attestations-2026-06-03.md) | **INF-86 XR-401 A/B/C** — mirror index + verify commands |
| [to-sensei-ai-agent-scope-incident-2026-06-06.md](./to-sensei-ai-agent-scope-incident-2026-06-06.md) | **Outbound** — ops agent scope violation witness (sensei-ai recovery owned there) |
| [agent-feedback-gtcx-operations-pointer.md](./agent-feedback-gtcx-operations-pointer.md) | **Pointer** — layout v3 agent feedback (canonical in gtcx-agentic) |
| [from-gtcx-protocols-agentic-trust-2026-06-03.md](./from-gtcx-protocols-agentic-trust-2026-06-03.md) | XR-401-A detail + pickup checklist |
| [Protocol adoption registry](../operations/protocol-adoption-registry.md) | P19, P22, P24, P26, P27, COORD-ATR-001 |

## Canonical hub (read-only)

| Artifact | Location |
| --- | --- |
| Coordination index | `gtcx-protocols/01-docs/06-coordination/README.md` |
| Critical path one-pager | `gtcx-protocols/01-docs/06-coordination/ECOSYSTEM-CRITICAL-PATH-INF-86-2026-06-03.md` |
| Messages hub | `gtcx-protocols/01-docs/06-coordination/messages/` |
| Full spec (COORD-ATR-001) | `gtcx-protocols/01-docs/06-coordination/agentic-trust-roles-24x7-2026-06-03.md` |
| Evidence (A/B/C) | `gtcx-protocols/01-docs/05-audit/evidence/inf-86-xr-401*-latest.json` |
| Implementation owner | **gtcx-agentic** (`agents/reviewers/trust-attestation/`) |

Do not copy protocol source into this repo; link only.
