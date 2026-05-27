---
title: 'GTCX Operations — Roadmap 2026'
status: 'current'
date: '2026-05-27'
owner: 'ops@gtcx.io'
role: 'ops@gtcx.io'
tier: 'standard'
tags: ['roadmap', 'planning', 'operations']
review_cycle: 'on-change'
---

# GTCX Operations — Roadmap 2026

> **North Star:** Corporate operations run as agentic software — every communication, contract, budget, and follow-up is versioned, routed, and observable across the GTCX ecosystem.  
> **Horizon:** Q2–Q4 2026 (6 months)  
> **Last Updated:** 2026-05-27  
> **Owner:** @amanianai

## Timeline Overview

```
         Jun 2026        Jul 2026        Aug 2026        Sep 2026        Oct 2026        Nov 2026
Docs     [====P1====]
ClickUp  [====P1====]
GW               [====P1====]
Events                   [====P1====]
Markets                          [====P2====]
Auto                                     [====P2====]
```

## Quarterly Milestones

### Q2 2026 (Jun) — Documentation & ClickUp Activation

**Goal:** All architecture, workflows, and APIs are documented. ClickUp sync is live with real list IDs. Google Workspace credentials are placed and tested.

| Epic | Priority | Status | Effort | Owner | Dependencies |
|------|----------|--------|--------|-------|-------------|
| Complete architecture docs | P1 | ✅ Done | M | @amanianai | — |
| Complete workflow runbooks | P1 | ✅ Done | M | @amanianai | — |
| Complete API reference | P1 | ✅ Done | M | @amanianai | — |
| Fix ClickUp list ID mapping | P1 | 🚧 In Progress | S | @amanianai | baseline-os |
| Place Google Workspace credentials | P1 | 🚧 In Progress | S | @amanianai | — |
| Test all integrations end-to-end | P2 | 📋 Planned | M | @amanianai | — |

### Q3 2026 (Jul–Sep) — Event-Driven Operations

**Goal:** gtcx-operations publishes domain events to the ecosystem event bus. Cross-channel orchestration triggers gtcx-markets notifications. WhatsApp campaigns are automated.

| Epic | Priority | Status | Effort | Owner | Dependencies |
|------|----------|--------|--------|-------|-------------|
| Event bus integration (publish) | P1 | 📋 Planned | L | @amanianai | gtcx-core |
| Push investor notifications to gtcx-markets portal | P1 | 📋 Planned | M | @amanianai | gtcx-markets |
| Automated WhatsApp campaign runner | P2 | 📋 Planned | M | @amanianai | Twilio |
| CRM bidirectional sync with Google Contacts | P2 | 📋 Planned | S | @amanianai | Google |
| Budget variance alerts (Slack + email) | P2 | 📋 Planned | S | @amanianai | — |

### Q4 2026 (Oct–Nov) — Autonomous Operations

**Goal:** Operations run with minimal human intervention. Follow-ups are auto-executed. Compliance reports are auto-generated. Nyota-AI integration is live.

| Epic | Priority | Status | Effort | Owner | Dependencies |
|------|----------|--------|--------|-------|-------------|
| Auto-execute scheduled follow-ups | P2 | 📋 Planned | L | @amanianai | WhatsApp API |
| Monthly compliance report generation | P2 | 📋 Planned | M | @amanianai | — |
| Nyota-AI event sharing | P3 | 🧊 Icebox | M | @amanianai | nyota-ai |
| AI-powered contract review | P3 | 🧊 Icebox | XL | @amanianai | griot-ai |

## Epic Details

### P1: Fix ClickUp List ID Mapping

**Description:** The ClickUp sync script cannot create live tasks because `gtcx-operations` list ID is "TBD" in the mapping file. Obtain the real list ID and update the mapping.  
**Acceptance Criteria:**
- [ ] `clickup-mapping.json` has real list ID for `gtcx-operations`
- [ ] `pnpm clickup:sync` creates live ClickUp tasks (not dry-run)
- [ ] Tasks appear in ClickUp "GTCX Engineering" space
**Risks:** ClickUp workspace reorganization may change list IDs.  
**Success Metric:** 10+ tasks created in ClickUp within 1 week of fix.

### P1: Place Google Workspace Credentials

**Description:** Google Workspace service account JSON files need to be placed in `.secrets/`. Domain-wide delegation must be configured for `ops@gtcx.io`.  
**Acceptance Criteria:**
- [ ] `.secrets/gmail-credentials.json` exists and is valid
- [ ] `.secrets/workspace-credentials.json` exists and is valid
- [ ] `pnpm check:credentials` passes
- [ ] `pnpm email:send --dry-run` works
- [ ] `pnpm calendar:schedule --dry-run` works
**Risks:** Workspace admin may delay domain-wide delegation approval.  
**Success Metric:** All 5 Google APIs return 200 on test calls.

