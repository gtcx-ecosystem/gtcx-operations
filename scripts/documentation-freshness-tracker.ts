#!/usr/bin/env tsx
/**
 * Documentation Freshness Tracker
 *
 * Scans docs across repos and flags stale content, old TODOs.
 * Run: `pnpm track:docs [--check-links]`
 */

import { execSync } from "child_process";
import { existsSync, readFileSync, statSync, writeFileSync } from "fs";
import { join, relative } from "path";

const ECOSYSTEM_ROOT = process.env.ECOSYSTEM_ROOT || join(process.env.HOME || "", "Sites", "gtcx-ecosystem");

interface DocFile {
  repo: string;
  relPath: string;
  daysStale: number;
  size: number;
  todos: number;
  fixmes: number;
}

const REPOS = [
  "baseline-os", "gtcx-core", "gtcx-protocols", "gtcx-infrastructure",
  "gtcx-agentic", "gtcx-mobile", "gtcx-intelligence", "terminal-os",
  "ledger-ui", "compliance-os", "exploration-os", "griot-ai",
  "sensei-ai", "terra-os", "veritas-ai", "nyota-ai",
  "gtcx-operations", "gtcx-docs", "gtcx-agile", "gtcx-markets",
  "gtcx-platforms", "gtcx-hardware"
];

const STALE_DAYS = 90;
const CRITICAL_DAYS = 180;
const CHECK_LINKS = process.argv.includes("--check-links");

function scanRepo(repo: string): DocFile[] {
  const repoPath = join(ECOSYSTEM_ROOT, repo);
  if (!existsSync(repoPath)) return [];

  // Get all markdown files via git ls-files (fast, respects .gitignore)
  let files: string[] = [];
  try {
    const output = execSync("git ls-files -- '*.md'", { cwd: repoPath, encoding: "utf-8" });
    files = output.trim().split("\n").filter(Boolean);
  } catch {
    return [];
  }

  // Get last modified dates for all files in one batch
  const modTimes: Record<string, string> = {};
  try {
    const logOutput = execSync("git log --name-only --format='%aI' -- '*.md'", { cwd: repoPath, encoding: "utf-8" });
    const lines = logOutput.split("\n");
    let currentDate = "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed.match(/^\d{4}-\d{2}-\d{2}T/)) {
        currentDate = trimmed;
      } else if (trimmed.endsWith(".md") && !modTimes[trimmed]) {
        modTimes[trimmed] = currentDate;
      }
    }
  } catch { /* ignore */ }

  const docs: DocFile[] = [];
  for (const relPath of files) {
    const fullPath = join(repoPath, relPath);
    if (!existsSync(fullPath)) continue;

    try {
      const stat = statSync(fullPath);
      const content = readFileSync(fullPath, "utf-8");
      const todos = (content.match(/TODO/gi) || []).length;
      const fixmes = (content.match(/FIXME/gi) || []).length;

      const lastModified = modTimes[relPath];
      const daysStale = lastModified
        ? Math.floor((Date.now() - new Date(lastModified).getTime()) / (1000 * 60 * 60 * 24))
        : Math.floor((Date.now() - stat.mtime.getTime()) / (1000 * 60 * 60 * 24));

      docs.push({ repo, relPath, daysStale, size: stat.size, todos, fixmes });
    } catch { /* skip */ }
  }

  return docs;
}

function checkLinks(files: DocFile[]): Array<{ repo: string; source: string; target: string; line: number }> {
  const broken: Array<{ repo: string; source: string; target: string; line: number }> = [];
  const allPaths = new Set(files.map(f => f.relPath));

  for (const file of files) {
    try {
      const content = readFileSync(join(ECOSYSTEM_ROOT, file.repo, file.relPath), "utf-8");
      const lines = content.split("\n");
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

      for (let i = 0; i < lines.length; i++) {
        let match;
        while ((match = linkRegex.exec(lines[i])) !== null) {
          const target = match[2];
          if (target.startsWith("http") || target.startsWith("#") || target.startsWith("mailto:")) continue;

          let normalized = target;
          if (target.startsWith("./") || target.startsWith("../")) {
            const baseDir = file.relPath.split("/").slice(0, -1).join("/");
            normalized = join(baseDir, target).replace(/\\/g, "/");
          }
          if (!allPaths.has(normalized) && !allPaths.has(normalized + ".md")) {
            broken.push({ repo: file.repo, source: file.relPath, target, line: i + 1 });
          }
        }
      }
    } catch { /* skip */ }
  }

  return broken;
}

