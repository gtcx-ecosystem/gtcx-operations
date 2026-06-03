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
15. **Phase 5.4:** Run `pnpm agent:next-work` — read [`docs/operations/agent-work-selection.md`](docs/operations/agent-work-selection.md); mark story `in_progress` in [`docs/strategy/execution-roadmap.md`](docs/strategy/execution-roadmap.md). **Do not ask the human which story to pick.**
16. **Phase 5.5:** If P0 blocked on a sibling repo, file `docs/coordination/to-<repo>-*.md` and update `.baseline/memory/dependencies.md` in this session ([Protocol 24](docs/operations/cross-repo-coordination.md)).
17. **Phase 5.6:** Issue Proceed Brief (one recommended action + because) unless user said **stop** or named a story ID ([Protocol 26](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/docs/governance/protocols/26-agent-proceed-confirmation/protocol.md)).
18. **Phase 5.7:** Run verification in-session (`pnpm validate`, `pnpm test`, `pnpm typecheck`) and report exit codes ([Protocol 27](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/docs/governance/protocols/27-agent-execution-obligation/protocol.md)).
19. Add attestation block to commit/PR:
```markdown
## Agent Context Attestation
- [x] Phase 1: Baseline loaded
- [x] Phase 2: Repo context established
- [x] Phase 3: Current state discovered
- [x] Phase 4: Persona & frame selected
- [x] Phase 5: Context attested
- [x] Phase 5.4: Next work unit selected via Protocol 22
- [x] Phase 5.5: Cross-repo gate (Protocol 24) — N/A or ticket filed
- [x] Phase 5.6: Proceed Brief issued (Protocol 26)
- [x] Phase 5.7: Verification ladder run with exit codes
```

## 1.7 Agent Work Selection (Protocol 22) — MANDATORY

Agents **must not** ask the operator what to build next when this repo has an execution roadmap.

| Resource | Path |
|----------|------|
| Ecosystem protocol | `gtcx-docs/docs/governance/protocols/22-agent-work-selection/protocol.md` |
| Repo manifest | [`docs/operations/agent-work-selection.md`](docs/operations/agent-work-selection.md) |
| Story register | [`docs/strategy/execution-roadmap.md`](docs/strategy/execution-roadmap.md) |
| Command | `pnpm agent:next-work` |
| Session pointer | [`docs/audit/auto-dev-state.md`](docs/audit/auto-dev-state.md) |
| Adoption registry | [`docs/operations/protocol-adoption-registry.md`](docs/operations/protocol-adoption-registry.md) |

**Rules:** Run `pnpm agent:next-work` after Phase 3; handoffs (H-CLICKUP, H-GW) outrank unrelated polish; refresh `auto-dev-state.md` after each story. **Forbidden:** asking which story to pick.

## 1.8 Cross-Repo Coordination (Protocol 24)

| Resource | Path |
|----------|------|
| Repo guide | [`docs/operations/cross-repo-coordination.md`](docs/operations/cross-repo-coordination.md) |
| Coordination docs | [`docs/coordination/`](docs/coordination/) |
| Dependencies | [`.baseline/memory/dependencies.md`](.baseline/memory/dependencies.md) |
| Hub report | `baseline-os/workstream/coordination/coordination-report-latest.md` |

P0 on sibling repo → ticket + `ecosystem:repo:report-work` in the **same session**. Link evidence; do not duplicate protocols source or deployment-proof-index.

## 1.9 Agent Proceed Confirmation (Protocol 26) — MANDATORY

Agents **recommend and proceed**; humans **stop**, **correct**, or supply a story ID.

| Resource | Path |
|----------|------|
| Ecosystem protocol | `gtcx-docs/docs/governance/protocols/26-agent-proceed-confirmation/protocol.md` |
| Repo manifest | [`docs/operations/agent-proceed-confirmation.md`](docs/operations/agent-proceed-confirmation.md) |
| Brief | [`docs/operations/AGENT-PROTOCOL-26-BRIEF.md`](docs/operations/AGENT-PROTOCOL-26-BRIEF.md) |
| Wiring check | `pnpm agent:proceed-confirmation:check` |

**Rules:** After Phase 5.4, emit **Proceed Brief** then start work in the same turn. **Forbidden:** "Which should I do?" / option menus.

## 1.10 Agent Execution Obligation (Protocol 27) — MANDATORY

Agents **run** verification commands in-session before claiming work is done.

| Resource | Path |
|----------|------|
| Ecosystem protocol | `gtcx-docs/docs/governance/protocols/27-agent-execution-obligation/protocol.md` |
| Repo manifest | [`docs/operations/agent-execution-obligation.md`](docs/operations/agent-execution-obligation.md) |
| Ladder command | `pnpm agent:verify-ladder` |
| Wiring check | `pnpm agent:execution-obligation:check` |

**Verification ladder (V2–V4, match CI):**

| Step | Command |
|------|---------|
| V2 | `pnpm typecheck` |
| V2 | `pnpm validate` |
| V3 | `pnpm test` |
| V2 | `pnpm lint:policies` (when policies touched) |
| V4 | `pnpm agent:protocols:check` (when governance touched) |

**Rules:** Report `command → exit code` in session output. If blocked, emit **Permission Unblock Report** — never “verify locally.” Cross-repo INF-86 checks run in `gtcx-protocols` checkout (V6).

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
- `pnpm agent:protocols:check` — P19, P22, P24, P26, P27 wiring (CI)

## Credential Access (Protocol 19)

The credential vault is managed by **gtcx-agentic** (consumes `@baselineos/vault` from baseline-os).

| Resource | Path |
|----------|------|
| Repo manifest | [`docs/operations/agent-credential-access.md`](docs/operations/agent-credential-access.md) |
| Wiring check | `pnpm agent:credentials:check` |

Agents access credentials via the MCP tool:

```
Tool: baseline_vault
  action: "list"     → show available credentials and trust requirements
  action: "get"      → retrieve a value (requires: name, agentId)
  action: "status"   → vault health check
```

The vault is centrally located at `~/.baseline/vault` (SQLite, AES-256 encrypted).
Trust-score gated. All access is audited.

Standard env vars: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `DATABASE_URL`, `REDIS_URL`, `BASELINE_MASTER_KEY`.

Never commit secrets. Never ask users for credentials in chat.
Read Protocol 19 (`gtcx-docs/docs/governance/protocols/19-agent-credential-access/protocol.md`) for the full standard.