### P1: Event Bus Integration (Publish)

**Description:** When a contract is signed, a budget is updated, or a follow-up is completed, publish an event to the ecosystem event bus so other repos can react.  
**Acceptance Criteria:**
- [ ] `ContractSignedEvent` published when contract status changes to `executed`
- [ ] `BudgetVarianceEvent` published when variance exceeds threshold
- [ ] `FollowUpCompletedEvent` published when follow-up status changes
- [ ] Events conform to `gtcx-core` event schema
**Risks:** Event bus may not exist in gtcx-core yet.  
**Success Metric:** 3+ event types published and consumed by at least 1 downstream repo.

### P1: Push Investor Notifications to gtcx-markets Portal

**Description:** When an investor-related event occurs (capital call issued, distribution paid, document published), push a notification to the gtcx-markets investor portal.  
**Acceptance Criteria:**
- [ ] Capital call notification appears in portal notification inbox
- [ ] Document publish notification appears in portal
- [ ] Notification read status syncs bidirectionally
- [ ] Email fallback works if portal is unavailable
**Risks:** gtcx-markets API may not have a notification ingestion endpoint yet.  
**Success Metric:** 100% of investor events generate a portal notification within 5 minutes.

### P2: Automated WhatsApp Campaign Runner

**Description:** Run scheduled WhatsApp campaigns (welcome sequences, milestone updates, re-engagement) automatically without manual script execution.  
**Acceptance Criteria:**
- [ ] Campaigns defined in YAML/config files
- [ ] Cron schedule runs campaigns automatically
- [ ] Campaign performance tracked (delivery, open, reply rates)
- [ ] A/B test framework for message templates
**Risks:** WhatsApp Business API rate limits may throttle campaigns.  
**Success Metric:** 5+ campaigns running autonomously with > 30% reply rate.

## Risk Register

| Risk | Likelihood | Impact | Mitigation | Owner |
|------|-----------|--------|-----------|-------|
| ClickUp list ID unavailable | Medium | Medium | Use dry-run mode; escalate to ClickUp admin | @amanianai |
| Google Workspace admin delays | Medium | High | Start delegation request immediately; have backup contact | @amanianai |
| gtcx-core event bus not ready | Medium | High | Build local event queue as fallback; sync when bus is ready | @amanianai |
| WhatsApp API rate limits | Low | Medium | Implement exponential backoff; batch messages | @amanianai |

## Dependencies on Other Repos

| This Repo Needs | From Repo | Epic | Blocking? | ETA |
|-----------------|-----------|------|-----------|-----|
| Event bus | gtcx-core | Cross-repo event bus | Yes | Q4 |
| Portal notification API | gtcx-markets | Investor dashboard API | Yes | Q3 |
| Coordination reports | baseline-os | Populate sprint docs | No | Q2 |
| Intelligence for contract AI | griot-ai | THESIS integration | No | Q4 |

## Repos Depending on Us

| Repo | What They Need | Epic | Blocking? | ETA |
|------|---------------|------|-----------|-----|
| gtcx-markets | Investor notifications, email delivery | Push notifications | No | Q3 |
| baseline-os | Sprint commitments, work reports | Populate sprint docs | No | Q2 |
| nyota-ai | Shared infra patterns | Event sharing | No | Q4 |

## Key Metrics

| Metric | Current | Target (Q2) | Target (Q3) | Target (Q4) |
|--------|---------|-------------|-------------|-------------|
| Integration tests passing | 29/29 | 35/35 | 40/40 | 45/45 |
| ClickUp tasks synced | 0 | 50 | 100 | 200 |
| Google APIs operational | 0/5 | 5/5 | 5/5 | 5/5 |
| Event types published | 0 | 0 | 3 | 6 |
| WhatsApp campaigns automated | 0 | 0 | 2 | 5 |
| Documentation coverage | 80% | 100% | 100% | 100% |

## Sprint Alignment

- **Current Sprint:** 2026-05-26 — 2026-06-09
- **Sprint Goal:** Complete documentation; fix ClickUp mapping; place Google credentials
- **Active Epics:** Complete architecture docs, Fix ClickUp mapping, Place GW credentials

---

*This roadmap is the canonical source of truth. ClickUp is a read-only mirror.  
To update: edit this file, commit, and run `pnpm ecosystem:roadmap:sync`*
