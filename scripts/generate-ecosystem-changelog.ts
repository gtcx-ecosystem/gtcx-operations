#!/usr/bin/env tsx
/**
 * Ecosystem Changelog Generator
 *
 * Aggregates commits across all repos into a single changelog.
 * Run: `pnpm generate:changelog [--since=7d]`
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
}

const REPOS = [
  "baseline-os", "gtcx-core", "gtcx-protocols", "gtcx-infrastructure",
  "gtcx-agentic", "gtcx-mobile", "gtcx-intelligence", "terminal-os",
  "ledger-ui", "compliance-os", "exploration-os", "griot-ai",
  "sensei-ai", "terra-os", "veritas-ai", "nyota-ai",
  "gtcx-operations", "gtcx-docs", "gtcx-agile", "gtcx-markets",
  "gtcx-platforms", "gtcx-hardware"
];

function parseSince(): string {
  const arg = process.argv.find(a => a.startsWith("--since="));
  if (!arg) return "7 days ago";
  const val = arg.replace("--since=", "");
  if (val.endsWith("d")) return `${val.replace("d", "")} days ago`;
  if (val.endsWith("w")) return `${val.replace("w", "")} weeks ago`;
  return val;
}

function parseCommit(repo: string, line: string): Commit | null {
  const parts = line.split("|");
  if (parts.length < 4) return null;
  const [hash, date, author, ...msgParts] = parts;
  const message = msgParts.join("|").trim();

  // Parse conventional commit
  const match = message.match(/^(\w+)(?:\(([^)]+)\))?:\s*(.+)$/);
  const type = match?.[1] || "other";
  const scope = match?.[2] || "";
  const subject = match?.[3] || message;

  return { repo, hash: hash.trim(), date: date.trim(), author: author.trim(), message, type, scope, subject };
}

function getCommits(repo: string, since: string): Commit[] {
  const repoPath = join(ECOSYSTEM_ROOT, repo);
  if (!existsSync(join(repoPath, ".git"))) return [];

  try {
    const format = "%h|%aI|%an|%s";
    const output = execSync(
      `git log --since="${since}" --format="${format}"`,
      { cwd: repoPath, encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 }
    );
    return output.trim().split("\n").filter(Boolean).map(l => parseCommit(repo, l)).filter(Boolean) as Commit[];
  } catch {
    return [];
  }
}

function categorize(commits: Commit[]): Record<string, Commit[]> {
  const cats: Record<string, Commit[]> = {
    feat: [], fix: [], docs: [], chore: [], refactor: [], test: [], ci: [], other: []
  };
  for (const c of commits) {
    const cat = cats[c.type] ? c.type : "other";
    cats[cat].push(c);
  }
  return cats;
}

function generateMarkdown(commits: Commit[], since: string): string {
  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  const dateRange = since.includes("7") ? `${startDate.toISOString().split("T")[0]} → ${endDate}` : since;

  let md = `# Ecosystem Changelog\n\n`;
  md += `**Period:** ${dateRange}\n`;
  md += `**Repos:** ${REPOS.length}\n`;
  md += `**Commits:** ${commits.length}\n\n`;

  const categories = categorize(commits);

  const order = ["feat", "fix", "refactor", "docs", "test", "ci", "chore", "other"];
  for (const cat of order) {
    const items = categories[cat];
    if (!items.length) continue;

    const emoji: Record<string, string> = {
      feat: "✨", fix: "🐛", refactor: "♻️", docs: "📚",
      test: "✅", ci: "🔧", chore: "🧹", other: "📝"
    };

    md += `## ${emoji[cat] || "📝"} ${cat.charAt(0).toUpperCase() + cat.slice(1)} (${items.length})\n\n`;
    for (const c of items) {
      const scopeStr = c.scope ? `**${c.scope}**: ` : "";
      md += `- \`${c.repo}\` — ${scopeStr}${c.subject} ([${c.hash}](https://github.com/gtcx-ecosystem/${c.repo}/commit/${c.hash}))\n`;
    }
    md += `\n`;
  }

  md += `## Summary by Repo\n\n`;
  md += `| Repo | Commits |\n`;
  md += `|------|---------|\n`;
  const byRepo: Record<string, number> = {};
  for (const c of commits) byRepo[c.repo] = (byRepo[c.repo] || 0) + 1;
  for (const [repo, count] of Object.entries(byRepo).sort((a, b) => b[1] - a[1])) {
    md += `| ${repo} | ${count} |\n`;
  }

  return md;
}

function main() {
  const since = parseSince();
  console.log(`Generating changelog since: ${since}`);

  const allCommits: Commit[] = [];
  for (const repo of REPOS) {
    const commits = getCommits(repo, since);
    allCommits.push(...commits);
    if (commits.length) console.log(`  ${repo}: ${commits.length} commits`);
  }

  allCommits.sort((a, b) => b.date.localeCompare(a.date));

  const md = generateMarkdown(allCommits, since);
  const outPath = join(ECOSYSTEM_ROOT, "gtcx-operations", "workstream", `ecosystem-changelog-${new Date().toISOString().split("T")[0]}.md`);
  writeFileSync(outPath, md);

  console.log(`\nChangelog: ${outPath}`);
  console.log(`Total commits: ${allCommits.length}`);
}

main();
