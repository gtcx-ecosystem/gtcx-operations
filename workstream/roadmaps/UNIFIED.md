# Unified Roadmap — GTCX Ecosystem

*Generated: 2026-05-27T13:27:09.121Z*

## Summary

| Metric | Value |
|--------|-------|
| Repos with roadmaps | 8/25 |
| Total epics | 126 |
| P1 epics | 31 |
| Done | 5 |
| In progress | 13 |
| Planned | 108 |

## Gantt Overview

```
Repo           Jun 2026   Jul 2026   Aug 2026   Sep 2026   Oct 2026   Nov 2026
─────────────  ─────────  ─────────  ─────────  ─────────  ─────────  ─────────
baseline-os                                                                                
griot-ai                                                                                   
gtcx-core                                                                                  
gtcx-markets                                                                               
gtcx-operatio                                                                              
gtcx-platform                                                                              
gtcx-protocol                                                                              
terminal-os                                                                                
```

**Legend:** `█` = P1 (critical) | `▓` = P2 (important) | `░` = P3 (icebox)

## P1 Critical Epics

| Epic | Repo | Quarter | Status | Owner | Dependencies |
|------|------|---------|--------|-------|-------------|
| Populate sprint docs across 21 repos | baseline-os | Coordination Activation | 🚧 In Progress | @amanianai | — |
| Fix daily standup git detection | baseline-os | Coordination Activation | 🚧 In Progress | @amanianai | — |
| Resolve 4 P0 critical path blockers | baseline-os | Coordination Activation | 🚧 In Progress | @amanianai | gtcx-intelligence |
| Fix desktop test regression | baseline-os | Coordination Activation | 🚧 In Progress | @amanianai | — |
| Fix API contract + MCP manifest paths | baseline-os | Coordination Activation | 📋 Planned | @amanianai | — |
| gtcx-agentic adopts baselineos runtime | baseline-os | Agentic Runtime | 📋 Planned | @amanianai | gtcx-agentic |
| Standardize `.agent/config/` pattern | baseline-os | Agentic Runtime | 📋 Planned | @amanianai | all repos |
| Desktop app ecosystem widget | baseline-os | Agentic Runtime | 📋 Planned | @amanianai | desktop team |
| Stabilize 233+ RSS feed ingestion | griot-ai | Feed Stability & Veritas | 🚧 In Progress | @amanianai | — |
| Event bus integration (publish/subscribe) | griot-ai | Deal Intelligence & Events | 📋 Planned | @amanianai | gtcx-core |
| Fix type drift (Prisma ↔ TS Deal type) | gtcx-core | Shared Types & Crypto | 🚧 In Progress | @amanianai | gtcx-markets |
| Standardize `@gtcx/crypto` package | gtcx-core | Shared Types & Crypto | 📋 Planned | @amanianai | — |
| Publish `@gtcx/types` v1.0 | gtcx-core | Shared Types & Crypto | 📋 Planned | @amanianai | — |
| Cross-repo event bus (typed events) | gtcx-core | Event Bus & SDK | 📋 Planned | @amanianai | all repos |
| Investor dashboard (threads, docs, votes, notifications, activity) | gtcx-markets | Investor Dashboard & Deal Pipeline | ✅ Done | @amanianai | baseline-os |
| Deal pipeline (advisory detail + investor deal room) | gtcx-markets | Investor Dashboard & Deal Pipeline | ✅ Done | @amanianai | advisory-api |
| Database migration (Prisma schema extensions) | gtcx-markets | Investor Dashboard & Deal Pipeline | 🚧 In Progress | @amanianai | — |
| Complete architecture docs | gtcx-operations | Documentation & ClickUp Activation | ✅ Done | @amanianai | — |
| Complete workflow runbooks | gtcx-operations | Documentation & ClickUp Activation | ✅ Done | @amanianai | — |
| Complete API reference | gtcx-operations | Documentation & ClickUp Activation | ✅ Done | @amanianai | — |
| Fix ClickUp list ID mapping | gtcx-operations | Documentation & ClickUp Activation | 🚧 In Progress | @amanianai | baseline-os |
| Place Google Workspace credentials | gtcx-operations | Documentation & ClickUp Activation | 🚧 In Progress | @amanianai | — |
| Event bus integration (publish) | gtcx-operations | Event-Driven Operations | 📋 Planned | @amanianai | gtcx-core |
| Push investor notifications to gtcx-markets portal | gtcx-operations | Event-Driven Operations | 📋 Planned | @amanianai | gtcx-markets |
| Replace mock data with API calls | gtcx-platforms | AGX Scaffold & Tenant Routing | 🚧 In Progress | @amanianai | — |
| Tenant URL-level scoping | gtcx-platforms | AGX Scaffold & Tenant Routing | 🚧 In Progress | @amanianai | — |
| Real JWT auth (replace devToken) | gtcx-platforms | AGX Scaffold & Tenant Routing | 📋 Planned | @amanianai | — |
| TradePass v1.0 spec (DID identity) | gtcx-protocols | Specification Completeness | 🚧 In Progress | @amanianai | — |
| Fix zero runtime integration with gtcx-core | terminal-os | AGX Proxy & DealRoom | 📋 Planned | @amanianai | gtcx-core |
| Adopt `@gtcx/sdk` for protocol calls | terminal-os | SDK & Events | 📋 Planned | @amanianai | gtcx-core |
| Event-driven UI updates (SSE/webhooks) | terminal-os | SDK & Events | 📋 Planned | @amanianai | gtcx-core |

