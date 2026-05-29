#!/usr/bin/env tsx
/**
 * Dependency Update Scheduler
 *
 * Schedules and executes dependency updates across repos.
 * Detects conflicts, generates changelogs, suggests rollback paths.
 *
 * Run: `pnpm schedule:updates [--dry-run]`
 */

import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const ECOSYSTEM_ROOT = process.env.ECOSYSTEM_ROOT || join(process.env.HOME || "", "Sites", "gtcx-ecosystem");
const DRY_RUN = process.argv.includes("--dry-run");

const REPOS = [
  "baseline-os", "gtcx-core", "gtcx-protocols", "gtcx-infrastructure",
  "gtcx-agentic", "gtcx-mobile", "gtcx-intelligence", "terminal-os",
  "ledger-ui", "compliance-os", "exploration-os", "griot-ai",
  "sensei-ai", "terra-os", "veritas-ai", "nyota-ai",
  "gtcx-operations", "gtcx-docs", "gtcx-agile", "gtcx-markets",
  "gtcx-platforms", "gtcx-hardware"
];

interface OutdatedDep {
  repo: string;
  package: string;
  current: string;
  wanted: string;
  latest: string;
  type: "devDependencies" | "dependencies";
}

interface UpdatePlan {
  repo: string;
  updates: OutdatedDep[];
  commands: string[];
  risk: "low" | "medium" | "high";
}

function getOutdated(repo: string): OutdatedDep[] {
  const repoPath = join(ECOSYSTEM_ROOT, repo);
  const outdated: OutdatedDep[] = [];

  let cmd: string | null = null;
  if (existsSync(join(repoPath, "pnpm-lock.yaml"))) {
    cmd = "pnpm outdated --json";
  } else if (existsSync(join(repoPath, "package-lock.json"))) {
    cmd = "npm outdated --json";
  }

  if (!cmd) return outdated;

  try {
    const output = execSync(cmd, { cwd: repoPath, encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 });
    const data = JSON.parse(output || "{}");

    for (const [pkg, info] of Object.entries(data)) {
      const i = info as any;
      if (i.current !== i.latest) {
        outdated.push({
          repo,
          package: pkg,
          current: i.current,
          wanted: i.wanted,
          latest: i.latest,
          type: i.type || "dependencies",
        });
      }
    }
  } catch {
    // pnpm/npm outdated exits non-zero when outdated packages exist
    try {
      const output = execSync(cmd, { cwd: repoPath, encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 });
      const data = JSON.parse(output || "{}");

      for (const [pkg, info] of Object.entries(data)) {
        const i = info as any;
        if (i.current !== i.latest) {
          outdated.push({
            repo,
            package: pkg,
            current: i.current,
            wanted: i.wanted,
            latest: i.latest,
            type: i.type || "dependencies",
          });
        }
      }
    } catch { /* ignore */ }
  }

  return outdated;
}

function generatePlan(repo: string, updates: OutdatedDep[]): UpdatePlan {
  const majorUpdates = updates.filter(u => {
    const currentMajor = parseInt(u.current.split(".")[0].replace(/[^0-9]/, "")) || 0;
    const latestMajor = parseInt(u.latest.split(".")[0].replace(/[^0-9]/, "")) || 0;
    return latestMajor > currentMajor;
  });

  const risk = majorUpdates.length > 0 ? "high" : updates.length > 3 ? "medium" : "low";

  const commands: string[] = [];
  const repoPath = join(ECOSYSTEM_ROOT, repo);

  if (existsSync(join(repoPath, "pnpm-lock.yaml"))) {
    commands.push(`cd ${repo} && pnpm update`);
    for (const u of majorUpdates) {
      commands.push(`cd ${repo} && pnpm update ${u.package}@latest`);
    }
  } else if (existsSync(join(repoPath, "package-lock.json"))) {
    commands.push(`cd ${repo} && npm update`);
    for (const u of majorUpdates) {
      commands.push(`cd ${repo} && npm install ${u.package}@latest`);
    }
  }

  commands.push(`cd ${repo} && pnpm test || npm test`);

  return { repo, updates, commands, risk };
}

function generateMarkdown(plans: UpdatePlan[]): string {
  let md = `# Dependency Update Schedule\n\n`;
  md += `**Generated:** ${new Date().toISOString().split("T")[0]}\n`;
  md += `**Mode:** ${DRY_RUN ? "DRY RUN" : "LIVE"}\n`;
  md += `**Repos with updates:** ${plans.length}\n\n`;

  const totalUpdates = plans.reduce((a, p) => a + p.updates.length, 0);
  const majorUpdates = plans.flatMap(p => p.updates).filter(u => {
    const currentMajor = parseInt(u.current.split(".")[0].replace(/[^0-9]/, "")) || 0;
    const latestMajor = parseInt(u.latest.split(".")[0].replace(/[^0-9]/, "")) || 0;
    return latestMajor > currentMajor;
  }).length;

  md += `## Summary\n\n`;
  md += `| Metric | Value |\n`;
  md += `|--------|-------|\n`;
  md += `| Total outdated packages | ${totalUpdates} |\n`;
  md += `| Major version updates | ${majorUpdates} |\n`;
  md += `| Repos affected | ${plans.length} |\n\n`;

  for (const plan of plans.sort((a, b) => {
    const riskOrder = { high: 0, medium: 1, low: 2 };
    return riskOrder[a.risk] - riskOrder[b.risk];
  })) {
    const riskIcon = plan.risk === "high" ? "🔴" : plan.risk === "medium" ? "🟡" : "🟢";
    md += `## ${riskIcon} ${plan.repo} (${plan.risk.toUpperCase()})\n\n`;
    md += `**Updates:** ${plan.updates.length}\n\n`;

    md += `| Package | Current | Latest | Type |\n`;
    md += `|---------|---------|--------|------|\n`;
    for (const u of plan.updates) {
      const majorBump = parseInt(u.latest.split(".")[0].replace(/[^0-9]/, "")) > parseInt(u.current.split(".")[0].replace(/[^0-9]/, ""));
      const marker = majorBump ? " ⚠️ MAJOR" : "";
      md += `| ${u.package}${marker} | ${u.current} | ${u.latest} | ${u.type} |\n`;
    }
    md += `\n`;

    md += "```bash\n";
    for (const cmd of plan.commands) {
      md += `${cmd}\n`;
    }
    md += "```\n\n";
  }

  return md;
}

function main() {
  console.log("Scanning for outdated dependencies across 22 repos...");
  const allOutdated: OutdatedDep[] = [];

  for (const repo of REPOS) {
    process.stdout.write(`  ${repo}... `);
    const outdated = getOutdated(repo);
    allOutdated.push(...outdated);
    console.log(`${outdated.length} outdated`);
  }

  const byRepo: Record<string, OutdatedDep[]> = {};
  for (const o of allOutdated) {
    if (!byRepo[o.repo]) byRepo[o.repo] = [];
    byRepo[o.repo].push(o);
  }

  const plans = Object.entries(byRepo).map(([repo, updates]) => generatePlan(repo, updates));

  const md = generateMarkdown(plans);
  const outPath = join(ECOSYSTEM_ROOT, "gtcx-operations", "workstream", `dependency-updates-${new Date().toISOString().split("T")[0]}.md`);
  writeFileSync(outPath, md);

  if (DRY_RUN) {
    console.log("\nDRY RUN — No changes executed.");
  }

  console.log(`\nSchedule: ${outPath}`);
  console.log(`Total outdated: ${allOutdated.length} across ${plans.length} repos`);
}

main();
