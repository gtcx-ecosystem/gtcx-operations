---
title: 'INF-86 agentic attestations — operations compliance mirror'
status: current
date: 2026-06-03
owner: gtcx-operations
document_id: COORD-OPS-INF86-001
pickup_from: gtcx-protocols/docs/coordination/to-gtcx-operations-pickup-2026-06-03.md
review_cycle: on-change
---

# From gtcx-protocols — agentic INF-86 attestations ready to mirror

**Do not run KMS or Terraform.** Mirror URIs + SHA-256 into the compliance register only.

**Implementation owner:** **gtcx-agentic** (runners, vault, 24/7 schedule).  
**Evidence SoR:** **gtcx-protocols** `docs/audit/evidence/`.  
**This repo:** [`attestation-register.yaml`](../operations/compliance/attestation-register.yaml) + procurement wording.

---

## Evidence paths (gtcx-protocols `main`)

| Work ID | Evidence path |
| --- | --- |
| **XR-401-A** | `docs/audit/evidence/inf-86-xr-401-agentic-attestation-latest.json` |
| **XR-401-B** | `docs/audit/evidence/inf-86-xr-401b-custodian-roster-latest.json` |
| **XR-401-C** | `docs/audit/evidence/inf-86-xr-401c-ceremony-authorization-latest.json` |

Canonical spec: `gtcx-protocols/docs/coordination/agentic-trust-roles-24x7-2026-06-03.md` (COORD-ATR-001)

---

## Mirror refresh

```bash
# gtcx-operations
pnpm sync:agentic-attestation
pnpm validate
```

Requires sibling checkout `../gtcx-protocols` or `PROTOCOLS_ROOT=/path/to/gtcx-protocols`.

---

## Verify (read-only — protocols repo)

```bash
cd gtcx-protocols
pnpm check:inf86-xr401-preceremony
```

Runs A + B + C attestation gates. Expected when evidence is on `main`: exit 0, message `A+B+C attestations ready for XR-402`.

Individual gates:

| Command | Work ID |
| --- | --- |
| `pnpm check:inf86-xr401-attestation` | XR-401-A |
| `pnpm check:inf86-xr401b-custodian-roster` | XR-401-B |
| `pnpm check:inf86-xr401c-ceremony-authorization` | XR-401-C |

---

## Out of scope (operations)

| Item | Owner |
| --- | --- |
| KMS / Terraform ceremony apply | gtcx-infrastructure |
| XR-403 `bog.json` | gtcx-protocols |
| Attestation runners | gtcx-agentic |
| `baseline_vault` custodian keys | gtcx-agentic + infra |

---

## Related

- [Coordination index](./README.md)
- [XR-401-A detail mirror](./from-gtcx-protocols-agentic-trust-2026-06-03.md)
- [Procurement wording](../operations/compliance/procurement-attestation-wording.md)
