---
id: ARCH-001
title: "GTCX Operations — System Architecture"
version: "1.0"
effective_date: "2026-05-27"
owner: "ops@gtcx.io"
---

# GTCX Operations — System Architecture

> **One-liner:** Corporate operations as agentic software — legal, HR, finance, IP, fundraising, and multi-channel communications, versioned, observable, and machine-actionable.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           GTCX OPERATIONS                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Legal     │  │     HR      │  │   Finance   │  │    Fundraising      │ │
│  │  (YAML)     │  │  (YAML)     │  │  (YAML)     │  │    (YAML/JSON)      │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
│  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────────┴──────────┐ │
│  │   IP        │  │    CRM      │  │  Budgets    │  │   Deal Pipeline     │ │
│  │  (JSON)     │  │  (JSON)     │  │  (YAML)     │  │    (JSON)           │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
│         │                │                │                     │           │
│  ┌──────┴────────────────┴────────────────┴─────────────────────┴──────────┐ │
│  │                    COMMUNICATIONS LAYER                                   │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │ │
│  │  │ WhatsApp │  │  Email   │  │ Platform │  │  Slack   │  │ ClickUp  │  │ │
│  │  │ Business │  │ (Gmail)  │  │  Portal  │  │  Alerts  │  │  Sync    │  │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│         │                                                                     │
│  ┌──────┴────────────────────────────────────────────────────────────────────┐│
│  │                    ORCHESTRATION LAYER                                    ││
│  │  • Unified Thread Registry    • Audience-Aware Routing                   ││
│  │  • Cross-Channel Rules        • Follow-Up Sequences                      ││
│  │  • WhatsApp-First Strategy    • ClickUp Task Sync                        ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│         │                                                                     │
│  ┌──────┴────────────────────────────────────────────────────────────────────┐│
│  │                    GOOGLE WORKSPACE LAYER                                 ││
│  │  • Gmail API    • Calendar API    • Contacts API                         ││
│  │  • Drive API    • Sheets API      • Service Account Auth                 ││
│  └──────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. Domain Modules (Source of Truth in Git)

Each corporate function stores its canonical data as structured files:

| Module | Format | Location | Purpose |
|--------|--------|----------|---------|
| **Legal** | YAML | `legal/contracts/`, `legal/policies/` | Contract templates, policy definitions, jurisdiction configs |
| **HR** | YAML | `hr/roles/`, `hr/policies/` | Role definitions, compensation bands, policy handbooks |
| **Finance** | YAML | `finance/budgets/` | Department budgets with variance tracking, runway projections |
| **IP** | JSON | `ip/registry.json` | Patent, trademark, trade secret registry with status pipelines |
| **Fundraising** | JSON/YAML | `fundraising/pipeline/`, `fundraising/investors/` | Deal stages, investor profiles, pitch materials |
| **CRM** | JSON | `crm/contacts.json`, `crm/companies.json`, `crm/interactions.json` | Contact management with interaction history |

### 2. Communications Layer

Multi-channel communication with audience-aware routing:

| Channel | Primary Use | Audience | Provider |
|---------|-------------|----------|----------|
| **WhatsApp** | Producers, partners, field ops | African producers/frontier markets | Twilio + Meta Cloud API |
| **Email** | Investors, legal, vendors | Institutional LPs, legal counsel | Gmail API |
| **Platform** | Investor portal | LP dashboard, deal room | `gtcx-markets` portal |
| **ClickUp** | Task tracking | Internal ops team | ClickUp API v2 |
| **Slack** | Alerts, blockers | Engineering, ops | Webhooks |

**Audience Segmentation Rule:**
- **WhatsApp** → Producers, partners, field operators (African frontier markets)
- **Platform + Email** → Investors (institutional LPs expect portal experience)
- **Email only** → Legal, vendors, compliance (audit trail required)
- **Telegram** → Community/retail only (never for institutional investors)

### 3. Orchestration Layer

The cross-channel orchestration engine (`scripts/orchestrate-cross-channel.ts`) manages:

