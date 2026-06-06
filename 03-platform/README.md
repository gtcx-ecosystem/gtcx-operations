# 03-platform

**Purpose:** Corporate-ops domain data, TypeScript schemas/clients, automation scripts, and tests for `gtcx-operations`.

| Concern | Path |
| ------- | ---- |
| Domain SoR (legal, finance, CRM, …) | `legal/`, `finance/`, `crm/`, `email/`, `whatsapp/`, … |
| Zod schemas + API clients | `src/schemas/`, `src/utils/` |
| CLI automation | `scripts/` |
| Unit tests | `tests/` |
| Shared assets | `assets/` |

**Not here:** Narrative docs (`01-docs/`), machine ops manifests (`02-ops/`), deploy artifacts (`04-deploy/`), audit entry (`05-audit/`), sprint plane (`06-workstream/`).

**Related:** [`config/ops.manifest.json`](../config/ops.manifest.json) · [`config/toolchain/`](../config/toolchain/) · [`AGENTS.md`](../AGENTS.md)
