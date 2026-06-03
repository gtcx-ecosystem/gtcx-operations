#!/usr/bin/env node
/** Verifies Protocol 19 credential access wiring for gtcx-operations. */
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

requireFile('docs/operations/agent-credential-access.md', 'P19 manifest');
const agents = requireFile('AGENTS.md', 'AGENTS.md');
const gitignore = requireFile('.gitignore', '.gitignore');

if (agents && !/Protocol 19|baseline_vault|Credential Access/i.test(agents)) {
  errors.push('AGENTS.md missing Protocol 19 / vault MCP');
}
if (gitignore && !gitignore.includes('.secrets')) {
  errors.push('.gitignore must include .secrets/');
}

if (errors.length) {
  console.error('Protocol 19 check failed:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('Protocol 19 adoption check passed (gtcx-operations).');
