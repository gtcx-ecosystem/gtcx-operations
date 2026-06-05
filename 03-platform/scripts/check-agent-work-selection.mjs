#!/usr/bin/env node
/**
 * Verifies Protocol 22 (AGENT-WORK-SEL) is wired for gtcx-operations.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const errors = [];

function requireFile(relPath, label) {
  const abs = join(ROOT, relPath);
  if (!existsSync(abs)) {
    errors.push(`Missing ${label}: ${relPath}`);
    return null;
  }
  return readFileSync(abs, 'utf8');
}

const manifest = requireFile('01-docs/04-ops/agent-work-selection.md', 'work-selection manifest');
requireFile('03-platform/scripts/agent-next-work.mjs', 'selection script');
requireFile('01-docs/strategy/execution-roadmap.md', 'execution roadmap');
const autoDev = requireFile('01-docs/05-audit/auto-dev-state.md', 'session pointer');
requireFile('01-docs/04-ops/AGENT-PROTOCOL-22-BRIEF.md', 'agent brief');

const pkgRaw = requireFile('package.json', 'package.json');
if (pkgRaw) {
  const pkg = JSON.parse(pkgRaw);
  if (!pkg.scripts?.['agent:next-work']) {
    errors.push('package.json missing script: agent:next-work');
  }
  if (!pkg.scripts?.['agent:work-selection:check']) {
    errors.push('package.json missing script: agent:work-selection:check');
  }
}

const agents = requireFile('AGENTS.md', 'AGENTS.md');
if (agents) {
  if (!agents.includes('## 1.7 Agent Work Selection')) {
    errors.push('AGENTS.md missing §1.7 Agent Work Selection');
  }
  if (!agents.includes('Phase 5.4')) {
    errors.push('AGENTS.md missing Phase 5.4 work selection');
  }
  if (!agents.includes('Phase 5.5')) {
    errors.push('AGENTS.md missing Phase 5.5 cross-repo (Protocol 24)');
  }
}

if (manifest) {
  if (!manifest.includes('adoption_status: established')) {
    errors.push('Manifest adoption_status must be established (not missing/pilot)');
  }
  if (!manifest.includes('OPS-AWS-001')) {
    errors.push('Manifest missing document_id OPS-AWS-001');
  }
}

if (autoDev && !autoDev.includes('Next work')) {
  errors.push('auto-dev-state.md missing "Next work" section');
}

const p24 = requireFile('01-docs/04-ops/cross-repo-coordination.md', 'Protocol 24 doc');
if (!p24?.includes('Protocol 24')) {
  errors.push('Missing or incomplete 01-docs/04-ops/cross-repo-coordination.md');
}

if (errors.length > 0) {
  console.error('Protocol adoption check failed:\n');
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
}

console.log('Protocol adoption check passed (gtcx-operations: P22 + P24 wiring).');
