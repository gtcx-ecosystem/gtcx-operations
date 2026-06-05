---
title: "Cross-Channel Orchestration Workflow"
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
title: 'Cross-Channel Orchestration Workflow'
status: 'current'
date: '2026-05-27'
owner: 'ops@gtcx.trade'
role: 'ops@gtcx.trade'
tier: 'standard'
tags: ['operations', 'runbooks', 'orchestration']
review_cycle: 'on-change'
---

# Cross-Channel Orchestration Workflow

> **Goal:** Automate follow-up sequences across WhatsApp, email, and platform notifications based on audience type and engagement signals.  
> **Strategy:** WhatsApp-first for African producers/partners. Platform + email for investors. Email-only for legal.  
> **Source of truth:** `threads/registry.json`

## Audience-Aware Routing

The orchestrator determines the primary channel based on contact type:

| Contact Type | Primary Channel | Follow-Up Sequence | Rationale |
|--------------|-----------------|-------------------|-----------|
| **Investor** | Email (platform portal) | Day 3: email → Day 7: platform → Day 14: email | Institutional LPs expect documented communication; platform provides audit trail |
| **Producer** | WhatsApp | Day 1: WA → Day 3: WA → Day 7: WA → Day 14: SMS | African frontier markets are mobile-first; WhatsApp has highest open rates |
| **Partner** | WhatsApp | Day 3: WA → Day 7: email | Partners span both mobile and formal contexts |
| **Vendor** | Email | Day 3: email → Day 7: email | Legal/contracts require email for enforceability |
| **Legal** | Email | Day 3: email → Day 7: email | Regulatory/compliance requires documented communication |

> **Critical rule:** Never use Telegram for institutional investors. Never use WhatsApp for legal notices requiring signatures.

## Orchestration Rules

The orchestration engine (`03-platform/scripts/orchestrate-cross-channel.ts`) evaluates 5 rules against every thread:

### Rule 1: `whatsapp-no-reply-24h`

**Trigger:** WhatsApp outbound message sent, no inbound reply within 24 hours, no pending follow-up already scheduled.

**Action:** Schedule WhatsApp follow-up with the same message context.

```
📌 whatsapp-no-reply-24h: Kwame (Ghana Gold Ltd)
   Action: WhatsApp follow-up: "Following up on equipment financing..." — no reply after 24h
   Channel: whatsapp
   Scheduled: Today
```

### Rule 2: `whatsapp-no-reply-72h`

**Trigger:** WhatsApp outbound message sent, no inbound reply within 72 hours, no pending follow-up already scheduled.

**Action:** Schedule final WhatsApp follow-up + platform notification.

```
📌 whatsapp-no-reply-72h: Kwame (Ghana Gold Ltd)
   Action: Final WhatsApp follow-up + platform notification
   Channel: whatsapp
   Scheduled: Today
```

### Rule 3: `whatsapp-no-reply-7d`

**Trigger:** No WhatsApp reply after 7 days.

**Action:** Archive thread, mark as "passed" in CRM.

```
📌 whatsapp-no-reply-7d: Kwame (Ghana Gold Ltd)
   Action: Archive thread — no WhatsApp reply after 7 days. Mark as passed in CRM.
   Channel: whatsapp
   Scheduled: Today
```

### Rule 4: `email-only-legal` (Disabled by default)

**Trigger:** Email outbound to investor, no reply within 3 days.

**Action:** No-op. Email is fallback only — investors receive platform notifications as primary.

> This rule is intentionally disabled. Investors are routed through the platform portal (`gtcx-markets`) for all non-legal communication.

### Rule 5: `stale-thread-14d`

**Trigger:** Thread status is `stale`, last activity was 14 days ago.

**Action:** Schedule re-engagement with value-add content (milestone, traction update).

```
📌 stale-thread-14d: Meridian Capital
   Action: Re-engage Meridian Capital — send value-add update
   Channel: whatsapp
   Scheduled: +2 days
```

