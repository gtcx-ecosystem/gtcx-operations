# Cross-Repo Dependency Map

*Generated: 2026-05-27T13:27:09.122Z*

## Dependency Graph

```
baseline-os
  └──> gtcx-intelligence  (Resolve 4 P0 critical path blockers)
  └──> gtcx-agentic  (gtcx-agentic adopts baselineos runtime)
  └──> gtcx-agile  (Add tests to gtcx-agile)
  └──> gtcx-core  (Cross-repo event bus (gtcx-core))
griot-ai
  └──> gtcx-core  (Veritas54 attestation production)
  └──> gtcx-markets  (Consume gtcx-markets deal data)
  └──> gtcx-core  (Event bus integration (publish/subscribe))
  └──> terminal-os  (DealRoom54 attestation linking)
  └──> gtcx-protocols  (PANX price feed integration)
  └──> gtcx-markets  (Frontier54 auto-opportunity generation)
gtcx-core
  └──> gtcx-markets  (Fix type drift (Prisma ↔ TS Deal type))
  └──> gtcx-intelligence  (SLSA provenance spec for builds)
  └──> gtcx-protocols  (`@gtcx/sdk` v1.0 with protocol clients)
  └──> terminal-os  (Runtime integration with terminal-os)
  └──> griot-ai  (Runtime integration with griot-ai)
  └──> gtcx-protocols  (PvP atomic settlement protocol)
  └──> gtcx-platforms  (SDK coverage: 100% of platform APIs)
gtcx-markets
  └──> baseline-os  (Investor dashboard (threads, docs, votes, notifications, activity))
  └──> exploration-os  (Auto-origination from ExplorationOS)
  └──> gtcx-platforms  (EIX Tier 2 (AGX order types))
gtcx-operations
  └──> baseline-os  (Fix ClickUp list ID mapping)
  └──> gtcx-core  (Event bus integration (publish))
  └──> gtcx-markets  (Push investor notifications to gtcx-markets portal)
  └──> nyota-ai  (Nyota-AI event sharing)
  └──> griot-ai  (AI-powered contract review)
gtcx-platforms
  └──> compliance-os  (CRX permit validation API)
  └──> gtcx-markets  (SGX settlement gateway)
  └──> gtcx-protocols  (End-to-end CRX→SGX→AGX protocol tests)
  └──> gtcx-protocols  (AGX buyer verification (TradePass))
  └──> gtcx-markets  (AGX live transactions (pilot))
  └──> gtcx-infrastructure  (Multi-tenant deployment)
  └──> gtcx-markets  (EIX Tier 2 order types)
gtcx-protocols
  └──> compliance-os  (GCI v1.0 spec (compliance scoring))
  └──> gtcx-core  (PvP v0.9 spec (atomic settlement))
  └──> gtcx-platforms  (TradePass production deployment)
  └──> gtcx-platforms  (GCI production scoring)
  └──> gtcx-platforms  (PANX mainnet price feed)
  └──> gtcx-core  (PvP first atomic settlement)
terminal-os
  └──> gtcx-platforms  (AGX proxy routes (listings, trades))
  └──> gtcx-markets  (DealRoom54 integration with gtcx-markets)
  └──> griot-ai  (TradeDesk54 real-time signal feed)
  └──> gtcx-core  (Fix zero runtime integration with gtcx-core)
  └──> gtcx-core  (Adopt `@gtcx/sdk` for protocol calls)
  └──> gtcx-core  (Event-driven UI updates (SSE/webhooks))
  └──> griot-ai  (griotFetch() gateway production hardening)
  └──> gtcx-markets  (Ledger54 settlement trace viewer)
  └──> gtcx-protocols  (Real-time PANX price feed)
  └──> gtcx-mobile  (Mobile-responsive TradeDesk54)
  └──> gtcx-markets  (EIX order book in TradeDesk54)
```

## Dependency Table

