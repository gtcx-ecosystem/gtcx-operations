#!/usr/bin/env tsx
/**
 * Ecosystem Health Dashboard v2 — Trends & Alerts
 *
 * Extends ecosystem-health.ts with trend analysis and actionable alerts.
 * Run: `pnpm ecosystem:health:v2`
 */
import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
const ECOSYSTEM_ROOT = process.env.ECOSYSTEM_ROOT || join(process.env.HOME || "", "Sites", "gtcx-ecosystem");
const REPORTS_DIR = join(ECOSYSTEM_ROOT, "gtcx-operations", "workstream", "health-history");
const REPOS = [
    "baseline-os", "gtcx-core", "gtcx-protocols", "gtcx-infrastructure",
    "gtcx-agentic", "gtcx-mobile", "gtcx-intelligence", "terminal-os",
    "ledger-ui", "compliance-os", "exploration-os", "griot-ai",
    "sensei-ai", "terra-os", "veritas-ai", "nyota-ai",
    "gtcx-operations", "gtcx-docs", "gtcx-agile", "gtcx-markets",
    "gtcx-platforms", "gtcx-hardware",
];
function run(repo, cmd) {
    try {
        return execSync(cmd, { cwd: join(ECOSYSTEM_ROOT, repo), encoding: "utf-8", timeout: 5000 }).trim();
    }
    catch {
        return "";
    }
}
function countLines(output) {
    return output ? output.split("\n").filter(l => l.trim()).length : 0;
}
function loadPreviousReport() {
    const files = run("gtcx-operations", "ls -1 workstream/health-history/ 2>/dev/null | sort -r | head -1");
    if (!files)
        return null;
    const path = join(ECOSYSTEM_ROOT, "gtcx-operations", "workstream", "health-history", files.trim());
    if (!existsSync(path))
        return null;
    try {
        return JSON.parse(readFileSync(path, "utf-8")).repos;
    }
    catch {
        return null;
    }
}
function scanRepo(repo) {
    return {
        name: repo,
        commitsSinceMay1: countLines(run(repo, "git log --oneline --since='2026-05-01' --format='%h'")),
        dirtyFiles: countLines(run(repo, "git status --short")),
        hasRoadmap: existsSync(join(ECOSYSTEM_ROOT, repo, "docs", "roadmap", "ROADMAP-2026-07-13.md")),
        hasConventionsMd: existsSync(join(ECOSYSTEM_ROOT, repo, "CONVENTIONS.md")),
        unpushedCommits: countLines(run(repo, "git log --oneline @{u}..HEAD 2>/dev/null || true")),
    };
}
function generateAlerts(current) {
    const alerts = [];
    for (const r of current) {
        if (r.dirtyFiles > 400) {
            alerts.push({ severity: "critical", repo: r.name, message: `Extreme dirty file backlog (${r.dirtyFiles})`, metric: "dirtyFiles", value: r.dirtyFiles });
        }
        else if (r.dirtyFiles > 200) {
            alerts.push({ severity: "warning", repo: r.name, message: `Large dirty file backlog (${r.dirtyFiles})`, metric: "dirtyFiles", value: r.dirtyFiles });
        }
        if (r.unpushedCommits > 20) {
            alerts.push({ severity: "warning", repo: r.name, message: `${r.unpushedCommits} unpushed commits`, metric: "unpushedCommits", value: r.unpushedCommits });
        }
        if (!r.hasRoadmap) {
            alerts.push({ severity: "warning", repo: r.name, message: "Missing canonical roadmap", metric: "hasRoadmap", value: 0 });
        }
        if (!r.hasConventionsMd) {
            alerts.push({ severity: "info", repo: r.name, message: "Missing CONVENTIONS.md", metric: "hasConventionsMd", value: 0 });
        }
    }
    return alerts;
}
function generateTrends(current, previous) {
    if (!previous)
        return [];
    const trends = [];
    for (const c of current) {
        const p = previous.find(r => r.name === c.name);
        if (!p)
            continue;
        if (c.dirtyFiles !== p.dirtyFiles) {
            const delta = c.dirtyFiles - p.dirtyFiles;
            trends.push({ repo: c.name, metric: "dirtyFiles", direction: delta > 0 ? "up" : "down", delta: Math.abs(delta) });
        }
        if (c.unpushedCommits !== p.unpushedCommits) {
            const delta = c.unpushedCommits - p.unpushedCommits;
            trends.push({ repo: c.name, metric: "unpushedCommits", direction: delta > 0 ? "up" : "down", delta: Math.abs(delta) });
        }
    }
    return trends;
}
function generateMarkdown(report) {
    let md = `# Ecosystem Health Dashboard v2 — Trends & Alerts\n\n`;
    md += `**Generated:** ${report.generatedAt}\n\n`;
    const critical = report.alerts.filter(a => a.severity === "critical");
    const warnings = report.alerts.filter(a => a.severity === "warning");
    md += `## Summary\n\n`;
    md += `| Metric | Value |\n`;
    md += `|--------|-------|\n`;
    md += `| Critical alerts | ${critical.length} |\n`;
    md += `| Warnings | ${warnings.length} |\n`;
    md += `| Trend changes | ${report.trends.length} |\n\n`;
    if (critical.length > 0) {
        md += `## 🚨 Critical Alerts\n\n`;
        for (const a of critical) {
            md += `- **${a.repo}**: ${a.message}\n`;
        }
        md += `\n`;
    }
    if (warnings.length > 0) {
        md += `## ⚠️ Warnings\n\n`;
        for (const a of warnings) {
            md += `- **${a.repo}**: ${a.message}\n`;
        }
        md += `\n`;
    }
    if (report.trends.length > 0) {
        md += `## 📈 Trends (vs previous run)\n\n`;
        md += `| Repo | Metric | Direction | Delta |\n`;
        md += `|------|--------|-----------|-------|\n`;
        for (const t of report.trends.slice(0, 15)) {
            const arrow = t.direction === "up" ? "↑" : "↓";
            md += `| ${t.repo} | ${t.metric} | ${arrow} ${t.direction} | ${t.delta} |\n`;
        }
        md += `\n`;
    }
    md += `## Repo Snapshots\n\n`;
    md += `| Repo | Commits | Dirty | Roadmap | CONVENTIONS | Unpushed |\n`;
    md += `|------|---------|-------|---------|-------------|----------|\n`;
    for (const r of report.repos) {
        md += `| ${r.name} | ${r.commitsSinceMay1} | ${r.dirtyFiles} | ${r.hasRoadmap ? "✅" : "❌"} | ${r.hasConventionsMd ? "✅" : "❌"} | ${r.unpushedCommits} |\n`;
    }
    return md;
}
function main() {
    console.log("Scanning 22 repos for health v2...\n");
    const repos = REPOS.map(scanRepo);
    const previous = loadPreviousReport();
    const alerts = generateAlerts(repos);
    const trends = generateTrends(repos, previous);
    const report = { generatedAt: new Date().toISOString(), repos, alerts, trends };
    const dateStr = new Date().toISOString().split("T")[0];
    const jsonPath = join(REPORTS_DIR, `health-${dateStr}.json`);
    const mdPath = join(ECOSYSTEM_ROOT, "gtcx-operations", "workstream", "ecosystem-health-v2.md");
    writeFileSync(jsonPath, JSON.stringify(report, null, 2));
    writeFileSync(mdPath, generateMarkdown(report));
    console.log(`Critical: ${alerts.filter(a => a.severity === "critical").length}`);
    console.log(`Warnings: ${alerts.filter(a => a.severity === "warning").length}`);
    console.log(`Trends: ${trends.length}`);
    console.log(`\nReports written:`);
    console.log(`  JSON: ${jsonPath}`);
    console.log(`  MD:   ${mdPath}`);
}
main();
//# sourceMappingURL=ecosystem-health-v2.js.map