- **Unified Thread Registry** (`threads/registry.json`) — all conversations across all channels in one place
- **Audience-Aware Routing** — determines primary channel based on contact type
- **Follow-Up Sequences** — time-based drip campaigns per audience segment
- **WhatsApp-First Rules** — 24h, 72h, 7-day no-reply triggers
- **Stale Thread Re-engagement** — 14-day revival campaigns
- **ClickUp Sync** — pending follow-ups become ClickUp tasks automatically

### 4. Google Workspace Layer

Service account authentication with domain-wide delegation:

| API | Scope | Use Case | Client |
|-----|-------|----------|--------|
| **Gmail** | `gmail.send`, `gmail.readonly` | Send investor updates, legal notices | `src/utils/gmail-client.ts` |
| **Calendar** | `calendar`, `calendar.events` | Schedule follow-ups, board meetings | `src/utils/calendar-client.ts` |
| **Contacts** | `contacts` | Sync CRM to Google Contacts | `src/utils/contacts-client.ts` |
| **Drive** | `drive`, `drive.file` | Store contracts, pitch decks | `src/utils/drive-client.ts` |
| **Sheets** | `spreadsheets` | Budget dashboards, investor reports | `src/utils/sheets-client.ts` |

**Auth:** JWT-based service account (`src/utils/google-auth.ts`) with domain-wide delegation for `ops@gtcx.io`.

## Data Flow

### Communication Thread Lifecycle

```
1. Contact identified (CRM lookup)
   └─> Audience type determined (investor/producer/partner/vendor)

2. Primary channel selected
   └─> investor → email | producer → whatsapp | vendor → email

3. Message sent via channel-specific client
   └─> WhatsApp: Twilio API | Email: Gmail API | Platform: gtcx-markets API

4. Message logged to Unified Thread Registry
   └─> thread.messages.push({ channel, direction, body, timestamp })

5. Orchestrator evaluates rules
   └─> No reply after 24h? → Schedule WhatsApp follow-up
   └─> No reply after 72h? → Final WhatsApp + platform notification
   └─> No reply after 7d? → Archive thread, mark passed in CRM
   └─> Thread stale 14d? → Re-engagement campaign

6. Pending follow-ups synced to ClickUp
   └─> Each pending follow-up becomes a ClickUp task with context

7. Follow-up executed at scheduled time
   └─> Channel client sends message
   └─> Thread registry updated
   └─> CRM interaction log updated
```

### Budget Sync Flow

```
1. Budget YAML updated in finance/budgets/
2. pnpm sync:budgets reads YAML
3. Variance calculated against previous snapshot
4. Google Sheets updated via Sheets API
5. Alert generated if variance > threshold
```

### Contract Generation Flow

```
1. Template selected (NDA, MSA, Term Sheet, etc.)
2. Variables injected from CRM/JSON context
3. Document generated from markdown template
4. Optionally uploaded to Google Drive
5. Logged to legal/contracts/registry.json
```

## File Organization

