# CONVENTIONS.md — GTCX Operations

> **Version:** 1.0  
> **Date:** 2026-05-25  
> **License:** MIT  
> **Applies to:** ALL contributors and AI agents

---

## 1. Naming Conventions

### Files
- **Contracts:** `legal/contracts/{type}-{party}-{date}.md` — YAML frontmatter + markdown body
- **Policies:** `*/policies/{name}-v{version}.md` — versioned markdown with frontmatter
- **Budgets:** `finance/budgets/{year}-{quarter}.yaml` — quarters as top-level keys
- **IP Assets:** `ip/assets.json` — structured registry
- **Fundraising:** `fundraising/pipeline.yaml` — deal flow pipeline
- **Runbooks:** `ops/runbooks/{name}.md` — `trigger`, `steps`, `escalation` fields
- **Scripts:** `scripts/{kebab-case}.ts` — TypeScript with `tsx` runtime
- **Tests:** `tests/{module}.test.ts` or `src/**/*.test.ts`
- **Schemas:** `src/schemas/{name}.ts` — Zod schemas for validation
- **Generators:** `src/generators/{name}.ts` — Handlebars contract generators
- **Validators:** `src/validators/{name}.ts` — business rule validators

### Functions
- **Contract generators:** `generate{Type}()` — e.g., `generateNDA()`, `generateServiceAgreement()`
- **Validators:** `validate{Entity}()` — returns `{ valid: boolean, errors: string[] }`
- **Policy checkers:** `check{Policy}()` — e.g., `checkRetentionPolicy()`
- **Budget functions:** `syncBudgets()`, `checkVariances()`, `projectRunway()`
- **CRM helpers:** `syncGoogleContacts()`, `buildThreadRegistry()`
- **Orchestration:** `orchestrate{Channel}()` — `orchestrateEmail()`, `orchestrateWhatsApp()`

### Types & Interfaces
- **Contract types:** `{Type}Contract` — `NDAContract`, `ServiceAgreementContract`
- **Policy types:** `{Name}Policy` — `DataRetentionPolicy`, `RemoteWorkPolicy`
- **Budget types:** `{Period}Budget` — `Q22026Budget`, `AnnualBudget`
- **IP types:** `{Category}Asset` — `PatentAsset`, `TrademarkAsset`
- **Fundraising types:** `{Stage}Deal` — `SeedDeal`, `SeriesADeal`
- **Config types:** `{Service}Config` — `EmailConfig`, `WhatsAppConfig`

### Tests
- **Unit:** `{module}.test.ts` — Vitest
- **Integration:** `tests/integration/{service}.test.ts` — Google, WhatsApp, ClickUp
- **Contract validation:** `tests/contracts/{type}.test.ts` — schema + content checks
- **Policy linting:** `tests/policies/{name}.test.ts` — frontmatter completeness

---

## 2. Code Style

### Formatting
- **Prettier:** `prettier --write "**/*.{ts,tsx,js,jsx,json,md,yaml,yml}"`
- **Print width:** 100
- **Tabs:** 2 spaces
- **YAML:** consistent indentation, no tabs

### Linting
- **TypeScript:** `tsc --noEmit` for type checking
- **Policies:** `pnpm lint:policies` — custom frontmatter validator
- **Markdown:** `prettier` for formatting
- **YAML:** Schema validation via Zod

### TypeScript
- **Strict mode:** enabled
- **Target:** ES2022
- **Module:** ESM (`"type": "module"`)
- **No implicit any:** enforced

### Imports
```typescript
// External libraries
import { google } from 'googleapis';
import Handlebars from 'handlebars';

// Internal utilities
import { validateContract } from './validators/contract.js';
```
- ESM `.js` extensions in imports
- Absolute imports preferred over deep relative paths

---

## 3. Testing Conventions

### Test Runner
- **Vitest:** v2.1.9 with `@vitest/coverage-v8`

### Coverage Thresholds
- **Unit tests:** ≥ 80% line coverage
- **Contract validators:** ≥ 90% line coverage
- **Integration tests:** ≥ 60% line coverage (external services)

### Test Structure
```typescript
import { describe, it, expect } from 'vitest';

describe('Contract Generation', () => {
  describe('NDA', () => {
    it('should generate valid NDA with all required fields', () => {
      // Arrange → Act → Assert
    });

    it('should reject missing party information', () => {
      // Validation error path
    });
  });
});
```

### Integration Tests
- Google Workspace: mock `googleapis` where possible; use service account for live tests
- WhatsApp: mock API responses; never use production credentials in tests
- Email: use test inboxes or mock providers
- ClickUp: dry-run mode for task sync tests

### CI Gates
- `pnpm test` — all unit tests
- `pnpm test:integrations` — integration suite (dry-run where possible)
- `pnpm validate` — schema validation for all YAML/JSON contracts
- `pnpm lint:policies` — policy frontmatter completeness
- `pnpm check:budgets` — variance analysis

---

## 4. Documentation Conventions

### README Requirements
- Every functional directory (`legal/`, `finance/`, `hr/`, etc.) must have `README.md`
- Must include: purpose, file conventions, owner, last reviewed date

