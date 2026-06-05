# AGENTS.md — GTCX Operations

> **Applies to:** ALL AI agents operating on this repo
> **Date:** 2026-05-17
> **Version:** 1.0
## 1.5 GTCX Institutional Baseline

This repo operates within the GTCX ecosystem. All agents must reference the canonical organizational baseline:

| Resource | Canonical Path | Document ID |
|----------|---------------|-------------|
| Baseline Overview | `gtcx-docs/01-docs/governance/institutional/README.md` | INST-001 |
| Baseline JSON | `gtcx-docs/01-docs/governance/institutional/gtcx-baseline.json` | INST-002 |
| Agent Startup Protocol | `gtcx-docs/01-docs/governance/institutional/agent-startup-protocol.md` | INST-003 |
| Personas | `gtcx-docs/01-docs/governance/institutional/personas/` | INST-P-001–007 |
| Lexicon | `gtcx-docs/01-docs/governance/institutional/lexicon/` | INST-L-001–003 |
| Frames | `gtcx-docs/01-docs/governance/institutional/frames/` | INST-F-001–004 |
| Deliverables | `gtcx-docs/01-docs/governance/institutional/deliverables/` | INST-D-001–006 |
| Conventions | `gtcx-docs/01-docs/governance/institutional/conventions/` | INST-C-001–003 |

**Registry:** See `gtcx-docs/01-docs/governance/REGISTRY.md` for the full document index.

## 1.6 Agent Startup Protocol (MANDATORY)

Before making any code changes, architectural decisions, or recommendations, complete this sequence:

### Phase 1: Load Baseline (30 sec)
1. Read this `AGENTS.md` file (stack, commands, constraints)
2. Read `.baseline/definition.json` (repo config, terminology, authority)
3. Read institutional baseline: `gtcx-docs/01-docs/governance/institutional/README.md` *(if accessible)*

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
15. **Phase 5.4:** Run `pnpm agent:next-work` — read [`01-docs/04-ops/agent-work-selection.md`](01-docs/04-ops/agent-work-selection.md); mark story `in_progress` in [`01-docs/strategy/execution-roadmap.md`](01-docs/strategy/execution-roadmap.md). **Do not ask the human which story to pick.**
16. **Phase 5.5:** If P0 blocked on a sibling repo, file `01-docs/06-coordination/to-<repo>-*.md` and update `.baseline/memory/dependencies.md` in this session ([Protocol 24](01-docs/04-ops/cross-repo-coordination.md)).
17. **Phase 5.6:** Issue Proceed Brief (one recommended action + because) unless user said **stop** or named a story ID ([Protocol 26](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/01-docs/governance/protocols/26-agent-proceed-confirmation/protocol.md)).
18. **Phase 5.7:** Run verification in-session (`pnpm validate`, `pnpm test`, `pnpm typecheck`) and report exit codes ([Protocol 27](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/01-docs/governance/protocols/27-agent-execution-obligation/protocol.md)).
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
| Ecosystem protocol | `gtcx-docs/01-docs/governance/protocols/22-agent-work-selection/protocol.md` |
| Repo manifest | [`01-docs/04-ops/agent-work-selection.md`](01-docs/04-ops/agent-work-selection.md) |
| Story register | [`01-docs/strategy/execution-roadmap.md`](01-docs/strategy/execution-roadmap.md) |
| Command | `pnpm agent:next-work` |
| Session pointer | [`01-docs/05-audit/auto-dev-state.md`](01-docs/05-audit/auto-dev-state.md) |
| Adoption registry | [`01-docs/04-ops/protocol-adoption-registry.md`](01-docs/04-ops/protocol-adoption-registry.md) |

**Rules:** Run `pnpm agent:next-work` after Phase 3; handoffs (H-CLICKUP, H-GW) outrank unrelated polish; refresh `auto-dev-state.md` after each story. **Forbidden:** asking which story to pick.

## 1.8 Cross-Repo Coordination (Protocol 24)

| Resource | Path |
|----------|------|
| Repo guide | [`01-docs/04-ops/cross-repo-coordination.md`](01-docs/04-ops/cross-repo-coordination.md) |
| Coordination docs | [`01-docs/06-coordination/`](01-docs/06-coordination/) |
| Dependencies | [`.baseline/memory/dependencies.md`](.baseline/memory/dependencies.md) |
| Hub report | `baseline-os/workstream/coordination/coordination-report-latest.md` |

P0 on sibling repo → ticket + `ecosystem:repo:report-work` in the **same session**. Link evidence; do not duplicate protocols source or deployment-proof-index.

