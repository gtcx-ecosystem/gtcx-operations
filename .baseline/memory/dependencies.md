# Cross-Repo Dependencies

> Auto-discovered + Protocol 24 blockers. Refresh when OPS stories change upstream needs.

## Hard Dependencies (Blocking)

| Needs | From Repo | Status | Story | Blocking |
| --- | --- | --- | --- | --- |
| ClickUp list ID for gtcx-operations | baseline-os (`clickup-mapping.json`) | open | OPS-02 | Yes |
| Event bus publish API | gtcx-core | planned | OPS-08 | Yes (Q3) |
| Investor portal notification ingest | gtcx-markets | planned | OPS-09 | Yes (Q3) |
| INF-86 attestation evidence | gtcx-protocols | satisfied | OPS-01 | No |
| Attestation runners | gtcx-agentic | satisfied | OPS-01 | No |

## Soft Dependencies (Nice to have)

| Needs | From Repo | Status |
| --- | --- | --- |
| Coordination sprint reports | baseline-os | available |
| Contract AI review | griot-ai | icebox |
| Nyota event sharing | nyota-ai | icebox |

## Downstream Consumers

| Repo | What They Need | Status |
| --- | --- | --- |
| gtcx-markets | Investor notifications, email delivery | planned Q3 |
| baseline-os | Sprint commitments, work reports | ongoing |
| compliance-os | Legal contract feeds | ongoing |
| gtcx-agentic | Ops events orchestration | planned |

## Coordination paths

| Direction | Path pattern |
| --- | --- |
| Outbound tickets | `docs/coordination/to-<repo>-<topic>-YYYY-MM-DD.md` |
| Inbound pointers | `docs/coordination/from-<repo>-<topic>-YYYY-MM-DD.md` |

---
*Protocol 24 — update when filing P0 tickets or closing blockers.*
