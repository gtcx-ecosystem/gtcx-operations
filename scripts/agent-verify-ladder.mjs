#!/usr/bin/env node
/**
 * Protocol 27 — verification ladder for gtcx-operations.
 * Runs repo gates and emits JSON with exit codes.
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');

const STEPS = [
  { id: 'V2', name: 'typecheck', command: 'pnpm', args: ['typecheck'] },
  { id: 'V2', name: 'validate', command: 'pnpm', args: ['validate'] },
  { id: 'V3', name: 'test', command: 'pnpm', args: ['test'] },
  { id: 'V2', name: 'lint:policies', command: 'pnpm', args: ['lint:policies'] },
  { id: 'V4', name: 'agent:work-selection:check', command: 'pnpm', args: ['agent:work-selection:check'] },
];

function runStep(step) {
  const result = spawnSync(step.command, step.args, {
    cwd: ROOT,
    encoding: 'utf8',
    shell: false,
  });
  const cmd = `${step.command} ${step.args.join(' ')}`;
  return {
    step: step.id,
    name: step.name,
    command: cmd,
    exitCode: result.status ?? 1,
    ok: (result.status ?? 1) === 0,
  };
}

function optionalProtocolsPreceremony() {
  const protocolsRoot = join(ROOT, '..', 'gtcx-protocols');
  const pkg = join(protocolsRoot, 'package.json');
  if (!existsSync(pkg)) {
    return {
      step: 'V6',
      name: 'check:inf86-xr401-preceremony',
      command: 'skipped — gtcx-protocols not found',
      exitCode: null,
      ok: true,
      skipped: true,
    };
  }
  const result = spawnSync('pnpm', ['check:inf86-xr401-preceremony'], {
    cwd: protocolsRoot,
    encoding: 'utf8',
    shell: false,
  });
  return {
    step: 'V6',
    name: 'check:inf86-xr401-preceremony',
    command: 'pnpm check:inf86-xr401-preceremony (gtcx-protocols)',
    exitCode: result.status ?? 1,
    ok: (result.status ?? 1) === 0,
    skipped: false,
  };
}

const results = STEPS.map(runStep);
const v6 = optionalProtocolsPreceremony();
results.push(v6);

const failed = results.filter((r) => !r.skipped && !r.ok);
const payload = {
  ok: failed.length === 0,
  protocol: '27-agent-execution-obligation',
  repo: 'gtcx-operations',
  results,
  agentInstructions: [
    'Report each command and exit code in the session transcript.',
    'Do not ask the human to run these commands if Shell succeeded.',
  ],
};

console.log(JSON.stringify(payload, null, 2));
process.exit(failed.length === 0 ? 0 : 1);
