---
title: 'Corporate domain map'
status: current
date: 2026-06-06
owner: gtcx-operations
---

# Corporate domain map — gtcx-operations

Quick lookup: data → schema → validate → CLI.

| Domain | Data (SoR) | Schema | Validate | CLI |
| ------ | ---------- | ------ | -------- | --- |
| **Legal** | `legal/contracts/`, `legal/policies/` | `src/schemas/contract.ts` | `pnpm validate` | `pnpm generate:contract` |
| **HR** | `hr/policies/` | `src/schemas/contract.ts` (policy) | `pnpm validate` | `pnpm lint:policies` |
| **Finance** | `finance/budgets/*.yaml` | `src/schemas/budget.ts` | `pnpm validate` | `pnpm check:budgets`, `pnpm sync:budgets` |
| **IP** | `ip/*.json` | `src/schemas/ip-asset.ts` | `pnpm validate` | `pnpm ip:check` |
| **Fundraising** | `fundraising/` | `src/schemas/fundraising.ts` | `pnpm validate` | `pnpm pipeline:status` |
| **CRM** | `crm/*.json` | `src/schemas/crm.ts` | `pnpm validate` | `pnpm crm:report`, `pnpm crm:sync-google` |
| **Email** | `email/` | `src/schemas/email.ts` | `pnpm validate` | `pnpm email:send` |
| **WhatsApp** | `whatsapp/` | `src/schemas/whatsapp.ts` | `pnpm validate` | `pnpm whatsapp:send` |
| **Threads** | `threads/registry.json` | `src/schemas/thread.ts` | — | `pnpm threads:build` |
| **Orchestration** | `orchestration/` | thread rules in script | — | `pnpm orchestrate` |
| **Attestation** | `01-docs/operations/compliance/attestation-register.yaml` | `src/schemas/agentic-attestation.ts` | `pnpm validate` | `pnpm sync:agentic-attestation` |

**Hub layout:** domain YAML/JSON under `03-platform/{domain}/` · automation in `03-platform/scripts/` · tests in `03-platform/tests/`.

**Machine ops:** PM/coordination/attestation JSON → `02-ops/`.