## Execution Flow

```
1. Load thread registry
   └─> threads/registry.json

2. For each thread, evaluate all 5 rules
   └─> Rule condition checks message timestamps, statuses, existing follow-ups

3. If condition matches and action returns a follow-up
   └─> Append follow-up to thread.follow_ups[]
   └─> Log to console

4. Save updated registry
   └─> threads/registry.json (with new follow-ups)

5. Generate orchestration report
   └─> orchestration/report.md

6. (Optional) Sync pending follow-ups to ClickUp
   └─> pnpm clickup:sync
```

## Thread Data Model

```typescript
interface Thread {
  id: string;
  contact_name: string;
  company_name?: string;
  contact_type: 'investor' | 'producer' | 'partner' | 'vendor' | 'legal';
  status: 'active' | 'stale' | 'archived' | 'converted';
  last_activity: string;      // ISO timestamp
  messages: ThreadMessage[];
  follow_ups: ThreadFollowUp[];
  clickup_task_id?: string;
}

interface ThreadMessage {
  id: string;
  channel: 'whatsapp' | 'email' | 'platform' | 'sms';
  direction: 'inbound' | 'outbound';
  subject?: string;
  body: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

interface ThreadFollowUp {
  id: string;
  type: 'whatsapp' | 'email' | 'platform' | 'sms' | 'call';
  scheduled_at: string;
  action: string;
  status: 'pending' | 'completed' | 'cancelled';
  triggered_by: string;
  auto_trigger: boolean;
  metadata?: Record<string, unknown>;
}
```

## Building the Thread Registry

```bash
cd gtcx-operations
pnpm threads:build
```

This script:
1. Reads CRM contacts and interactions
2. Reads WhatsApp sent messages
3. Reads email sent logs
4. Merges into unified threads by contact
5. Sorts messages chronologically
6. Computes thread status (active/stale/archived)

## Running the Orchestrator

```bash
cd gtcx-operations

# Build threads first
pnpm threads:build

# Run orchestration
pnpm orchestrate:cross-channel

# Sync follow-ups to ClickUp
pnpm clickup:sync
```

## Orchestration Report

After each run, a markdown report is generated at `orchestration/report.md`:

```markdown
# WhatsApp-First Orchestration Report

*Generated: 2026-05-27T10:00:00Z*

**New follow-ups triggered:** 3

**Primary channel:** WhatsApp
**Email usage:** Legal fallback only

## Kwame (Ghana Gold Ltd)

- **Channel:** whatsapp
- **Action:** WhatsApp follow-up: "Following up on equipment financing..."
- **Scheduled:** 2026-05-27
- **Auto-trigger:** Yes
```

## Extending Rules

Add new rules to `03-platform/scripts/orchestrate-cross-channel.ts`:

```typescript
const rules: OrchestrationRule[] = [
  // ... existing rules
  {
    name: 'my-new-rule',
    condition: (thread) => {
      // Return true if rule should fire
      return thread.status === 'active' && /* your condition */;
    },
    action: (thread) => {
      // Return follow-up or null
      return {
        id: `FU-${thread.id}-CUSTOM`,
        type: 'whatsapp',
        scheduled_at: new Date().toISOString(),
        action: 'Your follow-up action',
        status: 'pending',
        triggered_by: thread.id,
        auto_trigger: true,
      };
    },
  },
];
```

## Nyota-AI Separation

Nyota-AI operates on a **separate phone number and channel**. They share infrastructure patterns (webhook validation, rate limiting) via shared library approach, not code coupling. Data sharing happens via events only.

## Related Docs

- [System Architecture](../../architecture/README.md)
- [ClickUp Sync Workflow](./clickup-sync.md)
- [WhatsApp-First Communications](../../architecture/principles/whatsapp-first.md)
- [Audience Segmented Communications](../../architecture/principles/audience-segmented-communications.md)
