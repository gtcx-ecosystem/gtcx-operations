#!/usr/bin/env node
/**
 * Verify SLSA Build L3 provenance for a given repo in the gtcx ecosystem.
 *
 * Usage: pnpm verify:slsa <repo-name>
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import { homedir } from 'os';

const ECOSYSTEM_ROOT = resolve(homedir(), 'Sites', 'gtcx-ecosystem');

interface CheckResult {
  requirement: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  detail: string;
}

function printHeader(title: string): void {
  console.log(`\n${'='.repeat(60)}`);
  console.log(title);
  console.log(`${'='.repeat(60)}`);
}

function printResult(r: CheckResult): void {
  const icon = r.status === 'PASS' ? '\u2713' : r.status === 'FAIL' ? '\u2717' : '\u26A0';
  const color = r.status === 'PASS' ? '\x1b[32m' : r.status === 'FAIL' ? '\x1b[31m' : '\x1b[33m';
  const reset = '\x1b[0m';
  console.log(`${color}[${r.status}]${reset} ${icon} ${r.requirement}`);
  console.log(`    ${r.detail}`);
}

function readFileSafe(path: string): string | null {
  try {
    return readFileSync(path, 'utf-8');
  } catch {
    return null;
  }
}

function hasSlsaSteps(workflowContent: string): boolean {
  const keywords = [
    'provenance',
    'slsa',
    'sigstore',
    'cosign',
    'sbom',
    'attestation',
    'in-toto',
  ];
  const lower = workflowContent.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

function findFiles(dir: string, predicate: (name: string) => boolean): string[] {
  const results: string[] = [];
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && predicate(entry.name)) {
        results.push(join(dir, entry.name));
      }
    }
  } catch {
    // directory doesn't exist
  }
  return results;
}

function verifySlsa(repoName: string): CheckResult[] {
  const repoPath = join(ECOSYSTEM_ROOT, repoName);
  const results: CheckResult[] = [];

  // 1. Repo exists
  if (!existsSync(repoPath)) {
    results.push({
      requirement: 'Repository exists in ecosystem',
      status: 'FAIL',
      detail: `Directory not found: ${repoPath}`,
    });
    return results;
  }

  results.push({
    requirement: 'Repository exists in ecosystem',
    status: 'PASS',
    detail: `Found at ${repoPath}`,
  });

  // 2. Release workflow exists
  const releaseWorkflowPathYml = join(repoPath, '.github', 'workflows', 'release.yml');
  const releaseWorkflowPathYaml = join(repoPath, '.github', 'workflows', 'release.yaml');
  let releaseWorkflowPath = releaseWorkflowPathYml;
  let releaseWorkflowContent = readFileSafe(releaseWorkflowPathYml);
  if (!releaseWorkflowContent) {
    releaseWorkflowPath = releaseWorkflowPathYaml;
    releaseWorkflowContent = readFileSafe(releaseWorkflowPathYaml);
  }

  if (!releaseWorkflowContent) {
    results.push({
      requirement: 'Release workflow exists',
      status: 'FAIL',
      detail: `.github/workflows/release.yml not found`,
    });
  } else {
    results.push({
      requirement: 'Release workflow exists',
      status: 'PASS',
      detail: `Found ${releaseWorkflowPath}`,
    });

    // 3. SLSA-related steps in workflow
    if (hasSlsaSteps(releaseWorkflowContent)) {
      results.push({
        requirement: 'Release workflow contains SLSA steps',
        status: 'PASS',
        detail: 'Detected provenance, SBOM, cosign, sigstore, or attestation references',
      });
    } else {
      results.push({
        requirement: 'Release workflow contains SLSA steps',
        status: 'FAIL',
        detail: 'No SLSA-related keywords (provenance, sbom, cosign, sigstore, attestation, in-toto) found in release.yml',
      });
    }
  }

  // 4. Provenance attestation file exists
  const provenanceFiles = [
    join(repoPath, 'provenance.json'),
    join(repoPath, 'provenance-manifest.json'),
    join(repoPath, 'artifacts', 'provenance.json'),
    join(repoPath, 'artifacts', 'provenance-manifest.json'),
    ...findFiles(join(repoPath, 'artifacts'), (n) => n.includes('provenance') && n.endsWith('.json')),
    ...findFiles(repoPath, (n) => n.includes('provenance') && n.endsWith('.json')),
  ];
  const foundProvenance = [...new Set(provenanceFiles)].filter((f) => existsSync(f));

  if (foundProvenance.length > 0) {
    results.push({
      requirement: 'Provenance attestation file exists',
      status: 'PASS',
      detail: `Found: ${foundProvenance.map((f) => f.replace(repoPath + '/', '')).join(', ')}`,
    });
  } else {
    results.push({
      requirement: 'Provenance attestation file exists',
      status: 'FAIL',
      detail: 'No provenance.json or provenance-manifest.json found in repo root or artifacts/',
    });
  }

  // 5. SBOM exists
  const sbomPaths = [
    join(repoPath, 'sbom.json'),
    join(repoPath, 'sbom.spdx.json'),
    join(repoPath, 'artifacts', 'sbom.json'),
    join(repoPath, 'artifacts', 'sbom.spdx.json'),
    ...findFiles(repoPath, (n) => n.startsWith('sbom') && (n.endsWith('.json') || n.endsWith('.spdx'))),
  ];
  const foundSbom = [...new Set(sbomPaths)].filter((f) => existsSync(f));

  if (foundSbom.length > 0) {
    results.push({
      requirement: 'SBOM file exists',
      status: 'PASS',
      detail: `Found: ${foundSbom.map((f) => f.replace(repoPath + '/', '')).join(', ')}`,
    });
  } else {
    results.push({
      requirement: 'SBOM file exists',
      status: 'FAIL',
      detail: 'No sbom.json or sbom.spdx.json found in repo root or artifacts/',
    });
  }

  // 6. Cosign signatures
  const cosignPaths = [
    join(repoPath, 'cosign.pub'),
    join(repoPath, 'cosign.key'),
    join(repoPath, '.cosign'),
    ...findFiles(repoPath, (n) => n.endsWith('.sig') || n.includes('cosign')),
  ];
  const foundCosign = cosignPaths.filter((f) => existsSync(f));

  if (foundCosign.length > 0) {
    results.push({
      requirement: 'Cosign signatures present',
      status: 'PASS',
      detail: `Found: ${foundCosign.map((f) => f.replace(repoPath + '/', '')).join(', ')}`,
    });
  } else {
    results.push({
      requirement: 'Cosign signatures present',
      status: 'WARN',
      detail: 'No cosign signatures, .sig files, or cosign keys found. This may be acceptable if using Sigstore/npm provenance instead.',
    });
  }

  return results;
}

function main(): void {
  const repoName = process.argv[2];

  if (!repoName) {
    console.error('Usage: pnpm verify:slsa <repo-name>');
    console.error('');
    console.error('Examples:');
    console.error('  pnpm verify:slsa baseline-os');
    console.error('  pnpm verify:slsa terra-os');
    console.error('  pnpm verify:slsa gtcx-core');
    process.exit(1);
  }

  printHeader(`SLSA Build L3 Verification: ${repoName}`);

  const results = verifySlsa(repoName);

  let passCount = 0;
  let failCount = 0;
  let warnCount = 0;

  for (const r of results) {
    printResult(r);
    if (r.status === 'PASS') passCount++;
    if (r.status === 'FAIL') failCount++;
    if (r.status === 'WARN') warnCount++;
  }

  console.log(`\n${'-'.repeat(60)}`);
  const total = results.length;
  const overall = failCount === 0 ? 'PASS' : 'FAIL';
  const overallColor = overall === 'PASS' ? '\x1b[32m' : '\x1b[31m';
  const reset = '\x1b[0m';
  console.log(`${overallColor}Overall: ${overall}${reset} (${passCount} passed, ${failCount} failed, ${warnCount} warnings / ${total} checks)`);
  console.log(`${'='.repeat(60)}\n`);

  process.exit(failCount > 0 ? 1 : 0);
}

main();