## Per-Repo Summary

### baseline-os

> **North Star:** The orchestration hub of the GTCX ecosystem — every repo coordinates through BaselineOS, and every agent operates with trust, context, and accountability.

**Owner:** @amanianai | **Epics:** 20 | **P1:** 8

| Epic | Priority | Status | Quarter |
|------|----------|--------|---------|
| Populate sprint docs across 21 repos | P1 | 🚧 In Progress | Coordination Activation |
| Fix daily standup git detection | P1 | 🚧 In Progress | Coordination Activation |
| Resolve 4 P0 critical path blockers | P1 | 🚧 In Progress | Coordination Activation |
| Fix desktop test regression | P1 | 🚧 In Progress | Coordination Activation |
| Fix API contract + MCP manifest paths | P1 | 📋 Planned | Coordination Activation |
| Fix folder hygiene (25→30/35) | P2 | 📋 Planned | Coordination Activation |
| gtcx-agentic adopts baselineos runtime | P1 | 📋 Planned | Agentic Runtime |
| Standardize `.agent/config/` pattern | P1 | 📋 Planned | Agentic Runtime |
| Desktop app ecosystem widget | P1 | 📋 Planned | Agentic Runtime |
| Add tests to gtcx-agile | P2 | 📋 Planned | Agentic Runtime |
| Property-based testing (2+ packages) | P2 | 📋 Planned | Agentic Runtime |
| SBOM artifact generation | P2 | 📋 Planned | Agentic Runtime |
| Cross-repo event bus (gtcx-core) | P2 | 📋 Planned | Event Bus & Ecosystem Maturity |
| Real-time coordination dashboard | P3 | 🧊 Icebox | Event Bus & Ecosystem Maturity |
| Automated release pipeline | P3 | 🧊 Icebox | Event Bus & Ecosystem Maturity |
| gtcx-agentic resists adopting baselineos | P3 | 📋 Planned | Event Bus & Ecosystem Maturity |
| Protocol definitions | P3 | 📋 Planned | Event Bus & Ecosystem Maturity |
| gtcx-operations | P3 | 📋 Planned | Event Bus & Ecosystem Maturity |
| gtcx-markets | P3 | 📋 Planned | Event Bus & Ecosystem Maturity |
| P0 blockers resolved | P3 | 📋 Planned | Event Bus & Ecosystem Maturity |

### compliance-os

⚠️ No roadmap found. Create `01-docs/05-audit/agile/roadmap.md`.

### exploration-os

⚠️ No roadmap found. Create `01-docs/05-audit/agile/roadmap.md`.

### griot-ai

> **North Star:** The intelligence media engine of the GTCX ecosystem — synthesizing raw data into actionable intelligence for 54 African jurisdictions via the THESIS AI engine.

**Owner:** @amanianai | **Epics:** 11 | **P1:** 2

| Epic | Priority | Status | Quarter |
|------|----------|--------|---------|
| Stabilize 233+ RSS feed ingestion | P1 | 🚧 In Progress | Feed Stability & Veritas |
| Veritas54 attestation production | P2 | 📋 Planned | Feed Stability & Veritas |
| THESIS engine performance tuning | P2 | 📋 Planned | Feed Stability & Veritas |
| YouTube transcript pipeline | P2 | 📋 Planned | Feed Stability & Veritas |
| Consume gtcx-markets deal data | P2 | 📋 Planned | Deal Intelligence & Events |
| Event bus integration (publish/subscribe) | P1 | 📋 Planned | Deal Intelligence & Events |
| Real-time CTII/CDII score feeds | P2 | 📋 Planned | Deal Intelligence & Events |
| DealRoom54 attestation linking | P2 | 📋 Planned | Deal Intelligence & Events |
| PANX price feed integration | P3 | 🧊 Icebox | Market Intelligence |
| Frontier54 auto-opportunity generation | P3 | 🧊 Icebox | Market Intelligence |
| Executive54 personalized briefings | P3 | 🧊 Icebox | Market Intelligence |

