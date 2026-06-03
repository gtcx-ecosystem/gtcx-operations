---
title: 'Agent Execution Obligation (Protocol 27)'
status: current
date: 2026-06-03
owner: gtcx-operations
document_id: OPS-P27-001
protocol: gtcx-docs/docs/governance/protocols/27-agent-execution-obligation/protocol.md
adoption_status: established
---

# Agent Execution Obligation — gtcx-operations

> **Normative:** [Protocol 27](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/docs/governance/protocols/27-agent-execution-obligation/protocol.md)  
> **Paste brief:** [`AGENT-PROTOCOL-27-BRIEF.md`](./AGENT-PROTOCOL-27-BRIEF.md)  
> **Automated ladder:** `pnpm agent:verify-ladder`

**Rule:** Agents **run** verifiable commands in-session. Do not delegate runnable work to the human terminal.

---

## Verification ladder (this repo)

| Step | Command | When required |
| --- | --- | --- |
| **V1** | `git status` | Always before commit/PR |
| **V2** | `pnpm typecheck` | TypeScript changes |
| **V2** | `pnpm validate` | Domain YAML/JSON/MD changes |
| **V2** | `pnpm lint:policies` | HR/ops/legal policy changes |
| **V3** | `pnpm test` | Code or schema changes |
| **V4** | `pnpm agent:protocols:check` | Governance / AGENTS / roadmap changes |
| **V4** | `pnpm sync:agentic-attestation` + `pnpm validate` | After protocols evidence updates |
| **V6** | `cd ../gtcx-protocols && pnpm check:inf86-xr401-preceremony` | INF-86 cross-repo verify (read-only) |

**CI parity:** `.github/workflows/ci.yml` runs `typecheck`, `test`, `validate`, `agent:protocols:check`.

---

## Story completion checklist

1. Run `pnpm agent:verify-ladder` (or steps above manually).
2. Report in session: `command → exit N` per step.
3. PR attestation: `- [x] Phase 5.7: Verification ladder (Protocol 27) — see PR body`.
4. If blocked: **Permission Unblock Report** (template below) — not “run locally”.

---

## Permission Unblock Report (template)

```markdown
## Permission Unblock Report

**Blocked command:** `pnpm test`
**Why blocked:** sandbox / missing credentials
**Impact:** Cannot attest story complete

### Enable
1. Allow shell for workspace / grant network if integration test needs it
2. Place credentials per `docs/engineering/guides/google-workspace-setup.md` if integration scripts required

### After enable
Agent re-runs `pnpm agent:verify-ladder` in this session.
```

---

## Forbidden

- “Verify locally: …”
- “Run this in your terminal and share output”
- Claiming done without exit codes for applicable V2–V4 steps

---

## Related

- INST-003 Phase 5.7 in [`AGENTS.md`](../../AGENTS.md)
- Protocol 22: run ladder **after** story selection
- Protocol 24: V6 runs in **owner repo** checkout
