# AGENTS.md — GTCX Operations

> **Applies to:** ALL AI agents operating on this repo
> **Date:** 2026-05-17
> **Version:** 1.0
## 1.5 GTCX Institutional Baseline

This repo operates within the GTCX ecosystem. All agents must reference the canonical organizational baseline:

| Resource | Canonical Path | Document ID |
|----------|---------------|-------------|
| Baseline Overview | `gtcx-docs/docs/governance/institutional/README.md` | INST-001 |
| Baseline JSON | `gtcx-docs/docs/governance/institutional/gtcx-baseline.json` | INST-002 |
| Agent Startup Protocol | `gtcx-docs/docs/governance/institutional/agent-startup-protocol.md` | INST-003 |
| Personas | `gtcx-docs/docs/governance/institutional/personas/` | INST-P-001–007 |
| Lexicon | `gtcx-docs/docs/governance/institutional/lexicon/` | INST-L-001–003 |
| Frames | `gtcx-docs/docs/governance/institutional/frames/` | INST-F-001–004 |
| Deliverables | `gtcx-docs/docs/governance/institutional/deliverables/` | INST-D-001–006 |
| Conventions | `gtcx-docs/docs/governance/institutional/conventions/` | INST-C-001–003 |

**Registry:** See `gtcx-docs/docs/governance/REGISTRY.md` for the full document index.

## 1.6 Agent Startup Protocol (MANDATORY)

Before making any code changes, architectural decisions, or recommendations, complete this sequence:

### Phase 1: Load Baseline (30 sec)
1. Read this `AGENTS.md` file (stack, commands, constraints)
2. Read `.baseline/definition.json` (repo config, terminology, authority)
3. Read institutional baseline: `gtcx-docs/docs/governance/institutional/README.md` *(if accessible)*

### Phase 2: Establish Repo Context (1 min)
4. Read `.baseline/memory/session.md` — last session, incomplete work, next steps
5. Read `.baseline/memory/patterns.md` — confirmed architectural patterns
6. Read `.baseline/memory/pitfalls.md` — known issues, anti-patterns, blockers
7. Read `.baseline/memory/dependencies.md` — cross-repo dependencies

*If .baseline/memory/ files are missing or empty, create them with discovered content.*

### Phase 3: Discover Current State (30 sec)
8. Run `git status` — uncommitted changes, modified files
9. Run `git log --oneline -10` — recent work, current branch
10. Check `workstream/` or `.baseline/memory/session.md` for active tasks

### Phase 4: Select Persona & Frame (30 sec)
11. Map task to persona: developer (default), trade-analyst, compliance-officer, field-inspector, protocol-engineer, platform-architect, product-strategist, security-engineer
12. Verify trust score ≥ persona threshold
13. Select frame: development (default), trading-floor, field-operations, regulatory-audit

### Phase 5: Attest & Begin (30 sec)
14. Summarize context in 3–5 sentences
15. Add attestation block to commit/PR:
```markdown
## Agent Context Attestation
- [x] Phase 1: Baseline loaded
- [x] Phase 2: Repo context established
- [x] Phase 3: Current state discovered
- [x] Phase 4: Persona & frame selected
- [x] Phase 5: Context attested
```

### Context Refresh (every 2 hours or task switch)
- Re-read `.baseline/memory/session.md`
- Re-check `git status`
- Re-read `.baseline/memory/pitfalls.md`
- Update `session.md` if state changed

**Full protocol:** `gtcx-docs/docs/governance/institutional/agent-startup-protocol.md`

---


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
- **Email:** `agent@gtcx.trade`
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

## Coordination Contract

This repo operates as a **Tier 2/3 hybrid** — corporate operations satellite with platform-level integrations.

| Element | Detail |
|---------|--------|
| **Tier** | Tier 2/3 hybrid (not yet formally declared) |
| **Coordination hub** | `baseline-os/workstream/coordination/` |
| **Reporting** | `pnpm ecosystem:repo:report-work` → updates `baseline-os/workstream/coordination/coordination-report-latest.md` |
| **Blocker query** | Read `baseline-os/workstream/coordination/coordination-report-latest.md` |
| **Builder trust** | ≥70 |
| **Ecosystem graph** | Consumes `gtcx-agile/dist/ecosystem-graph.js` for repo dependency mapping |
| **Health monitoring** | `pnpm ecosystem:health` → generates `workstream/ecosystem-health.json` and `workstream/ecosystem-health.md` |

**Agent workflow:**
1. Run `pnpm ecosystem:health` to assess ecosystem state
2. Report blockers to `baseline-os/workstream/coordination/`
3. Query `baseline-os` for cross-repo dependencies before making changes

## Quality Gates

- `pnpm validate` — Schema validation for all YAML/JSON contracts
- `pnpm lint:policies` — Check policy frontmatter completeness
- `pnpm check:budgets` — Variance analysis and alerts
\n## Credential Access\n\nThe credential vault is managed by **gtcx-agentic** (consumes `@baselineos/vault` from baseline-os).\n\nAgents access credentials via the MCP tool:\n\n```\nTool: baseline_vault\n  action: "list"     → show available credentials and trust requirements\n  action: "get"      → retrieve a value (requires: name, agentId)\n  action: "status"   → vault health check\n```\n\nThe vault is centrally located at `~/.baseline/vault` (SQLite, AES-256 encrypted).\nTrust-score gated. All access is audited.\n\nStandard env vars: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `DATABASE_URL`, `REDIS_URL`, `BASELINE_MASTER_KEY`.\n\nNever commit secrets. Never ask users for credentials in chat.\nRead Protocol 19 (`gtcx-docs/docs/governance/protocols/19-agent-credential-access/protocol.md`) for the full standard.