### gtcx-agentic

⚠️ No roadmap found. Create `01-docs/05-audit/agile/roadmap.md`.

### gtcx-agile

⚠️ No roadmap found. Create `01-docs/05-audit/agile/roadmap.md`.

### gtcx-core

> **North Star:** The shared foundation of the GTCX ecosystem — types, crypto primitives, event schemas, and SDKs that every repo depends on.

**Owner:** @amanianai | **Epics:** 13 | **P1:** 4

| Epic | Priority | Status | Quarter |
|------|----------|--------|---------|
| Fix type drift (Prisma ↔ TS Deal type) | P1 | 🚧 In Progress | Shared Types & Crypto |
| Standardize `@gtcx/crypto` package | P1 | 📋 Planned | Shared Types & Crypto |
| Publish `@gtcx/types` v1.0 | P1 | 📋 Planned | Shared Types & Crypto |
| SLSA provenance spec for builds | P2 | 📋 Planned | Shared Types & Crypto |
| Cross-repo event bus (typed events) | P1 | 📋 Planned | Event Bus & SDK |
| `@gtcx/sdk` v1.0 with protocol clients | P2 | 📋 Planned | Event Bus & SDK |
| Runtime integration with terminal-os | P2 | 📋 Planned | Event Bus & SDK |
| Runtime integration with griot-ai | P2 | 📋 Planned | Event Bus & SDK |
| OpenAPI spec validation | P2 | 📋 Planned | Event Bus & SDK |
| PvP atomic settlement protocol | P3 | 🧊 Icebox | Settlement & Maturity |
| SDK coverage: 100% of platform APIs | P3 | 🧊 Icebox | Settlement & Maturity |
| Ecosystem integration score 8.0+ | P3 | 🧊 Icebox | Settlement & Maturity |
| Protocol specs | P3 | 📋 Planned | Settlement & Maturity |

### gtcx-docs

⚠️ No roadmap found. Create `01-docs/05-audit/agile/roadmap.md`.

### gtcx-hardware

⚠️ No roadmap found. Create `01-docs/05-audit/agile/roadmap.md`.

### gtcx-infrastructure

⚠️ No roadmap found. Create `01-docs/05-audit/agile/roadmap.md`.

### gtcx-intelligence

⚠️ No roadmap found. Create `01-docs/05-audit/agile/roadmap.md`.

### gtcx-markets

> **North Star:** The AI-native dealer-broker for African exploration markets — where deals are originated, structured, and funded with institutional-grade governance and LP transparency.

**Owner:** @amanianai | **Epics:** 22 | **P1:** 3

| Epic | Priority | Status | Quarter |
|------|----------|--------|---------|
| Investor dashboard (threads, docs, votes, notifications, activity) | P1 | ✅ Done | Investor Dashboard & Deal Pipeline |
| Deal pipeline (advisory detail + investor deal room) | P1 | ✅ Done | Investor Dashboard & Deal Pipeline |
| Database migration (Prisma schema extensions) | P1 | 🚧 In Progress | Investor Dashboard & Deal Pipeline |
| Seed demo data for investor dashboard | P2 | 📋 Planned | Investor Dashboard & Deal Pipeline |
| Deal edit page (`/deals/:id/edit`) | P2 | 📋 Planned | Investor Dashboard & Deal Pipeline |
| Wire memo generation from deal detail | P2 | 📋 Planned | AI Memo Generation & EIX Tier 1 |
| Wire term sheet execution UI | P2 | 📋 Planned | AI Memo Generation & EIX Tier 1 |
| "Express interest" in portal deal detail | P2 | 📋 Planned | AI Memo Generation & EIX Tier 1 |
| Investor interest tracking model | P2 | 📋 Planned | AI Memo Generation & EIX Tier 1 |
| EIX Tier 1 matching engine (equipment finance) | P2 | 📋 Planned | AI Memo Generation & EIX Tier 1 |
| Capital call payment UI in portal | P2 | 📋 Planned | AI Memo Generation & EIX Tier 1 |
| Auto-origination from ExplorationOS | P3 | 🧊 Icebox | Automation & AGX Extension |
| EIX Tier 2 (AGX order types) | P3 | 🧊 Icebox | Automation & AGX Extension |
| Full settlement trace for LPs | P3 | 🧊 Icebox | Automation & AGX Extension |
| Portfolio construction tools | P3 | 🧊 Icebox | Automation & AGX Extension |
| DATABASE_URL not available | P3 | 📋 Planned | Automation & AGX Extension |
| ExplorationOS bankability API unstable | P3 | 📋 Planned | Automation & AGX Extension |
| ExplorationOS bankability | P3 | 📋 Planned | Automation & AGX Extension |
| Compliance for KYC | P3 | 📋 Planned | Automation & AGX Extension |
| gtcx-operations | P3 | 📋 Planned | Automation & AGX Extension |
| baseline-os | P3 | 📋 Planned | Automation & AGX Extension |
| Portal page load time | P3 | 📋 Planned | Automation & AGX Extension |

