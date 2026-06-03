#!/usr/bin/env node
/**
 * Verifies Protocol 27 (AGENT-EXEC-OBL) wiring for gtcx-operations.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const errors = [];

function requireFile(rel, label) {
  const abs = join(ROOT, rel);
  if (!existsSync(abs)) {
    errors.push(`Missing ${label}: ${rel}`);
    return null;
  }
  return readFileSync(abs, 'utf8');
}

requireFile('docs/operations/agent-execution-obligation.md', 'P27 manifest');
requireFile('docs/operations/AGENT-PROTOCOL-27-BRIEF.md', 'P27 brief');
requireFile('scripts/agent-verify-ladder.mjs', 'verify ladder script');
requireFile('.cursor/rules/protocol-27-agent-execution-obligation.mdc', 'Cursor P27 rule');

const pkgRaw = requireFile('package.json', 'package.json');
if (pkgRaw) {
  const pkg = JSON.parse(pkgRaw);
  if (!pkg.scripts?.['agent:verify-ladder']) {
    errors.push('package.json missing script: agent:verify-ladder');
  }
  if (!pkg.scripts?.['agent:execution-obligation:check']) {
    errors.push('package.json missing script: agent:execution-obligation:check');
  }
}

const agents = requireFile('AGENTS.md', 'AGENTS.md');
if (agents) {
  if (!agents.includes('Phase 5.7')) {
    errors.push('AGENTS.md missing Phase 5.7');
  }
  if (!agents.includes('## 1.9 Agent Execution Obligation')) {
    errors.push('AGENTS.md missing §1.9 Agent Execution Obligation');
  }
}

const manifest = requireFile('docs/operations/agent-execution-obligation.md', 'manifest');
if (manifest && !manifest.includes('adoption_status: established')) {
  errors.push('P27 manifest must have adoption_status: established');
}

if (errors.length > 0) {
  console.error('Protocol 27 adoption check failed:\n');
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log('Protocol 27 adoption check passed (gtcx-operations).');