### Contract Documentation
- **Frontmatter (YAML):**
  ```yaml
  ---
  type: nda
  version: "1.2"
  effective_date: 2026-05-25
  owner: legal@gtcx.io
  status: active
  ---
  ```
- **Body:** Markdown with clear sections (Parties, Terms, Obligations, Termination)

### Policy Documentation
- **Frontmatter:** `version`, `effective_date`, `owner`, `review_cycle`
- **Changelog:** `### Version History` section at bottom
- **Review date:** Auto-flagged when within 30 days of review cycle

### Budget Documentation
- **Top-level keys:** `q1`, `q2`, `q3`, `q4`
- **Categories:** `personnel`, `infrastructure`, `marketing`, `legal`, `other`
- **Variance tracking:** `planned`, `actual`, `variance`, `variance_pct`

### Runbook Documentation
- **Frontmatter:** `trigger`, `severity`, `owner`, `escalation`
- **Steps:** Numbered, actionable, with rollback instructions
- **Post-incident:** Link to incident log template

### ADR Process
- **Location:** `docs/architecture/decisions/ADR-{NNN}-{title}.md`
- **Required for:** new contract types, policy changes, integration additions
- **Template:** Context → Decision → Consequences

---

## 5. Git Conventions

### Branch Naming
- `feat/{function}-{description}` — new features (e.g., `feat/legal-nda-template`)
- `fix/{function}-{description}` — bug fixes
- `docs/{description}` — documentation
- `policy/{name}-v{version}` — policy updates
- `contract/{type}-{party}` — contract additions
- `budget/{year}-{quarter}` — budget updates
- `chore/{description}` — maintenance

### Commit Messages
- **Format:** `type(scope): subject` — lowercase, imperative
- **Types:** `feat`, `fix`, `docs`, `policy`, `contract`, `budget`, `chore`, `refactor`
- **Scopes:** `legal`, `hr`, `finance`, `ip`, `fundraising`, `ops`, `email`, `whatsapp`, `crm`
- **Examples:**
  - `feat(legal): add SaaS agreement template`
  - `policy(hr): update remote work policy v2.1`
  - `budget(finance): add Q3 2026 personnel budget`
  - `fix(crm): resolve Google Contacts sync pagination bug`

### Merge Policy
- `main` is protected
- Contract and policy changes require legal/ops review
- Budget changes require finance approval

---

## 6. Security Conventions

### Secret Handling
- **Never commit secrets** — API keys, service account JSON, OAuth tokens
- **Vault:** Use `@baselineos/vault` via `gtcx-agentic` MCP tool
- **Service accounts:** Stored in vault, referenced by name in config
- **Env files:** `.env.example` committed; `.env` and `*.service-account.json` gitignored
- **WhatsApp:** Business API credentials in vault only

### Credential Scanning
- Pre-commit: check for `-----BEGIN PRIVATE KEY-----`, `AIza`, ` Bearer `
- `pnpm check-credentials` — validates credential access and expiry

### Data Protection
- **PII:** Minimize in committed files; use pseudonymized test data
- **Contracts:** Redact sensitive terms in public/shared versions
- **CRM data:** Export with data-retention policy compliance
- **Google Workspace:** Domain-wide delegation scoped to minimum required APIs

### Communication Security
- **Email:** DKIM/SPF configured; test with mail-tester before campaigns
- **WhatsApp:** Opt-in required; unsubscribe handled per jurisdiction
- **Cross-channel:** No PII in log files

---

## 7. Architecture Conventions

### Directory Boundaries
```
legal/         → Contracts, templates, compliance docs
hr/            → Policies, role definitions, onboarding docs
finance/       → Budgets, forecasts, variance reports
ip/            → Asset registry, filing deadlines, trademarks
fundraising/   → Deal pipeline, investor updates, cap table
ops/           → Runbooks, vendor lists, incident logs
email/         → Templates, provider config, send scripts
whatsapp/      → Templates, provider config, send scripts
crm/           → Thread registry, contact sync, follow-ups
orchestration/ → Cross-channel workflow definitions
```

### Cross-Repo Integration
- **BaselineOS:** Governance policies sync to `baseline-os/docs/governance/`
- **GTCX Core:** Financial events feed into `gtcx-core` ledger
- **Compliance OS:** Legal contracts feed compliance checks
- **Agentic:** All functions expose events to `gtcx-agentic` orchestration
- **Agile:** Sprint work items reported via `baseline-os` coordination hub

### Machine-Actionable Formats
- **Contracts:** YAML frontmatter + markdown body → parseable by scripts
- **Policies:** Versioned markdown with structured frontmatter
- **Budgets:** YAML with strict schema (Zod-validated)
- **IP Registry:** JSON with typed entries
- **Runbooks:** Markdown with frontmatter triggers

### Agent Workflows
- **Scheduled:** Budget sync, contract expiry checks, policy review alerts
- **Event-driven:** CRM updates trigger follow-up workflows
- **Cross-channel:** WhatsApp-first routing with email fallback

---

*Last updated: 2026-05-25*  
*Questions? See `AGENTS.md` for agent protocols and roles.*
