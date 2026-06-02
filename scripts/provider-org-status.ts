#!/usr/bin/env tsx
// =============================================================================
// GTCX Provider Org Provisioning Status Tracker
// =============================================================================
// Checks which provider org accounts are configured, which workspaces/projects
// exist, and which keys are resolvable from the Baseline vault.
//
// Usage:
//   npx tsx scripts/provider-org-status.ts
//
// Requires:
//   BASELINE_MASTER_KEY or BASELINE_VAULT_KEY (for vault check)
// =============================================================================

import {
  GTCX_PROVIDERS,
  resolveProviderAvailability,
  type ProviderAvailability,
} from '@baselineos/vault';

interface ProviderOrgStatus {
  id: string;
  name: string;
  orgCreated: boolean;
  orgCreatedSource: 'env' | 'vault' | 'unknown';
  workspaces: string[];
  keysInVault: number;
  spendCapConfigured: boolean;
  notes: string;
}

function checkEnvFlag(envVar: string): boolean {
  return !!(process.env[envVar]?.trim());
}

function getWorkspacesFromEnv(prefix: string): string[] {
  const workspaces: string[] = [];
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith(prefix) && value?.trim()) {
      workspaces.push(key.replace(prefix, ''));
    }
  }
  return workspaces;
}

function buildStatus(): ProviderOrgStatus[] {
  const avail = resolveProviderAvailability(process.env);

  return GTCX_PROVIDERS.map((provider): ProviderOrgStatus => {
    const providerAvail = avail.find((a) => a.id === provider.id);
    const hasKey = providerAvail?.available ?? false;

    // Provider-specific org detection heuristics
    let orgCreated = hasKey;
    let orgCreatedSource: 'env' | 'vault' | 'unknown' = hasKey ? 'vault' : 'unknown';
    let workspaces: string[] = [];
    let spendCapConfigured = false;
    let notes = '';

    switch (provider.id) {
      case 'anthropic':
        workspaces = getWorkspacesFromEnv('ANTHROPIC_WORKSPACE_');
        spendCapConfigured = checkEnvFlag('ANTHROPIC_SPEND_CAP_SET');
        notes = 'Workspaces: terraos-production, explorationos-production, complianceos-production, shared-intelligence';
        break;
      case 'openai':
        workspaces = getWorkspacesFromEnv('OPENAI_PROJECT_');
        spendCapConfigured = checkEnvFlag('OPENAI_SPEND_CAP_SET');
        notes = 'Projects: project-terraos, project-explorationos, project-complianceos, project-baselinesir';
        break;
      case 'gemini':
        workspaces = getWorkspacesFromEnv('GCP_PROJECT_');
        spendCapConfigured = checkEnvFlag('GCP_BILLING_ALERT_SET');
        notes = 'GCP projects: gtcx-terraos, gtcx-explorationos, gtcx-complianceos';
        break;
      case 'deepseek':
        notes = 'DeepSeek has minimal org features. Recommend using via OpenRouter/LiteLLM proxy.';
        break;
      case 'grok':
        notes = 'xAI org features are nascent. Use shared ai-ops@gtcx.trade account.';
        break;
      case 'copernicus':
        notes = 'Free tier; org not required. Set COPERNICUS_CLIENT_ID + COPERNICUS_CLIENT_SECRET.';
        break;
      case 'metals-api':
        notes = 'Commercial API; individual account. Set METALS_API_KEY.';
        break;
    }

    if (hasKey && workspaces.length === 0) {
      workspaces.push('default');
    }

    return {
      id: provider.id,
      name: provider.name,
      orgCreated,
      orgCreatedSource,
      workspaces,
      keysInVault: hasKey ? 1 : 0,
      spendCapConfigured,
      notes,
    };
  });
}

function printTable(status: ProviderOrgStatus[]) {
  console.log('=== GTCX Provider Org Provisioning Status ===\n');

  const maxName = Math.max(...status.map((s) => s.name.length), 20);

  console.log(
    `${'Provider'.padEnd(maxName)} │ Org? │ Workspaces │ Keys │ Cap? │ Notes`
  );
  console.log(
    '─'.repeat(maxName) +
      '┼──────┼────────────┼──────┼──────┼────────────────────────────────'
  );

  for (const s of status) {
    const orgIcon = s.orgCreated ? '✅' : '❌';
    const capIcon = s.spendCapConfigured ? '✅' : s.orgCreated ? '⚠️' : '─';
    const wsCount = s.workspaces.length;
    const keyCount = s.keysInVault;

    console.log(
      `${s.name.padEnd(maxName)} │ ${orgIcon}   │ ${String(wsCount).padStart(10)} │ ${String(keyCount).padStart(4)} │ ${capIcon}   │ ${s.notes}`
    );
  }

  const totalProviders = status.length;
  const orgsReady = status.filter((s) => s.orgCreated).length;
  const capsReady = status.filter((s) => s.spendCapConfigured).length;

  console.log('\n── Summary ──');
  console.log(`Providers with org account: ${orgsReady}/${totalProviders}`);
  console.log(`Spend caps configured:      ${capsReady}/${totalProviders}`);

  const missing = status.filter((s) => !s.orgCreated);
  if (missing.length > 0) {
    console.log(`\n❌ Missing org accounts:`);
    for (const m of missing) {
      console.log(`   • ${m.name} — ${m.notes}`);
    }
  }
}

function printJson(status: ProviderOrgStatus[]) {
  console.log(
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        summary: {
          totalProviders: status.length,
          orgsReady: status.filter((s) => s.orgCreated).length,
          capsReady: status.filter((s) => s.spendCapConfigured).length,
        },
        providers: status,
      },
      null,
      2
    )
  );
}

async function main() {
  const jsonMode = process.argv.includes('--json');
  const status = buildStatus();

  if (jsonMode) {
    printJson(status);
  } else {
    printTable(status);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