| From | To | Epic |
|------|----|------|
| baseline-os | gtcx-intelligence | Resolve 4 P0 critical path blockers |
| baseline-os | gtcx-agentic | gtcx-agentic adopts baselineos runtime |
| baseline-os | gtcx-agile | Add tests to gtcx-agile |
| baseline-os | gtcx-core | Cross-repo event bus (gtcx-core) |
| griot-ai | gtcx-core | Veritas54 attestation production |
| griot-ai | gtcx-markets | Consume gtcx-markets deal data |
| griot-ai | gtcx-core | Event bus integration (publish/subscribe) |
| griot-ai | terminal-os | DealRoom54 attestation linking |
| griot-ai | gtcx-protocols | PANX price feed integration |
| griot-ai | gtcx-markets | Frontier54 auto-opportunity generation |
| gtcx-core | gtcx-markets | Fix type drift (Prisma ↔ TS Deal type) |
| gtcx-core | gtcx-intelligence | SLSA provenance spec for builds |
| gtcx-core | gtcx-protocols | `@gtcx/sdk` v1.0 with protocol clients |
| gtcx-core | terminal-os | Runtime integration with terminal-os |
| gtcx-core | griot-ai | Runtime integration with griot-ai |
| gtcx-core | gtcx-protocols | PvP atomic settlement protocol |
| gtcx-core | gtcx-platforms | SDK coverage: 100% of platform APIs |
| gtcx-markets | baseline-os | Investor dashboard (threads, docs, votes, notifications, activity) |
| gtcx-markets | exploration-os | Auto-origination from ExplorationOS |
| gtcx-markets | gtcx-platforms | EIX Tier 2 (AGX order types) |
| gtcx-operations | baseline-os | Fix ClickUp list ID mapping |
| gtcx-operations | gtcx-core | Event bus integration (publish) |
| gtcx-operations | gtcx-markets | Push investor notifications to gtcx-markets portal |
| gtcx-operations | nyota-ai | Nyota-AI event sharing |
| gtcx-operations | griot-ai | AI-powered contract review |
| gtcx-platforms | compliance-os | CRX permit validation API |
| gtcx-platforms | gtcx-markets | SGX settlement gateway |
| gtcx-platforms | gtcx-protocols | End-to-end CRX→SGX→AGX protocol tests |
| gtcx-platforms | gtcx-protocols | AGX buyer verification (TradePass) |
| gtcx-platforms | gtcx-markets | AGX live transactions (pilot) |
| gtcx-platforms | gtcx-infrastructure | Multi-tenant deployment |
| gtcx-platforms | gtcx-markets | EIX Tier 2 order types |
| gtcx-protocols | compliance-os | GCI v1.0 spec (compliance scoring) |
| gtcx-protocols | gtcx-core | PvP v0.9 spec (atomic settlement) |
| gtcx-protocols | gtcx-platforms | TradePass production deployment |
| gtcx-protocols | gtcx-platforms | GCI production scoring |
| gtcx-protocols | gtcx-platforms | PANX mainnet price feed |
| gtcx-protocols | gtcx-core | PvP first atomic settlement |
| terminal-os | gtcx-platforms | AGX proxy routes (listings, trades) |
| terminal-os | gtcx-markets | DealRoom54 integration with gtcx-markets |
| terminal-os | griot-ai | TradeDesk54 real-time signal feed |
| terminal-os | gtcx-core | Fix zero runtime integration with gtcx-core |
| terminal-os | gtcx-core | Adopt `@gtcx/sdk` for protocol calls |
| terminal-os | gtcx-core | Event-driven UI updates (SSE/webhooks) |
| terminal-os | griot-ai | griotFetch() gateway production hardening |
| terminal-os | gtcx-markets | Ledger54 settlement trace viewer |
| terminal-os | gtcx-protocols | Real-time PANX price feed |
| terminal-os | gtcx-mobile | Mobile-responsive TradeDesk54 |
| terminal-os | gtcx-markets | EIX order book in TradeDesk54 |