### gtcx-mobile

⚠️ No roadmap found. Create `01-docs/05-audit/agile/roadmap.md`.

### gtcx-operations

> **North Star:** Corporate operations run as agentic software — every communication, contract, budget, and follow-up is versioned, routed, and observable across the GTCX ecosystem.

**Owner:** @amanianai | **Epics:** 21 | **P1:** 7

| Epic | Priority | Status | Quarter |
|------|----------|--------|---------|
| Complete architecture docs | P1 | ✅ Done | Documentation & ClickUp Activation |
| Complete workflow runbooks | P1 | ✅ Done | Documentation & ClickUp Activation |
| Complete API reference | P1 | ✅ Done | Documentation & ClickUp Activation |
| Fix ClickUp list ID mapping | P1 | 🚧 In Progress | Documentation & ClickUp Activation |
| Place Google Workspace credentials | P1 | 🚧 In Progress | Documentation & ClickUp Activation |
| Test all integrations end-to-end | P2 | 📋 Planned | Documentation & ClickUp Activation |
| Event bus integration (publish) | P1 | 📋 Planned | Event-Driven Operations |
| Push investor notifications to gtcx-markets portal | P1 | 📋 Planned | Event-Driven Operations |
| Automated WhatsApp campaign runner | P2 | 📋 Planned | Event-Driven Operations |
| CRM bidirectional sync with Google Contacts | P2 | 📋 Planned | Event-Driven Operations |
| Budget variance alerts (Slack + email) | P2 | 📋 Planned | Event-Driven Operations |
| Auto-execute scheduled follow-ups | P2 | 📋 Planned | Autonomous Operations |
| Monthly compliance report generation | P2 | 📋 Planned | Autonomous Operations |
| Nyota-AI event sharing | P3 | 🧊 Icebox | Autonomous Operations |
| AI-powered contract review | P3 | 🧊 Icebox | Autonomous Operations |
| WhatsApp API rate limits | P3 | 📋 Planned | Autonomous Operations |
| Portal notification API | P3 | 📋 Planned | Autonomous Operations |
| Coordination reports | P3 | 📋 Planned | Autonomous Operations |
| gtcx-markets | P3 | 📋 Planned | Autonomous Operations |
| baseline-os | P3 | 📋 Planned | Autonomous Operations |
| Google APIs operational | P3 | 📋 Planned | Autonomous Operations |

### gtcx-platforms

> **North Star:** The six sovereign digital platforms of the GTCX ecosystem — CRX, SGX, AGX, Pathways, Veritas, and Operations — enabling compliant, traceable commodity trade across Africa.

**Owner:** @amanianai | **Epics:** 11 | **P1:** 3

| Epic | Priority | Status | Quarter |
|------|----------|--------|---------|
| Replace mock data with API calls | P1 | 🚧 In Progress | AGX Scaffold & Tenant Routing |
| Tenant URL-level scoping | P1 | 🚧 In Progress | AGX Scaffold & Tenant Routing |
| Real JWT auth (replace devToken) | P1 | 📋 Planned | AGX Scaffold & Tenant Routing |
| AGX dashboard v0.2 | P2 | 📋 Planned | AGX Scaffold & Tenant Routing |
| CRX permit validation API | P2 | 📋 Planned | CRX + SGX & End-to-End |
| SGX settlement gateway | P2 | 📋 Planned | CRX + SGX & End-to-End |
| End-to-end CRX→SGX→AGX protocol tests | P3 | 📋 Planned | CRX + SGX & End-to-End |
| AGX buyer verification (TradePass) | P2 | 📋 Planned | CRX + SGX & End-to-End |
| AGX live transactions (pilot) | P3 | 🧊 Icebox | Production Readiness |
| Multi-tenant deployment | P3 | 🧊 Icebox | Production Readiness |
| EIX Tier 2 order types | P3 | 🧊 Icebox | Production Readiness |

