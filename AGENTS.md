# AGENTS.md — GTCX Operations

> **Applies to:** ALL AI agents operating on this repo
> **Date:** 2026-05-17
> **Version:** 1.0

## What This Is

GTCX Operations is the corporate functions layer of the GTCX ecosystem. It houses legal contracts, HR policies, financial budgets, IP assets, fundraising pipelines, and operational runbooks — all in machine-actionable formats.

## Stack

- **Language:** TypeScript 5.x + Node.js 22
- **Package Manager:** pnpm
- **Schema:** JSON Schema for contracts, policies, budgets
- **Templates:** Handlebars for contract generation

## Conventions

1. **Contracts** — Store as YAML frontmatter + markdown body. Use `legal/contracts/` with naming: `{type}-{party}-{date}.md`
2. **Policies** — Versioned markdown with `version`, `effective_date`, `owner` in frontmatter
3. **Budgets** — YAML files in `finance/budgets/` with quarters as top-level keys
4. **IP Assets** — JSON registry in `ip/assets.json` with patent/trademark/secret entries
5. **Fundraising** — Deal pipeline as YAML in `fundraising/pipeline.yaml`
6. **Runbooks** — Markdown in `ops/runbooks/` with `trigger`, `steps`, `escalation` fields

## Agent Identity

All automated commits from this repo are authored by:
- **Name:** `gtcx-agent`
- **Email:** `agent@gtcx.io`
- **GitHub:** [@gtcx-agent](https://github.com/gtcx-agent)

This account is used for:
- Scheduled workflow commits (budget sync, contract generation)
- ClickUp sprint pushes
- Coordination report updates
- Automated policy validations

Human commits should use your personal identity.

## Agent Roles

| Role | Identity | Responsibilities | Example Tasks |
|------|----------|-----------------|---------------|
| **Legal Agent** | `gtcx-agent` | Draft, review, track contracts | Generate NDA, check contract expiry |
| **Finance Agent** | `gtcx-agent` | Budget tracking, variance alerts | Update Q2 budget, flag overspend |
| **HR Agent** | `gtcx-agent` | Policy updates, role definitions | Add new role template, update handbook |
| **IP Agent** | `gtcx-agent` | Asset registry, filing deadlines | Track patent deadlines, update registry |
| **Fundraising Agent** | `gtcx-agent` | Pipeline updates, investor comms | Update deal stage, generate update email |
| **Ops Agent** | `gtcx-agent` | Runbook execution, incident tracking | Create incident log, update vendor list |

## Cross-Repo Integration

- **BaselineOS** — Governance policies sync to `baseline-os/docs/governance/`
- **GTCX Core** — Financial events feed into `gtcx-core` ledger
- **Compliance OS** — Legal contracts feed compliance checks
- **Agentic** — All functions expose events to `gtcx-agentic` orchestration

## Quality Gates

- `pnpm validate` — Schema validation for all YAML/JSON contracts
- `pnpm lint:policies` — Check policy frontmatter completeness
- `pnpm check:budgets` — Variance analysis and alerts