## 1.9 Agent Proceed Confirmation (Protocol 26) — MANDATORY

Agents **recommend and proceed**; humans **stop**, **correct**, or supply a story ID.

| Resource | Path |
|----------|------|
| Ecosystem protocol | `gtcx-docs/01-docs/governance/protocols/26-agent-proceed-confirmation/protocol.md` |
| Repo manifest | [`01-docs/04-ops/agent-proceed-confirmation.md`](01-docs/04-ops/agent-proceed-confirmation.md) |
| Brief | [`01-docs/04-ops/AGENT-PROTOCOL-26-BRIEF.md`](01-docs/04-ops/AGENT-PROTOCOL-26-BRIEF.md) |
| Wiring check | `pnpm agent:proceed-confirmation:check` |

**Rules:** After Phase 5.4, emit **Proceed Brief** then start work in the same turn. **Forbidden:** "Which should I do?" / option menus.

## 1.10 Agent Execution Obligation (Protocol 27) — MANDATORY

Agents **run** verification commands in-session before claiming work is done.

| Resource | Path |
|----------|------|
| Ecosystem protocol | `gtcx-docs/01-docs/governance/protocols/27-agent-execution-obligation/protocol.md` |
| Repo manifest | [`01-docs/04-ops/agent-execution-obligation.md`](01-docs/04-ops/agent-execution-obligation.md) |
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

**Full protocol:** `gtcx-docs/01-docs/governance/institutional/agent-startup-protocol.md`

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

- **BaselineOS** — Governance policies sync to `baseline-os/01-docs/governance/`
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
| Repo manifest | [`01-docs/04-ops/agent-credential-access.md`](01-docs/04-ops/agent-credential-access.md) |
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
Read Protocol 19 (`gtcx-docs/01-docs/governance/protocols/19-agent-credential-access/protocol.md`) for the full standard.

## Agent folder & workspace (P29)

| Resource | Path |
| -------- | ---- |
| Terminal index | [`agents/README.md`](./agents/README.md) |
| Universal protocols | [`agents/universal/README.md`](./agents/universal/README.md) |
| Workspace SoR | [`workspace/`](./workspace/) |

```bash
pnpm workspace:check
pnpm pm:sync
```

Spec: [P29 Agent Workspace Domains](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/01-docs/governance/protocols/29-agent-workspace-domains/protocol.md)

<!-- gtcx-workspace-p29 -->