### gtcx-protocols

> **North Star:** The protocol layer of the GTCX ecosystem — TradePass, GeoTag, GCI, PvP, PANX, and VaultMark — providing identity, provenance, compliance, settlement, price consensus, and custody verification.

**Owner:** @amanianai | **Epics:** 17 | **P1:** 1

| Epic | Priority | Status | Quarter |
|------|----------|--------|---------|
| TradePass v1.0 spec (DID identity) | P1 | 🚧 In Progress | Specification Completeness |
| GeoTag v1.0 spec (provenance) | P2 | 📋 Planned | Specification Completeness |
| GCI v1.0 spec (compliance scoring) | P2 | 📋 Planned | Specification Completeness |
| VaultMark v1.0 spec (custody) | P2 | 📋 Planned | Specification Completeness |
| PANX v0.9 spec (price oracle) | P2 | 📋 Planned | Specification Completeness |
| PvP v0.9 spec (atomic settlement) | P2 | 📋 Planned | Specification Completeness |
| TradePass reference implementation | P2 | 📋 Planned | Reference Implementations |
| GCI scoring engine (PREMIUM/VERIFIED/PROVISIONAL) | P2 | 📋 Planned | Reference Implementations |
| PANX pBFT consensus testnet | P3 | 📋 Planned | Reference Implementations |
| Protocol SDK consumed by 3+ repos | P2 | 📋 Planned | Reference Implementations |
| TradePass production deployment | P3 | 🧊 Icebox | Production Protocols |
| GCI production scoring | P3 | 🧊 Icebox | Production Protocols |
| PANX mainnet price feed | P3 | 🧊 Icebox | Production Protocols |
| PvP first atomic settlement | P3 | 🧊 Icebox | Production Protocols |
| Protocols with v1.0 specs | P3 | 📋 Planned | Production Protocols |
| Protocol imports by repos | P3 | 📋 Planned | Production Protocols |
| Production protocols | P3 | 📋 Planned | Production Protocols |

### ledger-ui

⚠️ No roadmap found. Create `01-docs/05-audit/agile/roadmap.md`.

### ledger-ui-archive

⚠️ No roadmap found. Create `01-docs/05-audit/agile/roadmap.md`.

### nyota-ai

⚠️ No roadmap found. Create `01-docs/05-audit/agile/roadmap.md`.

### scripts

⚠️ No roadmap found. Create `01-docs/05-audit/agile/roadmap.md`.

### sensei-ai

⚠️ No roadmap found. Create `01-docs/05-audit/agile/roadmap.md`.

### terminal-os

> **North Star:** The Bloomberg Terminal for African commodities — real-time intelligence, deal execution, and portfolio management across 54 jurisdictions.

**Owner:** @amanianai | **Epics:** 11 | **P1:** 3

| Epic | Priority | Status | Quarter |
|------|----------|--------|---------|
| AGX proxy routes (listings, trades) | P2 | 🚧 In Progress | AGX Proxy & DealRoom |
| DealRoom54 integration with gtcx-markets | P2 | 📋 Planned | AGX Proxy & DealRoom |
| TradeDesk54 real-time signal feed | P2 | 📋 Planned | AGX Proxy & DealRoom |
| Fix zero runtime integration with gtcx-core | P1 | 📋 Planned | AGX Proxy & DealRoom |
| Adopt `@gtcx/sdk` for protocol calls | P1 | 📋 Planned | SDK & Events |
| Event-driven UI updates (SSE/webhooks) | P1 | 📋 Planned | SDK & Events |
| griotFetch() gateway production hardening | P2 | 📋 Planned | SDK & Events |
| Ledger54 settlement trace viewer | P2 | 📋 Planned | SDK & Events |
| Real-time PANX price feed | P3 | 🧊 Icebox | Real-Time & Mobile |
| Mobile-responsive TradeDesk54 | P3 | 🧊 Icebox | Real-Time & Mobile |
| EIX order book in TradeDesk54 | P3 | 🧊 Icebox | Real-Time & Mobile |

### terra-os

⚠️ No roadmap found. Create `01-docs/05-audit/agile/roadmap.md`.

### veritas-ai

⚠️ No roadmap found. Create `01-docs/05-audit/agile/roadmap.md`.

### workstream

⚠️ No roadmap found. Create `01-docs/05-audit/agile/roadmap.md`.