```
gtcx-operations/
├── src/
│   ├── schemas/           # Zod validation schemas
│   │   ├── budget.ts
│   │   ├── contract.ts
│   │   ├── crm.ts
│   │   ├── email.ts
│   │   ├── fundraising.ts
│   │   ├── ip-asset.ts
│   │   ├── thread.ts
│   │   └── whatsapp.ts
│   └── utils/             # API clients and utilities
│       ├── calendar-client.ts
│       ├── contacts-client.ts
│       ├── drive-client.ts
│       ├── email-provider.ts
│       ├── files.ts
│       ├── gmail-client.ts
│       ├── google-auth.ts
│       ├── sheets-client.ts
│       ├── validate.ts
│       └── whatsapp-client.ts
├── scripts/               # Automation scripts
│   ├── calendar-schedule.ts
│   ├── check-budgets.ts
│   ├── check-credentials.ts
│   ├── clickup-sync.ts
│   ├── crm-report.ts
│   ├── crm-sync-google.ts
│   ├── email-send.ts
│   ├── generate-contract.ts
│   ├── ip-check.ts
│   ├── lint-policies.ts
│   ├── orchestrate-cross-channel.ts
│   ├── pipeline-status.ts
│   ├── sheets-sync-budgets.ts
│   ├── sync-budgets.ts
│   ├── test-integrations.ts
│   ├── threads-build.ts
│   ├── validate.ts
│   └── whatsapp-send.ts
├── crm/                   # CRM data (JSON)
│   ├── companies.json
│   ├── contacts.json
│   ├── interactions.json
│   └── report.md
├── email/                 # Email operations
│   ├── config/
│   │   └── provider.yaml
│   ├── sent/
│   └── templates/
│       ├── investor-update.md
│       └── welcome.md
├── threads/               # Unified thread registry
│   └── registry.json
├── orchestration/         # Orchestration reports
│   └── report.md
├── whatsapp/              # WhatsApp operations
│   ├── config/
│   │   └── provider.yaml
│   ├── sent/
│   └── templates/
│       ├── follow-up.md
│       └── welcome.md
├── legal/                 # Legal domain
├── hr/                    # HR domain
├── finance/               # Finance domain
├── ip/                    # IP registry
├── fundraising/           # Fundraising pipeline
└── ops/                   # Operations runbooks
```

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `CLICKUP_API_TOKEN` | Yes (for sync) | ClickUp API authentication |
| `CLICKUP_TEAM_ID` | Yes (for sync) | ClickUp team/workspace ID |
| `INTERNAL_SERVICE_TOKEN` | Yes (for scripts) | Service account JWT for inter-service auth |
| `GMAIL_CREDENTIALS_PATH` | No (defaults to `.secrets/gmail-credentials.json`) | Gmail service account JSON |
| `WORKSPACE_CREDENTIALS_PATH` | No (defaults to `.secrets/workspace-credentials.json`) | Google Workspace service account JSON |
| `TWILIO_ACCOUNT_SID` | No | Twilio WhatsApp provider |
| `TWILIO_AUTH_TOKEN` | No | Twilio WhatsApp provider |
| `WHATSAPP_PROVIDER` | No | `twilio`, `meta`, or `mock` |

## Validation & Testing

All schemas are validated with Zod. Run the full validation suite:

```bash
pnpm validate          # Validate all contracts, policies, budgets
pnpm test              # Run Vitest test suite
pnpm check:credentials # Verify Google Workspace credentials exist
pnpm test:integrations # Test all API integrations (dry-run)
```

**Test coverage:** 29 tests covering budget validation, IP registry, CRM operations, email schemas, WhatsApp templates, and cross-channel orchestration rules.

## Security

- **`.secrets/`** is gitignored — never commit credentials
- Service account keys rotated every 90 days
- Domain-wide delegation restricted to `ops@gtcx.io`
- Email audit trail in `email/sent/` (JSON logs with timestamps)
- WhatsApp message audit trail in `whatsapp/sent/` (JSON logs)

## Integration Points

| External System | Integration | Direction | Status |
|-----------------|-------------|-----------|--------|
| **Google Workspace** | Gmail, Calendar, Contacts, Drive, Sheets | Bidirectional | ✅ Implemented |
| **ClickUp** | Task creation, sync | Outbound (read-only mirror) | ✅ Implemented |
| **Twilio** | WhatsApp Business API | Outbound | ✅ Implemented |
| **Meta Cloud API** | WhatsApp Business API | Outbound | ✅ Implemented |
| **gtcx-markets** | Investor portal, deal room | Event-driven | 🚧 Planned |
| **baseline-os** | Coordination hub, workstream sync | Inbound (reports to) | ✅ Implemented |

## Next Evolution

1. **Event bus integration** — publish domain events to `gtcx-core` event bus
2. **gtcx-markets portal integration** — push investor notifications to portal
3. **Nyota-AI integration** — shared infrastructure patterns, separate channels
4. **ComplianceOS integration** — audit trails feed compliance evidence store
