#!/usr/bin/env tsx
/**
 * Ecosystem Health Dashboard
 *
 * Scans all GTCX repos and produces a machine-readable health report.
 * Run: `pnpm ecosystem:health` or `tsx 03-platform/scripts/ecosystem-health.ts`
 */

import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const ECOSYSTEM_ROOT = process.env.ECOSYSTEM_ROOT || join(process.env.HOME || "", "Sites", "gtcx-ecosystem");

interface RepoHealth {
  name: string;
  tier: string;
  exists: boolean;
  isGitRepo: boolean;
  commitsSinceMay1: number;
  dirtyFiles: number;
  hasAgentsMd: boolean;
  hasRoadmap: boolean;
  hasConventionsMd: boolean;
  hasCiWorkflow: boolean;
  packageManager: string | null;
  license: string | null;
  latestCommitHash: string;
  latestCommitDate: string;
  branch: string;
  unpushedCommits: number;
}

const REPOS = [
  { name: "baseline-os", tier: "Core" },
  { name: "gtcx-core", tier: "Core" },
  { name: "gtcx-protocols", tier: "Core" },
  { name: "gtcx-infrastructure", tier: "Core" },
  { name: "gtcx-agentic", tier: "Product" },
  { name: "gtcx-mobile", tier: "Product" },
  { name: "gtcx-intelligence", tier: "Product" },
  { name: "terminal-os", tier: "Product" },
  { name: "ledger-ui", tier: "Product" },
  { name: "compliance-os", tier: "Domain" },
  { name: "exploration-os", tier: "Domain" },
  { name: "griot-ai", tier: "Domain" },
  { name: "sensei-ai", tier: "Domain" },
  { name: "terra-os", tier: "Domain" },
  { name: "veritas-ai", tier: "Domain" },
  { name: "nyota-ai", tier: "Domain" },
  { name: "gtcx-operations", tier: "Ops" },
  { name: "gtcx-docs", tier: "Ops" },
  { name: "gtcx-agile", tier: "Ops" },
  { name: "gtcx-markets", tier: "Ops" },
  { name: "gtcx-platforms", tier: "Ops" },
  { name: "gtcx-hardware", tier: "Ops" },
];

function run(repo: string, cmd: string): string {
  try {
    return execSync(cmd, {
      cwd: join(ECOSYSTEM_ROOT, repo),
      encoding: "utf-8",
      timeout: 5000,
    }).trim();
  } catch {
    return "";
  }
}

function countLines(output: string): number {
  if (!output) return 0;
  return output.split("\n").filter((l) => l.trim()).length;
}

function detectPackageManager(repoPath: string): string | null {
  if (existsSync(join(repoPath, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(repoPath, "package-lock.json"))) return "npm";
  if (existsSync(join(repoPath, "yarn.lock"))) return "yarn";
  if (existsSync(join(repoPath, "Cargo.lock"))) return "cargo";
  if (existsSync(join(repoPath, "poetry.lock"))) return "poetry";
  if (existsSync(join(repoPath, "Pipfile.lock"))) return "pipenv";
  return null;
}

function detectLicense(repoPath: string): string | null {
  try {
    const pkg = JSON.parse(readFileSync(join(repoPath, "package.json"), "utf-8"));
    if (pkg.license) return pkg.license;
  } catch {
    // ignore
  }
  try {
    const pyproject = readFileSync(join(repoPath, "pyproject.toml"), "utf-8");
    const match = pyproject.match(/license\s*=\s*"([^"]+)"/);
    if (match) return match[1];
  } catch {
    // ignore
  }
  return null;
}

function scanRepo(repo: string): RepoHealth {
  const repoPath = join(ECOSYSTEM_ROOT, repo);
  const exists = existsSync(repoPath);
  const isGitRepo = existsSync(join(repoPath, ".git"));

  if (!exists || !isGitRepo) {
    return {
      name: repo,
      tier: "",
      exists,
      isGitRepo,
      commitsSinceMay1: 0,
      dirtyFiles: 0,
      hasAgentsMd: false,
      hasRoadmap: false,
      hasConventionsMd: false,
      hasCiWorkflow: false,
      packageManager: null,
      license: null,
      latestCommitHash: "",
      latestCommitDate: "",
      branch: "",
      unpushedCommits: 0,
    };
  }

  const commitsSinceMay1 = countLines(
    run(repo, "git log --oneline --since='2026-05-01' --format='%h'")
  );
  const dirtyFiles = countLines(run(repo, "git status --short"));
  const hasAgentsMd = existsSync(join(repoPath, "AGENTS.md"));
  const hasRoadmap = existsSync(join(repoPath, "docs", "roadmap", "ROADMAP-2026-07-13.md"));
  const hasConventionsMd = existsSync(join(repoPath, "CONVENTIONS.md"));
  const hasCiWorkflow = existsSync(join(repoPath, ".github", "workflows"));
  const packageManager = detectPackageManager(repoPath);
  const license = detectLicense(repoPath);
  const latestCommitHash = run(repo, "git rev-parse --short HEAD");
  const latestCommitDate = run(repo, "git log -1 --format=%ci");
  const branch = run(repo, "git rev-parse --abbrev-ref HEAD");
  const unpushedCommits = countLines(
    run(repo, "git log --oneline @{u}..HEAD 2>/dev/null || true")
  );

  return {
    name: repo,
    tier: "",
    exists,
    isGitRepo,
    commitsSinceMay1,
    dirtyFiles,
    hasAgentsMd,
    hasRoadmap,
    hasConventionsMd,
    hasCiWorkflow,
    packageManager,
    license,
    latestCommitHash,
    latestCommitDate,
    branch,
    unpushedCommits,
  };
}

