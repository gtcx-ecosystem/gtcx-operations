#!/usr/bin/env tsx
/**
 * Bundle Size Monitor
 *
 * Tracks bundle size growth over time. Alerts on threshold breaches.
 *
 * Run: `pnpm monitor:bundles`
 */
import { execSync } from "child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
const ECOSYSTEM_ROOT = process.env.ECOSYSTEM_ROOT || join(process.env.HOME || "", "Sites", "gtcx-ecosystem");
const HISTORY_DIR = join(ECOSYSTEM_ROOT, "gtcx-operations", "workstream", "bundle-history");
const THRESHOLDS = {
    "baseline-os": 50 * 1024 * 1024,
    "gtcx-mobile": 30 * 1024 * 1024,
    "terminal-os": 40 * 1024 * 1024,
    "compliance-os": 35 * 1024 * 1024,
};
function ensureHistoryDir() {
    if (!existsSync(HISTORY_DIR))
        mkdirSync(HISTORY_DIR, { recursive: true });
}
function loadHistory(repo) {
    const path = join(HISTORY_DIR, `${repo}.jsonl`);
    if (!existsSync(path))
        return [];
    try {
        return readFileSync(path, "utf-8")
            .trim()
            .split("\n")
            .filter(Boolean)
            .map(line => JSON.parse(line));
    }
    catch {
        return [];
    }
}
function recordResult(result) {
    ensureHistoryDir();
    const path = join(HISTORY_DIR, `${result.repo}.jsonl`);
    writeFileSync(path, JSON.stringify(result) + "\n", { flag: "a" });
}
function measureBundle(repo) {
    const repoPath = join(ECOSYSTEM_ROOT, repo);
    const timestamp = new Date().toISOString();
    let size = 0;
    let files = 0;
    try {
        const output = execSync("find dist -type f 2>/dev/null | wc -l", { cwd: repoPath, encoding: "utf-8" });
        files = parseInt(output.trim()) || 0;
    }
    catch { /* ignore */ }
    try {
        const output = execSync("du -sb dist 2>/dev/null || echo 0", { cwd: repoPath, encoding: "utf-8" });
        size = parseInt(output.split("\n")[0]) || 0;
    }
    catch { /* ignore */ }
    return { timestamp, repo, size, files };
}
function generateMarkdown(records) {
    let md = `# Bundle Size Report\n\n`;
    md += `**Generated:** ${new Date().toISOString().split("T")[0]}\n\n`;
    md += `| Repo | Size | Files | Threshold | Status |\n`;
    md += `|------|------|-------|-----------|--------|\n`;
    for (const record of records) {
        const threshold = THRESHOLDS[record.repo] || Infinity;
        const overThreshold = record.size > threshold;
        const status = overThreshold ? "ALERT" : "OK";
        const sizeMb = (record.size / 1024 / 1024).toFixed(2);
        const thresholdMb = threshold === Infinity ? "-" : (threshold / 1024 / 1024).toFixed(2);
        md += `| ${record.repo} | ${sizeMb}MB | ${record.files} | ${thresholdMb}MB | ${status} |\n`;
        if (!overThreshold) {
            const history = loadHistory(record.repo);
            const previous = history[history.length - 1];
            if (previous && previous.size > 0) {
                const growth = ((record.size - previous.size) / previous.size) * 100;
                if (growth > 10) {
                    md += `|  | +${growth.toFixed(1)}% vs last | | | GROWTH |\n`;
                }
            }
        }
    }
    md += `\n`;
    return md;
}
function main() {
    const targetRepos = Object.keys(THRESHOLDS);
    console.log("Measuring bundle sizes...");
    const records = [];
    for (const repo of targetRepos) {
        process.stdout.write(`  ${repo}... `);
        const record = measureBundle(repo);
        recordResult(record);
        records.push(record);
        const threshold = THRESHOLDS[repo];
        const sizeMb = (record.size / 1024 / 1024).toFixed(2);
        const status = record.size > threshold ? "ALERT" : "OK";
        console.log(`${sizeMb}MB ${status}`);
    }
    const md = generateMarkdown(records);
    const outPath = join(ECOSYSTEM_ROOT, "gtcx-operations", "workstream", `bundle-sizes-${new Date().toISOString().split("T")[0]}.md`);
    writeFileSync(outPath, md);
    console.log(`\nReport: ${outPath}`);
}
main();
//# sourceMappingURL=bundle-size-monitor.js.map