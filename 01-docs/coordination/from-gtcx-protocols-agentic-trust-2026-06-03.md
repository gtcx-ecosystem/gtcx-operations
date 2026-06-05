---
title: 'Agentic trust roles — operations mirror (INF-86 XR-401-A)'
status: current
date: 2026-06-03
owner: gtcx-operations
document_id: COORD-OPS-ATR-001
pickup_from: gtcx-protocols/01-docs/06-coordination/to-gtcx-operations-pickup-2026-06-03.md
review_cycle: on-change
---

# Agentic trust roles — gtcx-operations mirror

**Canonical spec:** `gtcx-protocols/01-docs/06-coordination/agentic-trust-roles-24x7-2026-06-03.md` (COORD-ATR-001)

**Implementation owner:** **gtcx-agentic** — 24/7 `security-engineer` + `platform-architect` runners, vault policy, attestation merge to protocols evidence sink.

**This repo's role:** Corporate/compliance **mirror only** (SOC 2, vendor questionnaires, policy register). Operations does **not** approve KMS, run Terraform, or edit protocol CSPs.

---

## Model (one line)

| Layer | Repo | Artifact |
| --- | --- | --- |
| Home (runners) | gtcx-agentic | `agents/reviewers/trust-attestation/` |
| Sink (SoR) | gtcx-protocols | `01-docs/05-audit/evidence/inf-86-xr-401-agentic-attestation-latest.json` |
| Mirror (this repo) | gtcx-operations | [`01-docs/04-ops/compliance/attestation-register.yaml`](../operations/compliance/attestation-register.yaml) |
| Ceremony | gtcx-infrastructure | After XR-401-A gate passes |

**Gate (protocols):** `pnpm check:inf86-xr401-attestation` (A); full preceremony: `pnpm check:inf86-xr401-preceremony` (A+B+C).

**All three work IDs:** see [from-gtcx-protocols-inf-86-agentic-attestations-2026-06-03.md](./from-gtcx-protocols-inf-86-agentic-attestations-2026-06-03.md).

---

## Operations deliverables

| Item | Path | Status |
| --- | --- | --- |
| Pointer doc | This file | Done |
| Compliance register | [`attestation-register.yaml`](../operations/compliance/attestation-register.yaml) | Seeded XR-401-A |
| Procurement wording | [`procurement-attestation-wording.md`](../operations/compliance/procurement-attestation-wording.md) | Done |
| Zod mirror schema | `03-platform/src/schemas/agentic-attestation.ts` | Done |
| Sync from protocols evidence | `pnpm sync:agentic-attestation` | Done |

---

## Refresh register after new attestation

When protocols `main` updates `inf-86-xr-401-agentic-attestation-latest.json`:

```bash
# From gtcx-operations (sibling checkout)
pnpm sync:agentic-attestation

# Or explicit path
PROTOCOLS_ROOT=/path/to/gtcx-protocols pnpm sync:agentic-attestation
```

Then validate: `pnpm validate`

Optional: `pnpm clickup:sync` if list ID configured — task name pattern `INF-86 XR-401 recorded`.

---

## Related pickup docs (protocols)

| Repo | Pickup |
| --- | --- |
| gtcx-agentic | `gtcx-protocols/01-docs/06-coordination/to-gtcx-agentic-pickup-2026-06-03.md` |
| gtcx-operations | `gtcx-protocols/01-docs/06-coordination/to-gtcx-operations-pickup-2026-06-03.md` |
| gtcx-infrastructure | `gtcx-protocols/01-docs/04-ops/coordination/to-gtcx-infrastructure-inf-86-ceremony-2026-06-03.md` |

---

## Agent context attestation (pickup)

- [x] Read protocols pickup — operations is consumer, not runner home
- [x] Pointer + compliance register — no KMS logic in this repo
- [x] Link COORD-ATR-001 for external wording (procurement checklist)
