---
title: 'INF-86 ecosystem critical path — pointer (step 4)'
status: current
date: 2026-06-03
owner: gtcx-operations
document_id: COORD-OPS-CP-INF86-001
review_cycle: on-change
protocols_canonical_commit: ff21706a
---

# INF-86 ecosystem critical path — gtcx-operations

**Do not fork message bodies.** Canonical copy/paste and ordering live on **gtcx-protocols** (`ff21706a` and later on `main`).

| Resource | URL / path |
| --- | --- |
| **AI-native trust (all repos)** | https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/coordination/inf-86-ai-native-trust-model-ecosystem-2026-06-03.md |
| **Messages SoR (canonical)** | https://github.com/gtcx-ecosystem/gtcx-protocols/tree/main/docs/coordination/messages |
| **One-pager** | [`ECOSYSTEM-CRITICAL-PATH-INF-86-2026-06-03.md`](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/coordination/ECOSYSTEM-CRITICAL-PATH-INF-86-2026-06-03.md) |
| **Local checkout** | `../gtcx-protocols/docs/coordination/ECOSYSTEM-CRITICAL-PATH-INF-86-2026-06-03.md` |
| **Hub register (read-only)** | `gtcx-docs` INF-86 register — update when siblings close steps; **no Terraform, CSP, runners, or product code in gtcx-docs** — link to `messages/` only |

## Ecosystem state (2026-06-03)

| Step | Owner | Status | gtcx-operations |
| --- | --- | --- | --- |
| **1** | gtcx-infrastructure | **Active** — XR-402 + real `spki_sha256` on protocols **#61** | None |
| **2** | gtcx-protocols | **Standing by** — XR-403 after SPKI ready (`.der` not in git) | None — read-only verify |
| **3** | baseline-os | **Waiting** — `ecosystem:repo:report-work` after evidence merges | None |
| **4** | gtcx-operations | **Done** — optional compliance mirror | This repo |

**Protocols trigger:** Infra posts #61 with real `spki_sha256` from `shasum -a 256 /secure/gh-bog.pub.der` → protocols SPKI ready → XR-403. Placeholder #61 posts do not start XR-403 ([locked response message](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/coordination/messages/MESSAGE-gtcx-protocols-issue-61-locked-response-2026-06-03.md)).

**Parallel (done):** gtcx-agentic XR-401-A/B/C — [`MESSAGE-gtcx-agentic-handoff-complete-2026-06-03.md`](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/coordination/messages/MESSAGE-gtcx-agentic-handoff-complete-2026-06-03.md).

## Ordered steps (sibling repos — not hub)

| Step | Owner | Work | Message |
| --- | --- | --- | --- |
| **1** | gtcx-infrastructure | XR-402 terraform + SPKI → post protocols **#61** | [`MESSAGE-gtcx-infrastructure-issue-61-spki-2026-06-03.md`](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/coordination/messages/MESSAGE-gtcx-infrastructure-issue-61-spki-2026-06-03.md) |
| **2** | gtcx-protocols | XR-403 `bog.json` after SPKI ready | `pnpm coordination:xr-403-checklist` (protocols) |
| **3** | baseline-os | `ecosystem:repo:report-work` | [`MESSAGE-baseline-os-report-work-2026-06-03.md`](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/coordination/messages/MESSAGE-baseline-os-report-work-2026-06-03.md) |
| **4** | **gtcx-operations** | Optional compliance mirror | [`MESSAGE-gtcx-operations-compliance-mirror-2026-06-03.md`](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/coordination/messages/MESSAGE-gtcx-operations-compliance-mirror-2026-06-03.md) |

## Step 4 — what we did

| Deliverable | Path | Status |
| --- | --- | --- |
| Pointer (A/B/C) | [`from-gtcx-protocols-inf-86-agentic-attestations-2026-06-03.md`](./from-gtcx-protocols-inf-86-agentic-attestations-2026-06-03.md) | Done |
| Compliance register | [`../operations/compliance/attestation-register.yaml`](../operations/compliance/attestation-register.yaml) | XR-401-A/B/C mirrored |
| Sync command | `pnpm sync:agentic-attestation` | Done |
| Procurement wording | [`../operations/compliance/procurement-attestation-wording.md`](../operations/compliance/procurement-attestation-wording.md) | Done |

## Refresh after siblings close items

When protocols `main` gains new INF-86 evidence (post–XR-402 SPKI, post–XR-403):

```bash
pnpm sync:agentic-attestation
pnpm validate
```

Add register rows only for artifacts under `gtcx-protocols/docs/audit/evidence/` — do not invent URIs.

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