<!-- AGENT-SYNC:START -->
<!-- AUTOGENERATED FROM .agent/*.md — DO NOT EDIT THIS SECTION.
     Edit the source partials and run `pnpm agent:sync`. -->

## Repository

`gtcx-operations` — TODO: one-line purpose.

## Stack

TODO: language(s), framework(s), package manager, runtime.

## Non-Negotiables

1. **Conventional commits** — `type(scope): subject`, lowercase, imperative.
2. **No emojis** unless explicitly requested.
3. **No going in circles** — read this file + the repo's own docs before exploring.

## Build & Run

```bash
TODO: install / build / test / dev commands
```

## Audits (cross-repo)

### Universal Rubric (all repos, all agents)

The canonical scoring framework lives here:

```
gtcx-agentic/03-platform/tools/audit-framework/UNIVERSAL_RUBRIC.md
```

Start with `gtcx-agentic/03-platform/tools/audit-framework/README.md` for the entry point.

This rubric works for **any GTCX repository** — product (mobile/web), infrastructure,
backend, or agentic/MCP. It covers 10 dimensions, score trajectory, per-repo-type
weights, and a complete execution protocol.

### How to Run an Audit

1. **Read the rubric** (`gtcx-agentic/03-platform/tools/audit-framework/UNIVERSAL_RUBRIC.md`)
2. **Determine repo type** (Product | Infra | Agentic | Backend) and apply weights from §2
3. **Execute the protocol** from §13 against the target repo
4. **Write the report** to `01-docs/05-audit/universal-audit-YYYY-MM-DD.md` in the target repo

If the command registry is not yet migrated, fall back to
`gtcx-docs/03-platform/tools/audit/audit-framework/commands.json` and the prompt path it references.

### Repo Hygiene (deterministic — no LLM)

Use `@gtcx/hygiene` — `gtcx-agentic/03-platform/tools/hygiene/` (`gtcx-hygiene check|fix|init`).
Per-repo policy: `hygiene.config.json`.

### Legacy Audit Types

The following audit types are still supported but now use the universal rubric as
their scoring backbone:

| Audit Type    | Output Path                              | Notes                                                                 |
| ------------- | ---------------------------------------- | --------------------------------------------------------------------- |
| master-audit  | `01-docs/05-audit/master-audit-YYYY-MM-DD.md`  | Forensic build/test/scan using rubric dimensions 1, 2, 6, 7, 8, 9, 10 |
| product-audit | `01-docs/05-audit/product-audit-YYYY-MM-DD.md` | User-outcome audit using rubric dimensions 3, 4, 5, 6, 9, 10          |
| 10-10-roadmap | `01-docs/05-audit/10-10-roadmap-YYYY-MM-DD.md` | Milestone planning aligned to rubric §2 trajectory                    |

### Provider-Agnostic

The same rubric and protocol work for Claude, Codex, Gemini, Kimi, Deepseek, Grok,
or any other agent. No provider-specific syntax is required.

---

_Canonical framework location: `gtcx-agentic/03-platform/tools/audit-framework/`_
_Rubric version: 1.0 (2026-05-27)_

## Credentials: system-of-record + ownership split (cross-repo)

**Canonical policy:** `gtcx-docs/01-docs/governance/protocols/19-agent-credential-access/protocol.md` (see “System-of-Record and Operational Ownership Split”).

- **System-of-record (SoR)**: `gtcx-agentic` Baseline vault (shared provider creds + audited access)
- **Runtime usage owner**: product repo (e.g. `gtcx-intelligence`) owns its runtime secrets
- **CI/automation owner**: `gtcx-infrastructure` owns org automation secrets/policy
- **Contracts only**: `gtcx-protocols` defines env var names, redaction rules, and artifact paths/globs

**Credentialed evidence packs:** run either via vault injection on a dev laptop or in infra-owned CI; write redacted JSON evidence only (no raw secrets).

## LLM routing + token usage (BaselineOS SoR)

| Concern                       | Owner          | Operator entry                                                |
| ----------------------------- | -------------- | ------------------------------------------------------------- |
| Route decisions + pricing     | `baseline-os`  | `baseline cost-route --prompt "..." --json`                   |
| Token usage aggregate         | `baseline-os`  | `baseline cost-stats --json`                                  |
| Agent vault (populate/verify) | `gtcx-agentic` | `pnpm agent:vault:verify`                                     |
| Staging vs production keys    | `gtcx-agentic` | `01-docs/operators/vault-environments.md`                        |
| Ecosystem coordination        | `baseline-os`  | `workstream/coordination/ECOSYSTEM-COST-ROUTER-2026-06-03.md` |

**Do not** use `baseline-os/04-ship/docker/.env.staging` for production vault work.

## Execute roadmap (any LLM, any repo)

Command: **`execute-roadmap`** (not `roadmap`).

1. Read `../gtcx-docs/03-platform/tools/roadmap/roadmap-framework/AGENT-START.md`
2. Read `commands/execute-roadmap.md` and `prompts/roadmap/roadmap-reconcile-execute-prompt.md`
3. Update `01-docs/strategy/execution-roadmap.md` or `01-docs/05-audit/execution-roadmap.md`; execute until active phase done
4. Quick: `prompts/shareable/execute-roadmap-prompt-RUN.md`

Provider-agnostic — Claude, Codex, Gemini, Kimi, Cursor, etc.

## Cross-repo coordination (Protocol 24)

**Canonical policy:** [Protocol 24 — Cross-Repo Coordination](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/01-docs/governance/protocols/24-cross-repo-coordination/protocol.md)  
**Complements:** [Protocol 22 — Agent Work Selection](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/01-docs/governance/protocols/22-agent-work-selection/protocol.md) (what to work on next).

When a story is **blocked on a sibling repo** or you **hand off** cross-repo work, follow these five steps in order:

| Step                | Action                                                                                                                                                                                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **1. Ack**          | Read open handoffs: `baseline-os/workstream/coordination/coordination-report-latest.md` (if present) and any `from-*` / `to-*` tickets naming this repo. Reply with `outbound-ack` template when you receive a durable inbound.                                                |
| **2. Roadmap**      | Record ticket IDs and blocker repo in `01-docs/05-audit/auto-dev-state.md`, `.baseline/memory/dependencies.md`, and/or `01-docs/05-audit/agent-work-pointer.md` (if used). Do not leave blockers chat-only.                                                                                |
| **3. Inbound doc**  | File a durable handoff: `01-docs/08-gtm/inbound-tickets/from-<this-repo>-<topic>-YYYY-MM-DD.md` or `01-docs/06-coordination/<initiative>-coordination.md` ([template](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/01-docs/reference/templates/agents/3-structure/coordination.md)). |
| **4. Hub if P0**    | Ecosystem-critical path: from `baseline-os`, `pnpm ecosystem:repo:report-work --repo=<repo> --item="..." --status=blocked`. Use `gtcx-docs/01-docs/08-gtm/inbound-tickets/` only when the **docs hub** is the coordination witness (releases, standards).                            |
| **5. No duplicate** | Link [deployment-proof-index](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/01-docs/05-audit/evidence/deployment-proof-index.md) and protocol contracts — **do not** copy harness YAML, evidence indexes, or normative protocol text into product repos.                |

**Not in this repo:** inbound archive SoR for ecosystem-wide weekly reports — that stays **`baseline-os`** (`workstream/coordination/`).

**Evidence paths (link only):** production smoke and EAP issuance artifacts live in owning repos per deployment-proof-index (e.g. `gtcx-intelligence/01-docs/05-audit/evidence/`).

## Claude-Specific Notes

- Session-start protocol from `~/.claude/CLAUDE.md` applies: read `DESIGN_BAR.md` and `AI_NATIVE_PATTERNS.md` before UI work.
- Reject conventional UI anti-patterns: AI sidebar, AI tab, "Run AI" buttons, blank forms, dashboard-as-report.
- No emojis, no preamble, no time estimates, lead with the answer.

## Universal agent behavior (ANY LLM — terminal, IDE, CLI)

**Applies to:** Claude, Kimi, Gemini, Codex, Cursor (IDE + `agent` CLI), Copilot, and any future agent with shell access.

**Canonical docs (read every session):**

1. `01-docs/04-ops/agent-universal-instructions.md`
2. `01-docs/04-ops/human-gate-navigation.md` — Class **S** + **`blocksIR: false`** gates are **parallel**, not repo frozen

**Full chain:** `baseline start` (INST-003 + repo session + gates). Repo-only: `pnpm agent:start`.

### Session start (one command)

```bash
baseline start
# or: pnpm agent:start   # P22 bootstrap only — not full INST-003 chain
```

Optional: `pnpm agent:start --json` · legacy alias `pnpm agent:session-start` (same as `agent:start`).

### P22 — Work selection

- Run next-work; **never** ask "which story?" or present numbered menus.
- Execute the returned story in **this repo** unless P24 handoff says switch owner repo.

### P26 — Proceed Brief (then implement)

Emit **one** brief, then work. Human may **stop**, **correct:**, or story ID — not pick options.

**Forbidden replies:** Your call · Two options · 1./2. menus · Say push if you want · **Say if you want** · **committed next or** · **left as local WIP** · Which do you prefer? · **I can…** · **Want me to tackle…** · **anything on the P1 list?** · approval of path already selected (Class R).

**After push/status tables:** run `agent:next-work` → **Status Update** → **Next priority** = that story → implement (do not offer a repo pick list).

**Uncommitted Class R files:** commit in-session (micro-commit) — never ask operator to choose commit vs WIP.

**Required close:** **Status Update** only — message **stops** after Approval needed. **One** Next priority (from `agent:next-work`); never "Want me to proceed with A or B?". Execute Class R Next in-session.

**Status Update (end of turn):** `### Done` · `### Next priority` (one owner + action) · `### Approval needed` (Class A/S only — omit if empty). Template: `01-docs/04-ops/agent-status-update-template.md`.

### P27 — You run commands

- Gates, dev servers (Metro/Expo background), `adb`, `git push` — in-session.
- Report **command + exit code**.
- Harness blocks bare `git push`? **D3:** `pnpm --dir ../gtcx-agentic ecosystem:git-push --repo <name>` · **D5:** `pnpm --dir ../gtcx-agentic ecosystem:push-all`.
- Blocked after diagnosis D1–D6? **Permission Unblock Report** — not "run locally."

### P28 — Authority

| Class | Behavior                                       |
| ----- | ---------------------------------------------- |
| **R** | Self-execute docs, tests, commits, normal push |
| **A** | Run after artifact (XR, inbound ticket)        |
| **S** | Stop; Blocker Report only                      |

### Hub specs

- P22 `gtcx-docs/01-docs/governance/protocols/22-agent-work-selection/protocol.md`
- P26 `gtcx-docs/01-docs/governance/protocols/26-agent-proceed-confirmation/protocol.md`
- P27 `gtcx-docs/01-docs/governance/protocols/27-agent-execution-obligation/protocol.md`

## Session start (all terminals / LLMs)

```bash
pnpm session
# or: baseline session
pnpm session --json
```

**Lookup:** `session` → `next` → `gates` → `hub` — see `01-docs/04-ops/agent-command-lookup.md`

Prints P22 next-work + P26 Proceed Brief skeleton. Not IDE-specific.

## Protocol 26 — Proceed Brief (no menus)

After P22: **one Proceed Brief → implement**. Template: `01-docs/04-ops/agent-proceed-brief-template.md` (when present).

**Forbidden:** Your call · Two options · Say push if you want · path-approval ask for Class R work.

## Protocol 27 — execution obligation

**You run commands.** Dev servers, gates, `adb`, push — not operator checklists.

**Diagnosis before human:** Shell → background → node spawn → owner repo → `ecosystem:push-all` → Unblock Report.

**Forbidden:** verify locally · focus your terminal · run these commands · let me know when you've run.

## Status Update (progress / handoff / end of turn)

Use **after work in the turn** or when reporting cluster/repo state — not instead of Proceed Brief at session start.

```markdown
## Status Update

### Done
- <outcome> — <evidence: command exit N, commit SHA, probe result>

### Next priority
- **Owner:** <repo or role>
- **Action:** <single imperative>
- **Because:** <1 line — P22 ID, blocker, witness>

### Approval needed
- <only Class A or S gates — secret, prod, legal, force-push; omit section if none>
```

**Rules:** One next priority (not a menu). **Approval needed** only for real gates — never "I can push / I can help / if you want." Class **R**: execute, then show Done + Next.

Template: `01-docs/04-ops/agent-status-update-template.md` · Spec: P26 §3b (gtcx-docs).

## Persona selection (Phase 4 — mandatory)

**Bridge:** [ecosystem-persona-bridge-2026-06.md](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/01-docs/04-ops/coordination/ecosystem-persona-bridge-2026-06.md)  
**Registry:** [gtcx-docs institutional personas](https://github.com/gtcx-ecosystem/gtcx-docs/tree/main/01-docs/governance/institutional/personas)

| Step | Action                                                                                        |
| ---- | --------------------------------------------------------------------------------------------- |
| 1    | Run `pnpm agent:next-work` — use JSON `persona.institutional` + `persona.docUrl` when present |
| 2    | **Read** the persona `.md` file (not only the ID)                                             |
| 3    | State **Active persona** + **Frame** in every Proceed Brief (Protocol 26)                     |
| 4    | On **task switch**, re-select persona and read the new doc                                    |

**MCP personas** (`builder`, `security`, …) apply when using BaselineOS MCP tools; **institutional** names apply in chat, commits, and hub docs.

**Forbidden:** defaulting to generic coder voice for security, compliance, or coordination tasks.

## Ecosystem agent learning card (normative — read every session)

**Canonical SoR:** [ecosystem-agent-learning-card-2026-06.md](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/01-docs/04-ops/coordination/ecosystem-agent-learning-card-2026-06.md) (gtcx-protocols).

### Read order

| Step | Link |
| ---- | ---- |
| 1 | [Unblock playbook F1–F10](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/01-docs/04-ops/coordination/ecosystem-unblock-playbook-2026-06.md) |
| 2 | [P26 Status Update + post-pilot gating](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/01-docs/04-ops/coordination/agent-status-update-and-post-pilot-gating-2026-06-06.md) |
| 3 | [Human-external register](https://github.com/gtcx-ecosystem/gtcx-agentic/blob/main/01-docs/04-ops/coordination/human-external-blocker-register-2026-06.md) |
| 4 | [Cross-repo bridge — Latest updates](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/01-docs/04-ops/coordination/cross-repo-agent-bridge.md) |
| 5 | This repo `01-docs/04-ops/agent-work-selection.md` · `01-docs/05-audit/auto-dev-state.md` |

**End of turn:** one P26 Status Update (not a menu) → append [cross-repo-agent-log](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/01-docs/04-ops/coordination/cross-repo-agent-log.md) if state changed.

### Rules (all repos)

- **`backlogClear`** on a sibling (e.g. gtcx-protocols) does **not** stop IR in **this** repo.
- **Class S** (H-03, DTF-5.5.4 LOI, pen-test SOW, …) → **Approval needed** only — never execute from wrong repo.
- **Class R** (tests, manifests, capture scripts) → run in-session; never list under Approval needed.
- **Never** execute H-03 countersign or XR-518 `--confirm` unless owner repo + Class A artifact says so.
<!-- AGENT-SYNC:END -->
