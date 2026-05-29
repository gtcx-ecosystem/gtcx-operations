# GTCX AI Provider — Centralized Org Billing Guide

> **Status:** Draft  
> **Owner:** Finance / Infrastructure  
> **Applies to:** TerraOS, ExplorationOS, ComplianceOS, Griot AI, TerminalOS  

---

## The Problem

Right now, every OS/project maintains its own API keys scattered across `.env` files, Vercel dashboards, Supabase secrets, and personal accounts. This means:

- **No spend visibility:** You don't know which project burned through $500 of Claude tokens last week.
- **Billing chaos:** 5 different credit cards across 5 different providers.
- **Key sprawl:** 20+ keys with no rotation schedule, no revocation tracking.
- **Vendor lock-in risk:** Personal accounts tied to individuals who may leave.

## The Solution: One GTCX Org Per Provider

Create a single **organization account** for GTCX at each provider. All API keys, usage, and billing flow through that org. Project agents request keys from `@baselineos/vault`; they never touch provider dashboards.

```
┌─────────────────────────────────────────────────────────────┐
│                    GTCX Organization                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  TerraOS    │  │ExplorationOS│  │ ComplianceOS│         │
│  │  Project    │  │   Project   │  │   Project   │         │
│  │  API Key    │  │   API Key   │  │   API Key   │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                  │
│         └────────────────┴────────────────┘                  │
│                          │                                   │
│              ┌───────────▼────────────┐                     │
│              │   Unified Billing      │                     │
│              │   (one invoice/mo)     │                     │
│              └────────────────────────┘                     │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│              BaselineOS Credential Vault                    │
│     (keys encrypted, scoped per agent/workflow)             │
└─────────────────────────────────────────────────────────────┘
```

---

## Provider-by-Provider Setup

### Anthropic / Claude

**Org structure:** Organization → Workspaces → API Keys

