---
title: 'INF-86 ecosystem critical path — pointer (step 4)'
status: current
date: 2026-06-03
owner: gtcx-operations
document_id: COORD-OPS-CP-INF86-001
review_cycle: on-change
---

# INF-86 ecosystem critical path — gtcx-operations

**Do not fork message bodies.** Canonical copy/paste and ordering live on **gtcx-protocols**:

| Resource | URL / path |
| --- | --- |
| **Messages hub** | https://github.com/gtcx-ecosystem/gtcx-protocols/tree/main/docs/coordination/messages |
| **Critical path doc** | `gtcx-protocols/docs/coordination/ECOSYSTEM-CRITICAL-PATH-INF-86-2026-06-03.md` |
| **Hub register (read-only)** | `gtcx-docs` INF-86 register — updated when siblings close steps; **no implementation in gtcx-docs** |

## Ordered steps (sibling repos — not hub)

| Step | Owner | Work | gtcx-operations role |
| --- | --- | --- | --- |
| **1** | gtcx-infrastructure | XR-402 terraform + SPKI → post protocols **#61** | **None** — no KMS/Terraform |
| **2** | gtcx-protocols | XR-403 `bog.json` after SPKI ready | **None** — read-only verify |
| **3** | baseline-os | `ecosystem:repo:report-work` per message | **None** — ops does not run baseline-os CLI |
| **4** | **gtcx-operations** | Optional compliance mirror | **Done** — see below |

**Parallel (done):** gtcx-agentic XR-401-A/B/C evidence on protocols `main`.

## Step 4 — what we did

| Deliverable | Path | Status |
| --- | --- | --- |
| Pointer (A/B/C) | [`from-gtcx-protocols-inf-86-agentic-attestations-2026-06-03.md`](./from-gtcx-protocols-inf-86-agentic-attestations-2026-06-03.md) | Done |
| Compliance register | [`../operations/compliance/attestation-register.yaml`](../operations/compliance/attestation-register.yaml) | XR-401-A/B/C mirrored |
| Sync command | `pnpm sync:agentic-attestation` | Done |
| Procurement wording | [`../operations/compliance/procurement-attestation-wording.md`](../operations/compliance/procurement-attestation-wording.md) | Done |

**Canonical message (protocols):** [`MESSAGE-gtcx-operations-compliance-mirror-2026-06-03.md`](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/coordination/messages/MESSAGE-gtcx-operations-compliance-mirror-2026-06-03.md)

## Refresh after siblings close items

When protocols `main` gains new INF-86 evidence (e.g. post–XR-402 SPKI, post–XR-403):

```bash
pnpm sync:agentic-attestation
pnpm validate
```

Add register rows only for artifacts that exist under `gtcx-protocols/docs/audit/evidence/` — do not invent URIs.

## Verify (read-only)

```bash
cd ../gtcx-protocols
pnpm check:inf86-xr401-preceremony
```

## Out of scope (explicit)

- gtcx-infrastructure issue #86 / #61 posts
- XR-403 CSP apply or `bog.json` edits
- `baseline-os` report-work commands
- Product or runner code in gtcx-docs hub
