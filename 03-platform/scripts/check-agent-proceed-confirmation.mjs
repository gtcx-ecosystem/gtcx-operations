#!/usr/bin/env node
/** Verifies Protocol 26 wiring for gtcx-operations. */
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

const manifest = requireFile('01-docs/operations/agent-proceed-confirmation.md', 'P26 manifest');
requireFile('01-docs/operations/AGENT-PROTOCOL-26-BRIEF.md', 'P26 brief');
const agents = requireFile('AGENTS.md', 'AGENTS.md');

if (agents) {
  if (!agents.includes('Protocol 26')) errors.push('AGENTS.md missing Protocol 26');
  if (!/Phase 5\.6|Proceed Brief/i.test(agents)) {
    errors.push('AGENTS.md missing Phase 5.6 or Proceed Brief');
  }
  if (!/## 1\.9 Agent Proceed Confirmation/.test(agents)) {
    errors.push('AGENTS.md missing §1.9 Proceed Confirmation');
  }
}

if (manifest) {
  if (!manifest.includes('adoption_status: established')) {
    errors.push('P26 manifest must be established');
  }
  if (!manifest.includes('OPS-APC-001')) errors.push('P26 manifest missing OPS-APC-001');
}

const pkg = JSON.parse(requireFile('package.json', 'package.json') || '{}');
if (!pkg.scripts?.['agent:proceed-confirmation:check']) {
  errors.push('package.json missing agent:proceed-confirmation:check');
}

if (errors.length) {
  console.error('Protocol 26 check failed:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('Protocol 26 adoption check passed (gtcx-operations).');
