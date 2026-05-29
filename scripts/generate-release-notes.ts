#!/usr/bin/env tsx
/**
 * Generate Release Notes
 *
 * Aggregates commits across repos into formatted release notes.
 * Supports version tagging, breaking change detection, contributor stats.
 *
 * Run: `pnpm generate:release-notes --version=1.2.0 [--since=tag]`
 */

import { execSync } from "child_process";
import { existsSync, writeFileSync } from "fs";
import { join } from "path";

const ECOSYSTEM_ROOT = process.env.ECOSYSTEM_ROOT || join(process.env.HOME || "", "Sites", "gtcx-ecosystem");

interface Commit {
  repo: string;
  hash: string;
  date: string;
  message: string;
  author: string;
  type: string;
  scope: string;
  subject: string;
  breaking: boolean;
}

const REPOS = [
  "baseline-os", "gtcx-core", "gtcx-protocols", "gtcx-infrastructure",
  "gtcx-agentic", "gtcx-mobile", "gtcx-intelligence", "terminal-os",
  "ledger-ui", "compliance-os", "exploration-os", "griot-ai",
  "sensei-ai", "terra-os", "veritas-ai", "nyota-ai",
  "gtcx-operations", "gtcx-docs", "gtcx-agile", "gtcx-markets",
  "gtcx-platforms", "gtcx-hardware"
];

function parseVersion(): string {
  const arg = process.argv.find(a => a.startsWith("--version="));
  return arg ? arg.replace("--version=", "") : "unversioned";
}

function parseSince(): string {
  const arg = process.argv.find(a => a.startsWith("--since="));
  return arg ? arg.replace("--since=", "") : "last-tag";
}

function parseCommit(repo: string, line: string): Commit | null {
  const parts = line.split("|");
  if (parts.length < 4) return null;
  const [hash, date, author, ...msgParts] = parts;
  const message = msgParts.join("|").trim();

  const match = message.match(/^(\w+)(?:\(([^)]+)\))?!?:\s*(.+)$/);
  const type = match?.[1] || "other";
  const scope = match?.[2] || "";
  const subject = match?.[3] || message;
  const breaking = message.includes("BREAKING CHANGE") || message.includes("!:");

  return { repo, hash: hash.trim(), date: date.trim(), author: author.trim(), message, type, scope, subject, breaking };
}

function getCommits(repo: string, since: string): Commit[] {
  const repoPath = join(ECOSYSTEM_ROOT, repo);
  if (!existsSync(join(repoPath, ".git"))) return [];

  let sinceRef = since;
  if (since === "last-tag") {
    try {
      sinceRef = execSync("git describe --tags --abbrev=0", { cwd: repoPath, encoding: "utf-8" }).trim();
    } catch {
      sinceRef = "7 days ago";
    }
  }

  try {
    const format = "%h|%aI|%an|%s";
    let logCmd: string;
    if (sinceRef.match(/^\d+\s+(days?|weeks?|months?)\s+ago$/i)) {
      logCmd = `git log --since="${sinceRef}" --format="${format}"`;
    } else if (sinceRef.includes("..") || sinceRef.match(/^[a-f0-9]+$/i) || sinceRef.match(/^v?\d/)) {
      logCmd = `git log ${sinceRef}..HEAD --format="${format}"`;
    } else {
      logCmd = `git log --since="${sinceRef}" --format="${format}"`;
    }
    const output = execSync(logCmd, { cwd: repoPath, encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 });
    return output.trim().split("\n").filter(Boolean).map(l => parseCommit(repo, l)).filter(Boolean) as Commit[];
  } catch {
    return [];
  }
}

function generateMarkdown(commits: Commit[], version: string): string {
  const breaking = commits.filter(c => c.breaking);
  const byType: Record<string, Commit[]> = {};
  for (const c of commits) {
    const cat = byType[c.type] ? c.type : "other";
    if (!byType[cat]) byType[cat] = [];
    byType[cat].push(c);
  }

  let md = `# Ecosystem Release Notes v${version}\n\n`;
  md += `**Date:** ${new Date().toISOString().split("T")[0]}\n`;
  md += `**Repos:** ${REPOS.length}\n`;
  md += `**Commits:** ${commits.length}\n`;

  const contributors = [...new Set(commits.map(c => c.author))];
  md += `**Contributors:** ${contributors.length}\n\n`;

  if (breaking.length > 0) {
    md += `## ⚠️ Breaking Changes\n\n`;
    for (const c of breaking) {
      md += `- \`${c.repo}\` — ${c.subject} ([${c.hash}](https://github.com/gtcx-ecosystem/${c.repo}/commit/${c.hash}))\n`;
    }
    md += `\n`;
  }

  const order = ["feat", "fix", "refactor", "docs", "test", "ci", "chore", "other"];
  for (const cat of order) {
    const items = byType[cat];
    if (!items?.length) continue;

    const emoji: Record<string, string> = {
      feat: "Features", fix: "Bug Fixes", refactor: "Refactoring",
      docs: "Documentation", test: "Tests", ci: "CI/CD",
      chore: "Chores", other: "Other"
    };

    md += `## ${emoji[cat] || cat}\n\n`;
    for (const c of items) {
      const scopeStr = c.scope ? `**${c.scope}**: ` : "";
      md += `- \`${c.repo}\` — ${scopeStr}${c.subject} ([${c.hash}](https://github.com/gtcx-ecosystem/${c.repo}/commit/${c.hash}))\n`;
    }
    md += `\n`;
  }

  md += `## Contributors\n\n`;
  for (const author of contributors.sort()) {
    const count = commits.filter(c => c.author === author).length;
    md += `- ${author} (${count} commits)\n`;
  }

  return md;
}

function main() {
  const version = parseVersion();
  const since = parseSince();

  console.log(`Generating release notes v${version} since: ${since}`);
  const allCommits: Commit[] = [];

  for (const repo of REPOS) {
    process.stdout.write(`  ${repo}... `);
    const commits = getCommits(repo, since);
    allCommits.push(...commits);
    console.log(`${commits.length} commits`);
  }

  allCommits.sort((a, b) => b.date.localeCompare(a.date));

  const md = generateMarkdown(allCommits, version);
  const outPath = join(ECOSYSTEM_ROOT, "gtcx-operations", "workstream", `release-notes-v${version}.md`);
  writeFileSync(outPath, md);

  console.log(`\nRelease notes: ${outPath}`);
  console.log(`Total commits: ${allCommits.length}`);
  console.log(`Breaking changes: ${allCommits.filter(c => c.breaking).length}`);
}

main();