function generateMarkdown(files: DocFile[], broken: Array<{ repo: string; source: string; target: string; line: number }>): string {
  const totalFiles = files.length;
  const staleFiles = files.filter(f => f.daysStale > STALE_DAYS);
  const criticalStale = files.filter(f => f.daysStale > CRITICAL_DAYS);
  const totalTodos = files.reduce((a, f) => a + f.todos, 0);
  const totalFixmes = files.reduce((a, f) => a + f.fixmes, 0);

  let md = `# Documentation Freshness Report\n\n`;
  md += `**Generated:** ${new Date().toISOString().split("T")[0]}\n`;
  md += `**Repos:** ${REPOS.length}\n`;
  md += `**Markdown files:** ${totalFiles}\n\n`;

  md += `## Summary\n\n`;
  md += `| Metric | Value |\n`;
  md += `|--------|-------|\n`;
  md += `| Total markdown files | ${totalFiles} |\n`;
  md += `| Stale (>${STALE_DAYS}d) | ${staleFiles.length} |\n`;
  md += `| Critically stale (>${CRITICAL_DAYS}d) | ${criticalStale.length} |\n`;
  md += `| Broken internal links | ${broken.length} |\n`;
  md += `| TODOs | ${totalTodos} |\n`;
  md += `| FIXMEs | ${totalFixmes} |\n\n`;

  if (criticalStale.length) {
    md += `## Critically Stale Files (>${CRITICAL_DAYS} days)\n\n`;
    md += `| Repo | File | Days Stale |\n`;
    md += `|------|------|------------|\n`;
    for (const f of criticalStale.sort((a, b) => b.daysStale - a.daysStale).slice(0, 30)) {
      md += `| ${f.repo} | ${f.relPath} | ${f.daysStale} |\n`;
    }
    md += `\n`;
  }

  if (staleFiles.length > criticalStale.length) {
    const moderatelyStale = staleFiles.filter(f => f.daysStale <= CRITICAL_DAYS);
    md += `## Stale Files (${STALE_DAYS}-${CRITICAL_DAYS} days)\n\n`;
    md += `| Repo | File | Days Stale |\n`;
    md += `|------|------|------------|\n`;
    for (const f of moderatelyStale.sort((a, b) => b.daysStale - a.daysStale).slice(0, 30)) {
      md += `| ${f.repo} | ${f.relPath} | ${f.daysStale} |\n`;
    }
    md += `\n`;
  }

  if (broken.length) {
    md += `## Broken Internal Links\n\n`;
    md += `| Repo | Source | Target | Line |\n`;
    md += `|------|--------|--------|------|\n`;
    for (const b of broken.slice(0, 30)) {
      md += `| ${b.repo} | ${b.source} | ${b.target} | ${b.line} |\n`;
    }
    if (broken.length > 30) md += `| ... | ... | ... | ... |\n`;
    md += `\n`;
  }

  const reposWithDocs: Record<string, { count: number; stale: number; todos: number }> = {};
  for (const f of files) {
    if (!reposWithDocs[f.repo]) reposWithDocs[f.repo] = { count: 0, stale: 0, todos: 0 };
    reposWithDocs[f.repo].count++;
    if (f.daysStale > STALE_DAYS) reposWithDocs[f.repo].stale++;
    reposWithDocs[f.repo].todos += f.todos;
  }

  md += `## Per-Repo Documentation\n\n`;
  md += `| Repo | Files | Stale | TODOs |\n`;
  md += `|------|-------|-------|-------|\n`;
  for (const [repo, info] of Object.entries(reposWithDocs).sort((a, b) => b[1].count - a[1].count)) {
    md += `| ${repo} | ${info.count} | ${info.stale} | ${info.todos} |\n`;
  }

  return md;
}

function main() {
  console.log("Scanning documentation across 22 repos...");
  let allFiles: DocFile[] = [];

  for (const repo of REPOS) {
    process.stdout.write(`  ${repo}... `);
    const files = scanRepo(repo);
    allFiles.push(...files);
    console.log(`${files.length} files`);
  }

  let broken: Array<{ repo: string; source: string; target: string; line: number }> = [];
  if (CHECK_LINKS) {
    console.log(`\nChecking ${allFiles.length} files for broken links...`);
    broken = checkLinks(allFiles);
  }

  const md = generateMarkdown(allFiles, broken);
  const outPath = join(ECOSYSTEM_ROOT, "gtcx-operations", "workstream", `docs-freshness-${new Date().toISOString().split("T")[0]}.md`);
  writeFileSync(outPath, md);

  console.log(`\nTotal files: ${allFiles.length}`);
  console.log(`Stale files: ${allFiles.filter(f => f.daysStale > STALE_DAYS).length}`);
  console.log(`Broken links: ${broken.length}`);
  console.log(`Report: ${outPath}`);
}

main();
