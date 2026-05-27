---
id: STRAT-002
title: "WhatsApp-First Communications Strategy"
version: "1.0"
effective_date: "2026-05-17"
owner: "founders@gtcx.io"
---

# WhatsApp-First Communications Strategy

> **Principle:** Email is a liability in African markets. WhatsApp is the operating system of business.

## Why Avoid Email?

| Problem | Impact |
|---------|--------|
| Deliverability | Gmail/Outlook spam filters catch African business emails |
| Open rates | Email: 20-25%. WhatsApp: 90%+ |
| Response time | Email: 24-48h. WhatsApp: minutes |
| Mobile-first | Africa is mobile-first; email is desktop-centric |
| Formality barrier | Email creates distance. WhatsApp creates intimacy |
| Infrastructure | Email servers, SPF, DKIM, DMARC = operational overhead |

## The New Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    PLATFORM (Primary)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Investor    │  │ Document    │  │ Communication       │ │
│  │ Dashboard   │  │ Room        │  │ Threads             │ │
│  │ - Portfolio │  │ - Reports   │  │ - Updates           │ │
│  │ - Analytics │  │ - Contracts │  │ - Q&A               │ │
│  │ - Deploy    │  │ - Cap Table │  │ - Governance        │ │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
└─────────┼────────────────┼────────────────────┼────────────┘
          │                │                    │
          ▼                ▼                    ▼
   ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
   │  WhatsApp    │  │   In-App     │  │  Email (Minimal) │
   │  (Alerts +   │  │   Push       │  │  (Legal only)    │
   │   1:1 Comms) │  │   Notifications│  │                  │
   └──────────────┘  └──────────────┘  └──────────────────┘
```

## Channel Responsibilities

### WhatsApp — Primary Communication Layer

**What goes on WhatsApp:**
- Investor updates (monthly/quarterly)
- Follow-ups and scheduling
- Quick questions and answers
- Meeting reminders
- Urgent alerts (deadlines, approvals needed)
- Document delivery links ("Your report is ready: [platform link]")

**What does NOT go on WhatsApp:**
- Term sheets (legal documents → platform)
- Board resolutions (governance → platform)
- Sensitive financial data (platform with access controls)

### Platform — Engagement Layer

**What lives on the platform:**
- All documents and reports
- Governance voting
- Portfolio analytics
- Historical communication threads
- Cap table and ownership data
- Contract signing (integrated e-signature)

### Email — Legal Fallback Only

**When email is used:**
- Legal notice requirements (some jurisdictions mandate email)
- Investor onboarding (some LPs require email for compliance)
- Formal board communications (if bylaws require it)
- Audit trail exports (for external auditors)

**Email is automated, not manual:**
- gtcx-agent sends email when legally required
- No human writes emails to investors
- Email content is always a mirror of WhatsApp/platform content

## Communication Flow

### Monthly Investor Update

```
Old way:
  Write email → Send via Gmail → Hope it doesn't go to spam
  → Investor reads 3 days later → Replies with questions

New way:
  Publish update on platform → WhatsApp alert: "May update live"
  → Investor taps link → Reads on platform
  → Comments/questions in platform thread
  → gtcx-agent alerts you via WhatsApp: "Jane commented"
```

### Follow-Up Sequence

```
Day 0:  WhatsApp: "Hi Jane, deck is ready: [platform link]"
Day 1:  WhatsApp: "Quick reminder — deck waiting for you"
Day 3:  WhatsApp: "Can we schedule 15 min to discuss? [calendly link]"
Day 7:  Platform notification: "Jane hasn't viewed deck in 7 days"
Day 14: WhatsApp: "Final follow-up — still interested?"
Day 21: Archive thread, mark as passed in CRM
```

### Document Signing

```
Old way:
  Email NDA → They print, sign, scan, email back → You file in Drive

New way:
  WhatsApp: "NDA ready for signature: [platform link]"
  → Investor opens platform → Reviews in document room
  → E-signs via integrated signature (DocuSign/Yousign)
  → Signed document auto-saved to platform
  → WhatsApp: "Signed NDA received. Next steps: [link]"
