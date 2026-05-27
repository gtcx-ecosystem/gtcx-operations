---
title: 'Audience-Segmented Communications'
status: 'current'
date: '2026-05-27'
owner: 'founders@gtcx.io'
role: 'ops@gtcx.io'
tier: 'standard'
tags: ['communications', 'architecture', 'principles']
review_cycle: 'on-change'
---

# Audience-Segmented Communications

## The Correction

**WhatsApp is for producers and frontier markets. NOT for investors.**

## Audience Map

| Audience | Primary Channel | Why |
|----------|----------------|-----|
| **Investors** (VCs, angels, DFIs) | Platform + Email | Formal, auditable, professional |
| **African Producers** | WhatsApp | 90%+ penetration, mobile-first, trusted |
| **Local Partners** (cooperatives, aggregators) | WhatsApp | Same as producers |
| **Legal / Compliance** | Email + Platform | Requires written record |
| **Vendors / Service Providers** | Email + Platform | Contracts, SLAs, formal engagement |
| **Internal Team** | Platform + Slack | Collaboration, async communication |

## Channel by Audience

### Investors: Platform + Email

**What goes on Platform:**
- Monthly/quarterly reports
- Portfolio analytics
- Governance voting
- Document room (term sheets, board packs)
- Cap table
- Deal pipeline updates

**What goes on Email:**
- Legal notices
- Board meeting invitations
- Formal approvals
- Auditor communications
- Anything requiring a written paper trail

**What does NOT go on WhatsApp:**
- Investor updates
- Term sheets
- Financial data
- Governance matters

### Producers: WhatsApp

**What goes on WhatsApp:**
- Commodity price alerts
- Market intelligence
- Compliance reminders
- Weather/seasonal advisories
- Cooperative announcements
- Payment notifications

**What does NOT go on Email:**
- Most producer communications (email open rates <5% in rural Africa)

### Local Partners: WhatsApp

**What goes on WhatsApp:**
- Operational updates
- Logistics coordination
- Meeting scheduling
- Issue escalation

## Communication Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        PLATFORM (Primary)                        │
│     Documents, governance, analytics, investor dashboard         │
└─────────────────────────────────────────────────────────────────┘
         │                           │
         ▼                           ▼
   ┌──────────┐              ┌──────────────┐
   │  Email   │              │   WhatsApp   │
   │ (Formal) │              │  (Frontier)  │
   └──────────┘              └──────────────┘
         │                           │
    Investors                 Producers
    Legal                     Local Partners
    Vendors                   Cooperatives
    Auditors                  Aggregators
```

## CRM Routing Rules

```typescript
function getPrimaryChannel(contact: CrmContact): string {
  if (contact.type === 'investor') return 'email';
  if (contact.type === 'producer') return 'whatsapp';
  if (contact.type === 'partner') return 'whatsapp';
  if (contact.type === 'vendor') return 'email';
  if (contact.type === 'legal') return 'email';
  return contact.preferred_channel || 'email';
}
```

## Template Routing

| Template | Audience | Channel |
|----------|----------|---------|
| `investor-update` | Investors | Platform + Email |
| `quarterly-report` | Investors | Platform + Email |
| `board-meeting` | Investors | Email |
| `price-alert` | Producers | WhatsApp |
| `compliance-reminder` | Producers | WhatsApp |
| `cooperative-announcement` | Partners | WhatsApp |
| `nda-request` | Legal/Vendors | Email |
| `invoice-reminder` | Vendors | Email |

## Orchestrator Rules (Audience-Aware)

```typescript
// Investor follow-up sequence
if (contact.type === 'investor') {
  Day 3:  Email reminder
  Day 7:  Platform notification
  Day 14: Email: "Still interested?"
  Day 21: Archive
}

// Producer follow-up sequence
if (contact.type === 'producer') {
  Day 1:  WhatsApp follow-up
  Day 3:  WhatsApp reminder
  Day 7:  WhatsApp: "Final reminder"
  Day 14: SMS fallback
}
```

## Implementation

### 1. Update CRM Contact Types

```yaml
contacts:
  - id: CNT-001
    type: investor          # email, platform
    tier: series_a_lead

  - id: CNT-002
    type: producer           # whatsapp
    commodity: cocoa
    region: ashanti_ghana

  - id: CNT-003
    type: partner            # whatsapp
    organization: cooperative

  - id: CNT-004
    type: vendor             # email
    service: legal
```

### 2. Route Messages by Type

```typescript
// Before sending, check audience type
const channel = getPrimaryChannel(contact);

if (channel === 'email') {
  await sendEmail(contact, template);
} else if (channel === 'whatsapp') {
  await sendWhatsApp(contact, template);
}

// Always mirror to platform for audit trail
await logToPlatform(contact, message);
```

### 3. Investor Hub on Platform

Separate from producer-facing platform:
- Secure login with investor credentials
- Document room with NDAs, term sheets, reports
- Portfolio dashboard
- Governance voting
- Communication threads (not WhatsApp)

## Key Principle

**Don't force investors onto WhatsApp. Don't force producers onto email.**

Use the channel each audience already trusts and uses daily.
