#!/usr/bin/env node
/**
 * Runs all agent protocol adoption checks (P19, P22+P24, P26, P27).
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

const CHECKS = [
  { id: 'P19', script: 'check-agent-credentials.mjs' },
  { id: 'P22+P24', script: 'check-agent-work-selection.mjs' },
  { id: 'P26', script: 'check-agent-proceed-confirmation.mjs' },
  { id: 'P27', script: 'check-agent-execution-obligation.mjs' },
];

let failed = 0;
for (const { id, script } of CHECKS) {
  const r = spawnSync('node', [join(ROOT, '03-platform/scripts', script)], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  if (r.status !== 0) {
    failed++;
    console.error(`\n[${id}] FAILED\n${r.stdout}${r.stderr}`);
  }
}

if (failed > 0) {
  console.error(`\n${failed} protocol check(s) failed.`);
  process.exit(1);
}

console.log('All agent protocol checks passed (gtcx-operations: P19, P22, P24, P26, P27).');
