# GTCX Operations

Corporate operations as agentic software. Legal, HR, finance, IP, fundraising, and operations — versioned, observable, and machine-actionable.

## Purpose

This repo treats corporate functions as software modules:
- **Contracts** as structured data with lifecycle states
- **Policies** as code with versioned diffs
- **Budgets** as machine-readable YAML with variance tracking
- **IP** as structured asset registry with status pipelines
- **Fundraising** as deal-flow pipelines with investor-state tracking
- **Operations** as runbooks and incident logs with SLA metrics

## Directory Structure

```
gtcx-operations/
├── legal/          # Contracts, policies, templates
├── hr/             # Roles, policies, compensation frameworks
├── finance/        # Budgets, financial models, runway projections
├── ip/             # Patents, trademarks, trade secrets registry
├── fundraising/    # Pitch decks, deal pipelines, investor updates
├── ops/            # Vendor management, runbooks, incident logs
├── docs/           # Human-readable documentation
├── scripts/        # Automation scripts for contract generation, budget sync
└── .github/workflows/  # CI for policy validation, budget checks
```

## Agentic Operations

Every function in this repo follows the agentic pattern:

1. **Source of truth is git** — ClickUp, Notion, etc. are read-only mirrors
2. **Structured data first** — YAML/JSON contracts over prose
3. **Event-driven** — State changes emit events consumable by other repos
4. **Observable** — Metrics, SLAs, and progress are machine-readable
5. **Composable** — Functions expose APIs to the ecosystem

## Getting Started

```bash
# Install dependencies
pnpm install

# Validate all contracts and policies
pnpm validate

# Sync budgets to finance dashboard
pnpm sync:budgets

# Generate contract from template
pnpm generate:contract --template nda --party "Example Corp"
```

## Status

🚧 Early setup — infrastructure and templates being created.
