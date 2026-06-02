# GTCX Operations

Corporate operations as agentic software. Legal, HR, finance, IP, fundraising, multi-channel communications, and cross-repo orchestration — versioned, observable, and machine-actionable.

## Purpose

This repo treats corporate functions as software modules:
- **Contracts** as structured data with lifecycle states
- **Policies** as code with versioned diffs
- **Budgets** as machine-readable YAML with variance tracking
- **IP** as structured asset registry with status pipelines
- **Fundraising** as deal-flow pipelines with investor-state tracking
- **Communications** as audience-aware, cross-channel orchestration
- **CRM** as unified thread registry with automated follow-ups

## Quick Start

```bash
# Install dependencies
pnpm install

# Validate all contracts, policies, budgets
pnpm validate

# Test all integrations (dry-run)
pnpm test:integrations

# Run full test suite
pnpm test

# Build unified thread registry
pnpm threads:build

# Run cross-channel orchestration
pnpm orchestrate:cross-channel

# Sync follow-ups to ClickUp
pnpm clickup:sync
```

## Documentation

| Doc | Location | Description |
|-----|----------|-------------|
| **System Architecture** | [docs/architecture/overview.md](docs/architecture/overview.md) | Full architecture diagram, data flows, component breakdown |
| **API Reference** | [docs/api/README.md](docs/api/README.md) | Google Workspace clients, WhatsApp client, email provider, schemas, CLI scripts |
| **ClickUp Sync** | [docs/workflows/clickup-sync.md](docs/workflows/clickup-sync.md) | Follow-up → ClickUp task sync workflow |
| **Cross-Channel Orchestration** | [docs/workflows/cross-channel-orchestration.md](docs/workflows/cross-channel-orchestration.md) | WhatsApp-first rules, audience routing, thread lifecycle |
| **Google Workspace Setup** | [docs/ops/google-workspace-setup.md](docs/ops/google-workspace-setup.md) | Service account creation, domain-wide delegation, API enablement |
| **Audience Segmentation** | [docs/strategy/audience-segmented-communications.md](docs/strategy/audience-segmented-communications.md) | Channel selection by contact type |
| **WhatsApp-First Strategy** | [docs/strategy/whatsapp-first-communications.md](docs/strategy/whatsapp-first-communications.md) | Why WhatsApp for African frontier markets |
| **Investor Communication** | [docs/strategy/investor-communication-research.md](docs/strategy/investor-communication-research.md) | Why platform portals, not Telegram/WhatsApp, for LPs |

## Directory Structure

```
gtcx-operations/
├── src/
│   ├── schemas/           # Zod validation schemas for all domains
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
├── legal/                 # Legal domain (YAML)
├── hr/                    # HR domain (YAML)
├── finance/               # Finance domain (YAML)
├── ip/                    # IP registry (JSON)
├── fundraising/           # Fundraising pipeline (JSON/YAML)
├── ops/                   # Operations runbooks
├── docs/                  # Documentation
│   ├── architecture/
│   ├── workflows/
│   ├── api/
│   ├── ops/
│   └── strategy/
└── tests/                 # Vitest test suite
```

## Agentic Operations

Every function follows the agentic pattern:

1. **Source of truth is git** — ClickUp, Notion, etc. are read-only mirrors
2. **Structured data first** — YAML/JSON contracts over prose
3. **Event-driven** — State changes emit events consumable by other repos
4. **Observable** — Metrics, SLAs, and progress are machine-readable
5. **Composable** — Functions expose APIs to the ecosystem

## Key Integrations

| External System | APIs | Status |
|-----------------|------|--------|
| **Google Workspace** | Gmail, Calendar, Contacts, Drive, Sheets | ✅ Operational |
| **Twilio** | WhatsApp Business API | ✅ Operational |
| **Meta Cloud API** | WhatsApp Business API | ✅ Operational |
| **ClickUp** | Task creation, sync | ✅ Operational (list ID TBD) |
| **gtcx-markets** | Investor portal, deal room | 🚧 Planned |
| **baseline-os** | Coordination hub, workstream sync | ✅ Operational |

## Environment Setup

### Required

```bash
# ClickUp (for sync)
export CLICKUP_API_TOKEN="pk_xxxxxxxx"
export CLICKUP_TEAM_ID="12345678"

# Inter-service auth
export INTERNAL_SERVICE_TOKEN="jwt-token-here"
```

### Optional

```bash
# Google Workspace (place JSON files in .secrets/)
export GMAIL_CREDENTIALS_PATH=".secrets/gmail-credentials.json"
export WORKSPACE_CREDENTIALS_PATH=".secrets/workspace-credentials.json"

# Twilio (for WhatsApp)
export TWILIO_ACCOUNT_SID="AC_xxxxxxxx"
export TWILIO_AUTH_TOKEN="xxxxxxxx"
export WHATSAPP_PROVIDER="twilio"  # twilio | meta | mock
```

### Credentials

Place service account JSON files in `.secrets/` (already gitignored):

```bash
mkdir -p .secrets
cp ~/Downloads/gmail-credentials.json .secrets/
cp ~/Downloads/workspace-credentials.json .secrets/
```

See [Google Workspace Setup](docs/ops/google-workspace-setup.md) for full instructions.

## Validation & Testing

```bash
# Validate all domain data
pnpm validate

# Run test suite
pnpm test

# Check credentials exist
pnpm check:credentials

# Test integrations (dry-run)
pnpm test:integrations
```

**Test coverage:** 29 Vitest tests covering budget validation, IP registry, CRM operations, email schemas, WhatsApp templates, and cross-channel orchestration rules.

## Security

- **`.secrets/`** is gitignored — never commit credentials
- Service account keys rotated every 90 days
- Domain-wide delegation restricted to `ops@gtcx.trade`
- Email audit trail in `email/sent/` (JSON logs)
- WhatsApp message audit trail in `whatsapp/sent/` (JSON logs)

## Status

🟢 **Operational** — Core integrations (Google Workspace, WhatsApp, ClickUp) are implemented and tested. Cross-channel orchestration is active. Documentation is comprehensive.