function generateMarkdown(report: RepoHealth[]): string {
  const total = report.length;
  const withRoadmap = report.filter((r) => r.hasRoadmap).length;
  const withConventions = report.filter((r) => r.hasConventionsMd).length;
  const withCi = report.filter((r) => r.hasCiWorkflow).length;
  const totalDirty = report.reduce((sum, r) => sum + r.dirtyFiles, 0);
  const avgCommits = Math.round(
    report.reduce((sum, r) => sum + r.commitsSinceMay1, 0) / total
  );

  let md = `# GTCX Ecosystem Health Report\n\n`;
  md += `**Generated:** ${new Date().toISOString()}\n`;
  md += `**Repos scanned:** ${total}\n\n`;

  md += `## Summary\n\n`;
  md += `| Metric | Value |\n`;
  md += `|--------|-------|\n`;
  md += `| Repos with roadmap | ${withRoadmap}/${total} |\n`;
  md += `| Repos with CONVENTIONS.md | ${withConventions}/${total} |\n`;
  md += `| Repos with CI | ${withCi}/${total} |\n`;
  md += `| Total dirty files | ${totalDirty} |\n`;
  md += `| Avg commits since May 1 | ${avgCommits} |\n`;
  md += `| Repos with unpushed commits | ${report.filter((r) => r.unpushedCommits > 0).length} |\n\n`;

  md += `## Repo-by-Repo Status\n\n`;
  md += `| Repo | Commits | Dirty | Roadmap | CONVENTIONS | CI | License | Package Mgr | Unpushed |\n`;
  md += `|------|---------|-------|---------|-------------|----|---------|-------------|----------|\n`;

  for (const r of report) {
    md += `| **${r.name}** | ${r.commitsSinceMay1} | ${r.dirtyFiles} | ${r.hasRoadmap ? "✅" : "❌"} | ${r.hasConventionsMd ? "✅" : "❌"} | ${r.hasCiWorkflow ? "✅" : "❌"} | ${r.license || "—"} | ${r.packageManager || "—"} | ${r.unpushedCommits} |\n`;
  }

  md += `\n## Dirty File Leaders\n\n`;
  const dirtyLeaders = [...report].sort((a, b) => b.dirtyFiles - a.dirtyFiles).slice(0, 10);
  md += `| Rank | Repo | Dirty Files |\n`;
  md += `|------|------|-------------|\n`;
  dirtyLeaders.forEach((r, i) => {
    md += `| ${i + 1} | ${r.name} | ${r.dirtyFiles} |\n`;
  });

  md += `\n## Governance Gaps\n\n`;
  const noConventions = report.filter((r) => !r.hasConventionsMd && r.exists);
  if (noConventions.length > 0) {
    md += `**Repos without CONVENTIONS.md:** ${noConventions.map((r) => r.name).join(", ")}\n\n`;
  }
  const noCi = report.filter((r) => !r.hasCiWorkflow && r.exists);
  if (noCi.length > 0) {
    md += `**Repos without CI:** ${noCi.map((r) => r.name).join(", ")}\n\n`;
  }

  return md;
}

async function main() {
  console.log(`Scanning ${REPOS.length} repos in ${ECOSYSTEM_ROOT}...\n`);

  const report: RepoHealth[] = [];
  for (const { name, tier } of REPOS) {
    process.stdout.write(`  ${name} ... `);
    const data = scanRepo(name);
    data.tier = tier;
    report.push(data);
    console.log(
      `${data.commitsSinceMay1} commits, ${data.dirtyFiles} dirty, roadmap=${data.hasRoadmap ? "Y" : "N"}`
    );
  }

  const jsonPath = join(ECOSYSTEM_ROOT, "gtcx-operations", "workstream", "ecosystem-health.json");
  const mdPath = join(ECOSYSTEM_ROOT, "gtcx-operations", "workstream", "ecosystem-health.md");

  writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  writeFileSync(mdPath, generateMarkdown(report));

  console.log(`\nReports written:`);
  console.log(`  JSON: ${jsonPath}`);
  console.log(`  MD:   ${mdPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
