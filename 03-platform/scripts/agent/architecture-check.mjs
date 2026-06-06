#!/usr/bin/env node
/**
 * Structure 10/10 gate — layout v3, path SoR, script taxonomy, source hygiene.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { repoRootFromMeta } from '../lib/repo-root.mjs';

const ROOT = repoRootFromMeta(import.meta.url);
const failures = [];

function requirePath(rel, label) {
  if (!existsSync(join(ROOT, rel))) failures.push(`missing ${label}: ${rel}`);
}

function forbidGlob(dir, ext) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir, { recursive: true })) {
    const n = String(name);
    if (n.endsWith(ext) && !n.includes('node_modules')) {
      failures.push(`forbidden artifact ${dir}/${n}`);
    }
  }
}

// Seven hubs
for (const h of ['00-archive', '01-docs', '02-ops', '03-platform', '04-deploy', '05-audit', '06-workstream']) {
  requirePath(h, 'hub');
}

// Path SoR
requirePath('config/sor-map.json', 'sor-map');
requirePath('config/paths.mjs', 'paths module');
requirePath('03-platform/DOMAINS.md', 'domain map');
requirePath('01-docs/INDEX.md', 'docs index');
requirePath('01-docs/operations/agent-work-selection.md', 'P22 manifest (canonical)');

// Script taxonomy
for (const d of ['agent', 'domains', 'ecosystem', 'layout', 'workspace', 'ops', 'config']) {
  requirePath(`03-platform/scripts/${d}`, `scripts/${d}`);
}
requirePath('03-platform/scripts/README.md', 'scripts index');
requirePath('config/scripts.manifest.json', 'scripts manifest');

// Redirect stubs
requirePath('01-docs/04-ops/agent-work-selection.md', '04-ops redirect stub');

// No build artifacts beside TS sources
forbidGlob(join(ROOT, '03-platform/src'), '.js');
forbidGlob(join(ROOT, '03-platform/scripts'), '.js');

const allow = JSON.parse(readFileSync(join(ROOT, '01-docs/operations/repo/root-allowlist.json'), 'utf8'));
if (allow.migration_tier !== 'stable') failures.push('root-allowlist migration_tier must be stable');

const sor = JSON.parse(readFileSync(join(ROOT, 'config/sor-map.json'), 'utf8'));
const agentOps = sor.agentOpsCanonical ?? sor.paths?.agentOpsCanonical;
if (agentOps !== '01-docs/operations/') {
  failures.push('sor-map agentOpsCanonical must be 01-docs/operations/');
}

const r = spawnSync('node', ['03-platform/scripts/agent/agent-next-work.mjs'], {
  cwd: ROOT,
  encoding: 'utf8',
});
if (r.status !== 0) failures.push('agent-next-work must exit 0');

if (failures.length) {
  console.error('architecture:check FAILED');
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log('architecture:check OK (structure 10/10 criteria)');
