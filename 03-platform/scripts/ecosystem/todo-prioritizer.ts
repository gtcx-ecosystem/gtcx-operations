#!/usr/bin/env tsx
/**
 * TODO/FIXME Prioritization Tracker
 *
 * Scans repos for TODO/FIXME comments, prioritizes by age, impact, and layer.
 * Tracks resolution progress over time.
 *
 * Run: `pnpm track:todos`
 */

import { execSync } from "child_process";
import { writeFileSync } from "fs";
import { join } from "path";

const ECOSYSTEM_ROOT = process.env.ECOSYSTEM_ROOT || join(process.env.HOME || "", "Sites", "gtcx-ecosystem");

const REPOS = [
  "baseline-os", "gtcx-core", "gtcx-protocols", "gtcx-infrastructure",
  "gtcx-agentic", "gtcx-mobile", "gtcx-intelligence", "terminal-os",
  "ledger-ui", "compliance-os", "exploration-os", "griot-ai",
  "sensei-ai", "terra-os", "veritas-ai", "nyota-ai",
  "gtcx-operations", "gtcx-docs", "gtcx-agile", "gtcx-markets",
  "gtcx-platforms", "gtcx-hardware"
];

interface TodoItem {
  repo: string;
  file: string;
  line: number;
  text: string;
  type: "TODO" | "FIXME" | "HACK" | "XXX";
  author: string;
  date: string;
  daysOld: number;
  priority: number;
}

function scanRepo(repo: string): TodoItem[] {
  const repoPath = join(ECOSYSTEM_ROOT, repo);
  const items: TodoItem[] = [];

  try {
    const output = execSync(
      `git grep -n -E "(TODO|FIXME|HACK|XXX):" -- '*.ts' '*.tsx' '*.js' '*.jsx' '*.mjs' '*.py' '*.rs' '*.go' '*.md' || true`,
      { cwd: repoPath, encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 }
    );

    for (const line of output.split("\n").filter(Boolean)) {
      const match = line.match(/^([^:]+):(\d+):(.*)$/);
      if (!match) continue;

      const [, file, lineNum, content] = match;
      const todoMatch = content.match(/(TODO|FIXME|HACK|XXX):\s*(.+)/);
      if (!todoMatch) continue;

      const type = todoMatch[1] as TodoItem["type"];
      const text = todoMatch[2].trim();

      // Get blame info
      let author = "unknown";
      let date = "unknown";
      let daysOld = 0;
      try {
        const blame = execSync(
          `git blame -L ${lineNum},${lineNum} --porcelain -- "${file}"`,
          { cwd: repoPath, encoding: "utf-8" }
        );
        const authorMatch = blame.match(/^author (.+)$/m);
        const timeMatch = blame.match(/^author-time (\d+)$/m);
        if (authorMatch) author = authorMatch[1];
        if (timeMatch) {
          const timestamp = parseInt(timeMatch[1]) * 1000;
          date = new Date(timestamp).toISOString().split("T")[0];
          daysOld = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));
        }
      } catch { /* ignore blame errors */ }

      // Calculate priority score
      let priority = daysOld;
      if (type === "FIXME") priority *= 2;
      if (type === "HACK") priority *= 1.5;
      if (text.toLowerCase().includes("security")) priority *= 3;
      if (text.toLowerCase().includes("critical")) priority *= 3;
      if (text.toLowerCase().includes("bug")) priority *= 2;

      items.push({ repo, file, line: parseInt(lineNum), text, type, author, date, daysOld, priority });
    }
  } catch { /* ignore grep errors */ }

  return items;
}

function generateMarkdown(items: TodoItem[]): string {
  const total = items.length;
  const byType: Record<string, number> = {};
  const byRepo: Record<string, number> = {};
  for (const item of items) {
    byType[item.type] = (byType[item.type] || 0) + 1;
    byRepo[item.repo] = (byRepo[item.repo] || 0) + 1;
  }

  let md = `# TODO/FIXME Prioritization Report\n\n`;
  md += `**Generated:** ${new Date().toISOString().split("T")[0]}\n`;
  md += `**Total items:** ${total}\n`;
  md += `**Repos with debt:** ${Object.keys(byRepo).length}\n\n`;

  md += `## Summary by Type\n\n`;
  md += `| Type | Count |\n`;
  md += `|------|-------|\n`;
  for (const [type, count] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
    md += `| ${type} | ${count} |\n`;
  }
  md += `\n`;

  md += `## Summary by Repo\n\n`;
  md += `| Repo | Count |\n`;
  md += `|------|-------|\n`;
  for (const [repo, count] of Object.entries(byRepo).sort((a, b) => b[1] - a[1])) {
    md += `| ${repo} | ${count} |\n`;
  }
  md += `\n`;

  // Top priorities
  const critical = items.filter(i => i.priority > 100);
  const stale = items.filter(i => i.daysOld > 365);

  if (critical.length > 0) {
    md += `## Critical Priority (score > 100)\n\n`;
    md += `| Repo | File | Line | Type | Age | Text |\n`;
    md += `|------|------|------|------|-----|------|\n`;
    for (const item of critical.sort((a, b) => b.priority - a.priority).slice(0, 20)) {
      md += `| ${item.repo} | ${item.file} | ${item.line} | ${item.type} | ${item.daysOld}d | ${item.text.slice(0, 50)} |\n`;
    }
    md += `\n`;
  }

  if (stale.length > 0) {
    md += `## Stale (>1 year old)\n\n`;
    md += `| Repo | File | Line | Type | Age | Author | Text |\n`;
    md += `|------|------|------|------|-----|--------|------|\n`;
    for (const item of stale.sort((a, b) => b.daysOld - a.daysOld).slice(0, 20)) {
      md += `| ${item.repo} | ${item.file} | ${item.line} | ${item.type} | ${item.daysOld}d | ${item.author} | ${item.text.slice(0, 40)} |\n`;
    }
    md += `\n`;
  }

  // All items sorted by priority
  md += `## Full Backlog (sorted by priority)\n\n`;
  md += `| Priority | Repo | File | Line | Type | Age | Text |\n`;
  md += `|----------|------|------|------|------|-----|------|\n`;
  for (const item of items.sort((a, b) => b.priority - a.priority).slice(0, 50)) {
    md += `| ${Math.round(item.priority)} | ${item.repo} | ${item.file} | ${item.line} | ${item.type} | ${item.daysOld}d | ${item.text.slice(0, 40)} |\n`;
  }
  if (items.length > 50) {
    md += `| ... | ... | ... | ... | ... | ... | ... and ${items.length - 50} more |\n`;
  }

  return md;
}

function main() {
  console.log("Scanning TODOs/FIXMEs across 22 repos...");
  let allItems: TodoItem[] = [];

  for (const repo of REPOS) {
    process.stdout.write(`  ${repo}... `);
    const items = scanRepo(repo);
    allItems.push(...items);
    console.log(`${items.length} items`);
  }

  const md = generateMarkdown(allItems);
  const outPath = join(ECOSYSTEM_ROOT, "gtcx-operations", "workstream", `todo-backlog-${new Date().toISOString().split("T")[0]}.md`);
  writeFileSync(outPath, md);

  console.log(`\nTotal: ${allItems.length} items`);
  console.log(`Critical (>100): ${allItems.filter(i => i.priority > 100).length}`);
  console.log(`Stale (>1yr): ${allItems.filter(i => i.daysOld > 365).length}`);
  console.log(`Report: ${outPath}`);
}

main();