1. Go to [console.anthropic.com](https://console.anthropic.com/) → Settings → Organization
2. Create org: `gtcx-ecosystem` (or `gtcx-prod`)
3. Invite core admins (finance, infra leads) as Owners
4. Create workspaces:
   - `terraos-production`
   - `explorationos-production`
   - `complianceos-production`
   - `shared-intelligence` (for cross-cutting services)
5. Generate API keys per workspace → store in vault
6. Set **usage limits** per workspace (e.g., TerraOS = $500/mo, ExplorationOS = $200/mo)
7. Add payment method at org level

**Key feature:** Anthropic tracks usage per workspace. You can see exactly which OS spent what.

**Vault mapping:**
```
ANTHROPIC_API_KEY → gtcx/anthropic/terraos-production
CLAUDE_API_KEY    → gtcx/anthropic/explorationos-production (same org, different key)
```

---

### OpenAI

**Org structure:** Organization → Projects → API Keys

1. Go to [platform.openai.com](https://platform.openai.com/) → Organization
2. Create org: `gtcx` (or invite existing org if you have one)
3. Add team members with roles:
   - Owner (finance + infra lead)
   - Reader (project agents, read-only for monitoring)
4. Create projects:
   - `project-terraos`
   - `project-explorationos`
   - `project-complianceos`
   - `project-baselinesir`
5. Generate project-scoped API keys
6. Set **hard usage caps** per project (OpenAI supports monthly budgets)
7. Enable **request logging** for audit trail

**Key feature:** OpenAI's project-level keys are the gold standard. Usage, rate limits, and billing are fully isolated per project.

**Vault mapping:**
```
OPENAI_API_KEY → gtcx/openai/project-terraos
```

---

### Google / Gemini

**Org structure:** Google Cloud Project → API Keys + Service Accounts

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select org: `gtcx.io` (requires Google Workspace / Cloud Identity)
3. Create projects:
   - `gtcx-terraos`
   - `gtcx-explorationos`
   - `gtcx-complianceos`
4. Enable **Vertex AI API** and **Gemini API** in each project
5. Create **service accounts** per project (more secure than API keys)
6. Download service account JSON keys → store in vault as `connection-string` type
7. Set **quotas** per project (requests per minute, tokens per day)
8. Link billing account at org level

**Key feature:** GCP's IAM + service accounts are the most enterprise-grade. You can scope access to specific models, regions, and quotas.

**Vault mapping:**
```
GEMINI_API_KEY → gtcx/gcp/service-account-terraos (JSON key content)
```

---

### DeepSeek

**Org structure:** Basic — individual API keys with manual balance top-up

DeepSeek has minimal org features. Recommendation:

1. Create one account with a shared `ai-ops@gtcx.io` email
2. Generate one API key
3. Track usage manually (DeepSeek has a simple dashboard)
4. Set a low top-up amount ($50-100) to limit blast radius

**Alternative:** Skip DeepSeek org account; use via OpenRouter or LiteLLM proxy (Option C) so you don't manage their billing directly.

---

### Mistral

**Org structure:** Organization → Workspaces → API Keys

1. Go to [console.mistral.ai](https://console.mistral.ai/)
2. Create org: `gtcx`
3. Create workspaces per project
4. Generate keys → store in vault

---

### Cohere

**Org structure:** Organization → Teams → API Keys

1. Go to [dashboard.cohere.com](https://dashboard.cohere.com/)
2. Create org: `gtcx`
3. Invite team members
4. Generate keys per team/workspace

---

### xAI / Grok

**Org structure:** Developer portal → Organization (limited)

xAI's org features are nascent. Use a shared `ai-ops@gtcx.io` account with:
- One production key
- One sandbox/testing key

---

### Together AI

**Org structure:** Organization → Teams → API Keys

1. Go to [api.together.ai](https://api.together.ai/)
2. Create org: `gtcx`
3. Set spend caps per team

---

### Hugging Face

**Org structure:** Organization → Access Tokens

1. Go to [huggingface.co/settings/organizations](https://huggingface.co/settings/organizations)
2. Create org: `gtcx`
3. Create access tokens with scoped permissions:
   - `read` for inference
   - `write` only for model publishing (separate token)
4. Store tokens in vault

---

## Cost Attribution Strategy

Without a unified gateway, you rely on provider dashboards. Here's the mapping:

| Provider | Attribution Mechanism | Granularity |
|----------|----------------------|-------------|
| Anthropic | Workspace usage | Per-workspace |
| OpenAI | Project usage | Per-project |
| Google Cloud | Project + BigQuery export | Per-project, per-model |
| Mistral | Workspace usage | Per-workspace |
| Cohere | Team usage | Per-team |
| DeepSeek | Account-level only | Whole org |
| Together | Team usage | Per-team |

**For GTCX:** Tag everything with `project: terraos`, `project: explorationos`, etc. so finance can reconcile.

---

## The Agent Flow (How It Works Day-to-Day)

```
1. Project agent needs to call Claude
   ↓
2. Agent calls baseline_vault MCP tool:
   action="get" name="anthropic"
   ↓
3. Vault checks trust score, scope, returns TerraOS key
   (key never visible to agent — opaque lease)
   ↓
4. Agent makes API call
   ↓
5. Usage attributed to TerraOS workspace in Anthropic dashboard
   ↓
6. Finance agent pulls monthly usage report
   from all providers → updates budget YAML
```

---

## Security Rules

1. **No personal accounts.** All keys belong to `gtcx` orgs. If someone leaves, revoke their admin access — keys keep working.

2. **Hard spend caps.** Set monthly limits at the provider level (especially OpenAI and Anthropic). Never rely on "we'll monitor it."

3. **Key rotation quarterly.** The ops agent generates new keys, updates vault, revokes old keys. Project agents never know this happened.

4. **Sandbox vs. production.** Every provider gets two workspaces:
   - `*-production` → real keys, real costs
   - `*-sandbox` → degraded mode, low caps, for testing

5. **No email access required.** The finance/ops human sets up org accounts once. After that, everything is API-driven.

---

## What You Need to Do (One-Time Setup)

| Step | Who | Time |
|------|-----|------|
| Create Gmail / Google Workspace for `ai-ops@gtcx.io` | You (human) | 30 min |
| Sign up org accounts at Anthropic, OpenAI, Mistral, Cohere, Together | You (human) | 2 hours |
| Add payment methods, set spend caps | You (human) | 1 hour |
| Create workspaces/projects per OS | You (human) | 1 hour |
| Generate API keys, add to Baseline vault | Ops agent | 30 min |
| Document workspace IDs in this file | Ops agent | 15 min |

**Total human time:** ~5 hours once. After that, agents manage everything.

---

## Next Step

Want me to create a provisioning checklist script that tracks which org accounts are set up, which workspaces exist, and which keys are in vault? It would output something like:

```
=== GTCX Provider Org Status ===
Anthropic:     ✅ Org created | 4 workspaces | 4 keys in vault
OpenAI:        ✅ Org created | 4 projects   | 4 keys in vault
Google:        ❌ Org missing
DeepSeek:      ⚠️  Individual account (recommend OpenRouter)
Mistral:       ✅ Org created | 2 workspaces | 2 keys in vault
...
```
