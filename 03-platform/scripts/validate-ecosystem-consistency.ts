#!/usr/bin/env tsx
/**
 * Ecosystem Consistency Validator
 *
 * Validates that all repos follow canonical GTCX conventions.
 * Run: `pnpm validate:ecosystem`
 */

import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const ECOSYSTEM_ROOT = process.env.ECOSYSTEM_ROOT || join(process.env.HOME || "", "Sites", "gtcx-ecosystem");

interface ValidationResult {
  repo: string;
  checks: CheckResult[];
}

interface CheckResult {
  name: string;
  passed: boolean;
  detail: string;
}

const REPOS = [
  "baseline-os", "gtcx-core", "gtcx-protocols", "gtcx-infrastructure",
  "gtcx-agentic", "gtcx-mobile", "gtcx-intelligence", "terminal-os",
  "ledger-ui", "compliance-os", "exploration-os", "griot-ai",
  "sensei-ai", "terra-os", "veritas-ai", "nyota-ai",
  "gtcx-operations", "gtcx-docs", "gtcx-agile", "gtcx-markets",
  "gtcx-platforms", "gtcx-hardware",
];

const REQUIRED_FILES = [
  "AGENTS.md",
  "CONVENTIONS.md",
  ".gitignore",
];

const AGENT_DIRS = [".baseline", ".kimi"];

function checkFileExists(repo: string, file: string): CheckResult {
  const path = join(ECOSYSTEM_ROOT, repo, file);
  return {
    name: `${file} exists`,
    passed: existsSync(path),
    detail: existsSync(path) ? "Found" : "Missing",
  };
}

function checkRoadmap(repo: string): CheckResult {
  const path = join(ECOSYSTEM_ROOT, repo, "docs", "roadmap", "ROADMAP-2026-07-13.md");
  return {
    name: "Canonical roadmap exists",
    passed: existsSync(path),
    detail: existsSync(path) ? "Found" : "Missing",
  };
}

function checkCiWorkflow(repo: string): CheckResult {
  const path = join(ECOSYSTEM_ROOT, repo, ".github", "workflows", "ci.yml");
  return {
    name: "CI workflow exists",
    passed: existsSync(path),
    detail: existsSync(path) ? "Found" : "Missing",
  };
}

function checkLicense(repo: string): CheckResult {
  let hasLicense = false;
  try {
    const pkg = JSON.parse(readFileSync(join(ECOSYSTEM_ROOT, repo, "package.json"), "utf-8"));
    hasLicense = !!pkg.license;
  } catch {
    try {
      const pyproject = readFileSync(join(ECOSYSTEM_ROOT, repo, "pyproject.toml"), "utf-8");
      hasLicense = pyproject.includes("license");
    } catch { /* ignore */ }
  }
  return {
    name: "License declared",
    passed: hasLicense,
    detail: hasLicense ? "Declared" : "Missing",
  };
}

function checkPackageManager(repo: string): CheckResult {
  const hasPnpm = existsSync(join(ECOSYSTEM_ROOT, repo, "pnpm-lock.yaml"));
  const hasNpm = existsSync(join(ECOSYSTEM_ROOT, repo, "package-lock.json"));
  return {
    name: "Uses pnpm (not npm)",
    passed: hasPnpm || !hasNpm,
    detail: hasPnpm ? "pnpm" : hasNpm ? "npm (migrate needed)" : "no lockfile",
  };
}

function checkAgentInfra(repo: string): CheckResult {
  const present = AGENT_DIRS.filter(d => existsSync(join(ECOSYSTEM_ROOT, repo, d)));
  return {
    name: "Agent infra present",
    passed: present.length >= 2,
    detail: `${present.length}/${AGENT_DIRS.length} dirs (${present.join(", ")})`,
  };
}

function validateRepo(repo: string): ValidationResult {
  const checks: CheckResult[] = [];
  for (const file of REQUIRED_FILES) {
    checks.push(checkFileExists(repo, file));
  }
  checks.push(checkRoadmap(repo));
  checks.push(checkCiWorkflow(repo));
  checks.push(checkLicense(repo));
  checks.push(checkPackageManager(repo));
  checks.push(checkAgentInfra(repo));
  return { repo, checks };
}

function generateMarkdown(results: ValidationResult[]): string {
  let md = `# Ecosystem Consistency Validation Report\n\n`;
  md += `**Generated:** ${new Date().toISOString()}\n\n`;

  const totalChecks = results.reduce((s, r) => s + r.checks.length, 0);
  const passedChecks = results.reduce((s, r) => s + r.checks.filter(c => c.passed).length, 0);
  const score = Math.round((passedChecks / totalChecks) * 100);

  md += `## Summary\n\n`;
  md += `| Metric | Value |\n`;
  md += `|--------|-------|\n`;
  md += `| Repos checked | ${results.length} |\n`;
  md += `| Total checks | ${totalChecks} |\n`;
  md += `| Passed | ${passedChecks} |\n`;
  md += `| Score | ${score}% |\n\n`;

  md += `## Per-Repo Results\n\n`;
  md += `| Repo | Score | Failed Checks |\n`;
  md += `|------|-------|---------------|\n`;
  for (const r of results) {
    const passed = r.checks.filter(c => c.passed).length;
    const failed = r.checks.filter(c => !c.passed);
    md += `| ${r.repo} | ${passed}/${r.checks.length} | ${failed.map(c => c.name).join(", ") || "—"} |\n`;
  }

  return md;
}

function main() {
  console.log(`Validating ${REPOS.length} repos...\n`);
  const results = REPOS.map(validateRepo);

  for (const r of results) {
    const passed = r.checks.filter(c => c.passed).length;
    console.log(`${r.repo}: ${passed}/${r.checks.length}`);
  }

  const totalChecks = results.reduce((s, r) => s + r.checks.length, 0);
  const passedChecks = results.reduce((s, r) => s + r.checks.filter(c => c.passed).length, 0);
  console.log(`\nTotal: ${passedChecks}/${totalChecks} (${Math.round((passedChecks / totalChecks) * 100)}%)`);

  const mdPath = join(ECOSYSTEM_ROOT, "gtcx-operations", "workstream", "ecosystem-consistency.md");
  writeFileSync(mdPath, generateMarkdown(results));
  console.log(`Report: ${mdPath}`);
}

main();