```

## WhatsApp Template Strategy

### Template Categories

| Category | Purpose | Frequency |
|----------|---------|-----------|
| `investor-update` | Monthly/quarterly reports | Monthly |
| `document-ready` | Documents available for review | As needed |
| `meeting-request` | Schedule calls/meetings | Weekly |
| `deadline-alert` | Approvals, signatures needed | As needed |
| `milestone` | Product launches, partnerships | As needed |
| `passive-nurture` | Keep warm when no active deal | Bi-weekly |

### Message Tone

**WhatsApp is conversational, not corporate:**

❌ Bad: "Please find attached the Q2 2026 investor update for your review."

✅ Good: "Hi Jane — Q2 numbers are in. Strong quarter: 15K users, $120K revenue. Full breakdown here: [link] Any questions, just reply."

## Platform Investor Hub Schema

```typescript
interface InvestorHub {
  // Identity
  investor_id: string;
  tier: 'lead' | 'co_lead' | 'participant' | 'prospect';
  
  // Communications
  threads: Thread[];           // Unified comms (WhatsApp + platform)
  documents: Document[];       // All shared documents
  updates: Update[];           // Monthly/quarterly reports
  
  // Portfolio
  commitments: Commitment[];   // Investment amounts, dates
  portfolio_value: number;
  ownership_percentage: number;
  
  // Governance
  votes: Vote[];              // Active and historical votes
  board_meetings: Meeting[];  // Scheduled and past
  
  // Actions
  pending_actions: Action[];   // Signatures, approvals, responses needed
  
  // Analytics
  engagement_score: number;    // Platform activity + WhatsApp responsiveness
  last_login: string;
  last_whatsapp_interaction: string;
}
```

## Orchestrator Rules (WhatsApp-First)

| Rule | Trigger | Action | Channel |
|------|---------|--------|---------|
| `no-reply-24h` | WhatsApp sent, no reply | WhatsApp reminder | WhatsApp |
| `no-reply-72h` | Still no reply after 3 days | Platform notification + WhatsApp | Both |
| `no-reply-7d` | Still no reply after 7 days | Archive, mark as passed in CRM | Platform |
| `document-viewed` | Investor opens document | WhatsApp: "Questions?" | WhatsApp |
| `milestone-hit` | Product/company milestone | WhatsApp broadcast to relevant investors | WhatsApp |
| `deadline-approaching` | Signature/approval needed < 48h | WhatsApp urgent alert | WhatsApp |

## Migration Plan

### Phase 1: Stop Using Email (Now)
- [ ] Update investor CRM: mark WhatsApp as primary channel
- [ ] Create WhatsApp templates for all existing email templates
- [ ] Notify existing investors: "Moving investor comms to WhatsApp + Platform"

### Phase 2: Platform Launch (Sprint 47)
- [ ] Build investor dashboard in gtcx-markets/terminal-os
- [ ] Document room with access controls
- [ ] E-signature integration

### Phase 3: Full Migration (Sprint 48)
- [ ] All new investor onboarding via WhatsApp + Platform
- [ ] Email only for legal requirements
- [ ] Archive email channel for non-legal communications

## Email Minimalism Checklist

Before sending anything, ask:

- [ ] Is this legally required to be in writing/email?
- [ ] Can this be a WhatsApp message with a platform link?
- [ ] Can this live on the platform with a WhatsApp alert?
- [ ] Does the recipient actually prefer email? (ask them)

If the answer to all four is "no," use WhatsApp + Platform.

## Exception Handling

**When an investor insists on email:**
1. Acknowledge: "We typically use WhatsApp for speed, but happy to accommodate"
2. Set their CRM `preferred_channel` to `email`
3. gtcx-agent mirrors WhatsApp content to email automatically
4. They get the same information, just via their preferred channel

**When a jurisdiction requires email:**
1. gtcx-agent auto-generates and sends required email
2. No human writes the email
3. Email is always a mirror of WhatsApp/platform content
4. Email log saved for audit
