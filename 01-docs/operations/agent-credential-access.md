---
title: 'Agent Credential Access (Protocol 19)'
status: current
date: 2026-06-03
owner: gtcx-operations
document_id: OPS-P19-001
protocol: gtcx-docs/01-docs/governance/protocols/19-agent-credential-access/protocol.md
adoption_status: established
---

# Agent Credential Access — gtcx-operations

> **Protocol:** [Protocol 19](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/01-docs/governance/protocols/19-agent-credential-access/protocol.md)  
> **Vault:** gtcx-agentic / `@baselineos/vault` — not files in this repo

## Rules

| Do | Don't |
| --- | --- |
| Use MCP `baseline_vault` with `agentId` | Ask user to paste API keys in chat |
| Store service JSON under `.secrets/` (gitignored) | Commit credentials to git |
| Document missing creds in Blocker Report | Put secrets in PR comments |

## Standard env (when vault maps them)

`CLICKUP_API_TOKEN`, `CLICKUP_TEAM_ID`, Google paths via `.secrets/`, Twilio/Meta via env names in provider YAML.

## Verify

- `.gitignore` includes `.secrets/`
- `pnpm check-credentials` for local layout (optional)

**Check:** `pnpm agent:credentials:check`
