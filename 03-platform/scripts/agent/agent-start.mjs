#!/usr/bin/env node
/**
 * GTCX session start — forwards to baseline-os `baseline start` (full chain SSOT).
 */
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { repoRootFromMeta } from '../lib/repo-root.mjs';

function findBaselineOsRoot(repoRoot) {
  const candidates = [
    process.env.BASELINE_OS_ROOT,
    process.env.GTCX_ECOSYSTEM_ROOT ? join(process.env.GTCX_ECOSYSTEM_ROOT, 'baseline-os') : null,
    join(repoRoot, '..', 'baseline-os'),
  ].filter(Boolean);
  for (const root of candidates) {
    const bin = join(root, '03-platform/packages/baselineos/dist/cli/bin.js');
    if (existsSync(bin)) return root;
  }
  return null;
}

const repoRoot = repoRootFromMeta(import.meta.url);
const baselineRoot = findBaselineOsRoot(repoRoot);
if (!baselineRoot) {
  console.error(
    'ERROR: baseline-os not found (side-by-side checkout or set GTCX_ECOSYSTEM_ROOT).',
  );
  console.error('Fallback: run `pnpm agent:next-work` and read 01-docs/operations/agent-universal-instructions.md');
  process.exit(1);
}

const baselineBin = join(baselineRoot, '03-platform/packages/baselineos/dist/cli/bin.js');
const passthrough = process.argv.slice(2);
const result = spawnSync(process.execPath, [baselineBin, 'start', ...passthrough], {
  stdio: 'inherit',
  cwd: repoRoot,
});
process.exit(result.status ?? 1);
