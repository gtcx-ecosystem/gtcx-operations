---
title: 'ClickUp Sync Workflow'
status: 'current'
date: '2026-05-27'
owner: 'ops@gtcx.io'
role: 'ops@gtcx.io'
tier: 'standard'
tags: ['operations', 'runbooks', 'sync']
review_cycle: 'on-change'
---

# ClickUp Sync Workflow

> **Goal:** Keep ClickUp tasks in sync with gtcx-operations follow-ups and sprint commitments.  
> **Principle:** ClickUp is a **read-only mirror**. Source of truth is always git.  
> **Scope:** WhatsApp/email follow-ups → ClickUp tasks; Sprint commitments → ClickUp milestones

## Architecture

```
gtcx-operations/
├── threads/registry.json           # Unified thread registry
│   └── threads[].follow_ups[]      # Pending follow-ups
├── docs/specs/_project/planning/sprints/current.md   # Sprint commitments
└── scripts/
    └── clickup-sync.ts             # Sync engine

baseline-os/
└── workstream/coordination/
    └── clickup-mapping.json        # Repo → ClickUp list mapping
```

**ClickUp Workspace:** `GTCX Protocol`  
**Engineering Space:** `GTCX Engineering`  
**Products Space:** `GTCX Products`  
**Max Spaces:** 5 (ClickUp free tier limit)

## Mapping

| gtcx-operations Artifact | ClickUp Destination | Sync Direction |
|--------------------------|---------------------|----------------|
| Pending follow-ups (threads) | `GTCX Engineering` → `gtcx-operations` list | One-way (ops → ClickUp) |
| Sprint commitments | `GTCX Engineering` → per-repo lists | One-way (git → ClickUp) |
| Blockers / escalations | `GTCX Engineering` → `blockers` list | One-way (ops → ClickUp) |

**Mapping file:** `baseline-os/workstream/coordination/clickup-mapping.json`

```json
{
  "spaces": {
    "GTCX Engineering": {
      "lists": {
        "gtcx-operations": "LIST_ID_HERE",
        "gtcx-markets": "LIST_ID_HERE",
        "gtcx-core": "LIST_ID_HERE",
        "baseline-os": "LIST_ID_HERE",
        "blockers": "LIST_ID_HERE"
      }
    }
  }
}
```

> ⚠️ **Current status:** `gtcx-operations` list ID is "TBD". Set this before running live sync.

## Workflow: Follow-Up → ClickUp Task

### Step 1: Build Thread Registry

```bash
cd gtcx-operations
pnpm threads:build
```

This compiles all CRM interactions, WhatsApp messages, and email logs into `threads/registry.json`.

### Step 2: Run Orchestrator

```bash
pnpm orchestrate:cross-channel
```

This evaluates all orchestration rules and generates pending follow-ups in the thread registry.

### Step 3: Sync to ClickUp

```bash
# Dry run (no API calls, prints what would be created)
export CLICKUP_API_TOKEN="your_token"
export CLICKUP_TEAM_ID="your_team_id"
pnpm clickup:sync

# With live ClickUp API (requires list ID in mapping)
export CLICKUP_API_TOKEN="your_token"
export CLICKUP_TEAM_ID="your_team_id"
pnpm clickup:sync
```

### What Gets Created

For each pending follow-up, a ClickUp task is created with:

| Field | Value |
|-------|-------|
| **Name** | `[Contact Name] CHANNEL: Action description` |
| **Description** | Full thread context + recent messages |
| **Status** | `to do` |
| **Priority** | `2` (urgent) for calls, `3` (normal) for messages |
| **Due Date** | `followUp.scheduled_at` |
| **Tags** | `cross-channel`, `{channel}`, `auto-sync` |

### Deduplication

Follow-ups are only created once. After successful ClickUp creation:

```json
{
  "follow_ups": [{
    "id": "FU-msg-123",
    "type": "whatsapp",
    "status": "pending",
    "metadata": {
      "clickup_task_id": "TASK_ID_HERE"
    }
  }]
}
```

Subsequent syncs skip follow-ups that already have `clickup_task_id`.

## Workflow: Sprint → ClickUp Milestone

The baseline-os ecosystem coordination scripts handle sprint-to-ClickUp sync:

```bash
cd baseline-os
export CLICKUP_API_TOKEN="your_token"
export CLICKUP_TEAM_ID="your_team_id"
pnpm ecosystem:clickup:push-sprints
```

This reads all repo sprint docs (`docs/specs/_project/planning/sprints/current.md`) and creates/updates corresponding ClickUp tasks.

## Automation

### Manual Trigger
```bash
# From gtcx-operations
pnpm clickup:sync
```

### GitHub Actions (baseline-os)
```bash
# From baseline-os — runs weekly
pnpm ecosystem:clickup:sync
pnpm ecosystem:clickup:push-sprints
```

### Cron Schedule (Recommended)
```bash
# Daily at 09:00 UTC
0 9 * * * cd ~/Sites/gtcx-ecosystem/gtcx-operations && CLICKUP_API_TOKEN=$TOKEN CLICKUP_TEAM_ID=$TEAM pnpm clickup:sync
```

## Troubleshooting

### "CLICKUP_API_TOKEN not set"
```bash
export CLICKUP_API_TOKEN="pk_xxxxxxxx"
```

### "No ClickUp list ID found"
Add the list ID to `baseline-os/workstream/coordination/clickup-mapping.json`:
```json
{
  "spaces": {
    "GTCX Engineering": {
      "lists": {
        "gtcx-operations": "901200000000"
      }
    }
  }
}
```

### "Thread registry not found"
Run `pnpm threads:build` first.

### Tasks not updating
ClickUp sync is **create-only** for follow-ups. It does not update existing tasks. If you need to update a task, do it in ClickUp directly or delete the `clickup_task_id` from the follow-up metadata to force re-creation.

## Security

- `CLICKUP_API_TOKEN` is never committed to git
- Token has workspace-level access — store in 1Password or GitHub Secrets
- Rotate token every 90 days

## Related Docs

- [Google Workspace Setup](../../engineering/guides/google-workspace-setup.md)
- [Cross-Channel Orchestration](./cross-channel-orchestration.md)
- [WhatsApp-First Communications](../../architecture/principles/whatsapp-first.md)
- [Audience Segmented Communications](../../architecture/principles/audience-segmented-communications.md)
