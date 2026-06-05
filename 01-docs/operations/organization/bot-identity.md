---
title: "Bot Identity: gtcx-agent"
status: "current"
date: "2026-05-27"
owner: "gtcx-operations"
role: "protocol-architect"
agent_id: "agent://gtcx-operations/2026-05-27/session-backfill"
trust_score: 60
autonomy_level: "permissioned"
tier: "standard"
tags: ["documentation", "operations"]
review_cycle: "on-change"
---

---
title: 'GTCX Agent Bot Identity'
status: 'current'
date: '2026-05-27'
owner: 'ops@gtcx.trade'
role: 'ops@gtcx.trade'
tier: 'standard'
tags: ['operations', 'security']
review_cycle: 'on-change'
---

# Bot Identity: gtcx-agent

## Account Details

| Field | Value |
|-------|-------|
| GitHub Username | [@gtcx-agent](https://github.com/gtcx-agent) |
| Git Email | `agent@gtcx.trade` |
| Git Name | `gtcx-agent` |
| Account Type | Service account (bot) |
| Managed By | GTCX Operations team |

## Permissions

| Repo | Access | Purpose |
|------|--------|---------|
| `gtcx-ecosystem/gtcx-operations` | Write | Commit budgets, contracts, pipelines |
| `gtcx-ecosystem/baseline-os` | Write | Coordination reports, sprint syncs |
| `gtcx-ecosystem/gtcx-core` | Read | Dependency validation |
| Other repos | Read | Cross-repo coordination |

## Authentication

- **Method:** Fine-grained Personal Access Token (PAT)
- **Stored In:** `GTCX_AGENT_TOKEN` repository secret
- **Scope:** `repo` on gtcx-operations, `read:org` for ecosystem discovery
- **Rotation:** Every 90 days, tracked in `ops/runbooks/token-rotation.md`

## Commit Conventions

All agent commits use conventional commits:
```
type(scope): subject

[optional body]
```

| Type | Use For |
|------|---------|
| `chore` | Scheduled syncs, data updates |
| `feat` | New template, new policy |
| `fix` | Corrected budget, updated deadline |
| `docs` | Runbook update, README changes |

Examples:
- `chore(finance): sync Q2 budget from ClickUp`
- `feat(legal): generate NDA for Example Corp`
- `fix(ip): update patent filing deadline`

## Audit Trail

Every agent action is logged:
- Git commits → `git log --author="gtcx-agent"`
- Workflow runs → GitHub Actions UI
- ClickUp changes → ClickUp activity log
- Slack notifications → #ops-automation channel

## Escalation

If agent commits are failing:
1. Check `GTCX_AGENT_TOKEN` expiry
2. Verify repo permissions
3. Review GitHub Actions logs
4. Escalate to `ops@gtcx.trade`

## Rotation Schedule

| Credential | Last Rotated | Next Rotation |
|------------|-------------|---------------|
| GitHub PAT | 2026-05-17 | 2026-08-15 |
| ClickUp API Token | 2026-05-17 | 2026-08-15 |
