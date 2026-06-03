---
title: 'Procurement — agentic attestation external wording'
status: current
date: 2026-06-03
owner: gtcx-operations
document_id: OPS-PROC-ATR-001
review_cycle: on-change
---

# Procurement & vendor questionnaire — attestation wording

Use when INF-86 / XR-401-A used the **agentic** path (not a human CISO signature on KMS ceremony).

## Checklist (required before external pack)

- [ ] Do **not** claim “CISO personally signed” if only XR-401-A agentic path was used
- [ ] Use: **“Algorithm approval recorded per COORD-ATR-001 agentic attestation artifact”**
- [ ] Link evidence: `gtcx-protocols/docs/audit/evidence/inf-86-xr-401-agentic-attestation-latest.json`
- [ ] Cite mirror row: [`attestation-register.yaml`](./attestation-register.yaml) (`work_id: XR-401-A`)
- [ ] Implementation owner for runners: **gtcx-agentic** (not gtcx-operations)

## Canonical references

| Doc | Path |
| --- | --- |
| COORD-ATR-001 spec | `gtcx-protocols/docs/coordination/agentic-trust-roles-24x7-2026-06-03.md` |
| CSP trust status | `gtcx-protocols/docs/gtm/csp-trust-status.md` |
| Operations pointer | [`../../coordination/from-gtcx-protocols-agentic-trust-2026-06-03.md`](../../coordination/from-gtcx-protocols-agentic-trust-2026-06-03.md) |

## SOC 2 mapping

| Control | How this artifact supports |
| --- | --- |
| CC8.1 Change management | Records algorithm approval decision + evidence hash before infra ceremony |
