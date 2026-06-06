#!/usr/bin/env node
/**
 * L3 agent bootstrap — sor-map, paths, repo-kind (corporate-ops profile).
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  ALLOWLIST_PATH,
  GOVERNANCE_SPINE_PATH,
  OPS_MANIFEST_PATH,
  REPO_KIND_PATH,
  REPO_ROOT,
  SOR_MAP_PATH,
  assertSorPathsExist,
  loadSorMap,
} from '../../../config/paths.mjs';

const failures = [];

function requireFile(rel, label) {
  if (!existsSync(join(REPO_ROOT, rel))) failures.push(`missing ${label}: ${rel}`);
}

requireFile('config/sor-map.json', 'sor-map');
requireFile('config/paths.mjs', 'paths module');
requireFile('config/repo-kind.json', 'repo-kind');
requireFile('config/governance-spine.json', 'governance spine');
requireFile('03-platform/README.md', '03-platform hub README');
requireFile('00-archive/README.md', 'archive hub README');
requireFile('02-ops/README.md', 'ops hub README');
requireFile('04-deploy/README.md', 'deploy hub README');
requireFile('06-workstream/README.md', 'workstream hub README');
requireFile('05-audit/AGENT-START.md', 'audit entry');
requireFile('01-docs/05-audit/latest.json', 'audit machine state');
requireFile('01-docs/strategy/execution-roadmap.md', 'P22 story register');

assertSorPathsExist(failures);

const pkg = JSON.parse(readFileSync(join(REPO_ROOT, 'package.json'), 'utf8'));
const scripts = pkg.scripts ?? {};
for (const name of ['layout:strings:check', 'agent:bootstrap:check', 'architecture:check', 'format:check', 'ops:check']) {
  if (!scripts[name]) failures.push(`package.json missing script: ${name}`);
}

const sor = loadSorMap();
if (sor.repo !== 'gtcx-operations') failures.push('sor-map.repo must be gtcx-operations');
if (sor.repoKind !== 'corporate-ops') failures.push('sor-map.repoKind must be corporate-ops');

const kind = JSON.parse(readFileSync(REPO_KIND_PATH, 'utf8'));
if (kind.kind !== 'corporate-ops') failures.push('repo-kind.kind must be corporate-ops');
if (kind.toolchainProfile !== 'single-package') {
  failures.push('repo-kind.toolchainProfile must be single-package');
}
if (kind.vitest?.workspaceSyncToRoot !== false) {
  failures.push('repo-kind.vitest.workspaceSyncToRoot must be false');
}

if (existsSync(join(REPO_ROOT, 'vitest.workspace.ts'))) {
  failures.push('forbidden root vitest.workspace.ts — use config/toolchain/');
}

if (existsSync(OPS_MANIFEST_PATH)) {
  const ops = JSON.parse(readFileSync(OPS_MANIFEST_PATH, 'utf8'));
  if (ops.hubs?.deploy !== '04-deploy') {
    failures.push('ops.manifest hubs.deploy must be 04-deploy');
  }
}

if (existsSync(ALLOWLIST_PATH)) {
  const allow = JSON.parse(readFileSync(ALLOWLIST_PATH, 'utf8'));
  if (allow.migration_tier !== 'stable') {
    failures.push(`root-allowlist migration_tier must be stable (got ${allow.migration_tier ?? 'unset'})`);
  }
}

if (existsSync(GOVERNANCE_SPINE_PATH)) {
  const spine = JSON.parse(readFileSync(GOVERNANCE_SPINE_PATH, 'utf8'));
  if (spine.repo !== 'gtcx-operations') failures.push('governance-spine.repo must be gtcx-operations');
}

if (failures.length) {
  console.error('agent:bootstrap:check FAILED');
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log('agent:bootstrap:check OK');
console.log(`  sor-map: ${SOR_MAP_PATH.replace(`${REPO_ROOT}/`, '')}`);
console.log(`  repoKind: corporate-ops (${kind.toolchainProfile})`);
