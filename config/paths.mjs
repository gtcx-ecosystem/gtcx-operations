/**
 * Canonical path joins for gtcx-operations — import from scripts/tests via sor-map.
 * SoR: config/sor-map.json
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CONFIG_DIR = dirname(fileURLToPath(import.meta.url));

export const REPO_ROOT = join(CONFIG_DIR, '..');
export const ALLOWLIST_PATH = join(REPO_ROOT, '01-docs/operations/repo/root-allowlist.json');
export const SOR_MAP_PATH = join(REPO_ROOT, 'config/sor-map.json');
export const REPO_KIND_PATH = join(REPO_ROOT, 'config/repo-kind.json');
export const OPS_MANIFEST_PATH = join(REPO_ROOT, 'config/ops.manifest.json');
export const GOVERNANCE_SPINE_PATH = join(REPO_ROOT, 'config/governance-spine.json');
export const TOOLCHAIN = join(REPO_ROOT, 'config/toolchain');
export const PLATFORM_SCRIPTS = join(REPO_ROOT, '03-platform/scripts');
export const PLATFORM_SRC = join(REPO_ROOT, '03-platform/src');
export const AUDIT_ENTRY = join(REPO_ROOT, '05-audit/AGENT-START.md');
export const AUDIT_FORENSICS = join(REPO_ROOT, '01-docs/05-audit');
export const OPS_DOMAINS = join(REPO_ROOT, '02-ops');

export function loadSorMap() {
  return JSON.parse(readFileSync(SOR_MAP_PATH, 'utf8'));
}

export function relFromSor(key) {
  const sor = loadSorMap();
  const rel = sor.paths?.[key];
  if (!rel) throw new Error(`sor-map missing paths.${key}`);
  return rel;
}

export function pathFromSor(key) {
  return join(REPO_ROOT, relFromSor(key));
}

export function assertSorPathsExist(failures, keys = null) {
  const sor = loadSorMap();
  const entries = keys ?? Object.keys(sor.paths ?? {});
  for (const key of entries) {
    const rel = sor.paths[key];
    if (!rel) continue;
    const abs = join(REPO_ROOT, rel.replace(/\/$/, ''));
    if (!existsSync(abs)) failures.push(`sor-map path missing (${key}): ${rel}`);
  }
}
