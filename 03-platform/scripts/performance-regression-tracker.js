#!/usr/bin/env tsx
/**
 * Performance Regression Tracker
 *
 * Tracks build times, test times, and layer sweep latency over time.
 * Alerts on regression. Generates trend reports.
 *
 * Run: `pnpm track:performance`
 */
import { execSync } from "child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
const ECOSYSTEM_ROOT = process.env.ECOSYSTEM_ROOT || join(process.env.HOME || "", "Sites", "gtcx-ecosystem");
const HISTORY_DIR = join(ECOSYSTEM_ROOT, "gtcx-operations", "workstream", "performance-history");
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
function benchmarkRepo(repo) {
    const repoPath = join(ECOSYSTEM_ROOT, repo);
    const timestamp = new Date().toISOString();
    let buildTime = 0;
    let testTime = 0;
    let layerSweepTime = 0;
    let bundleSize = 0;
    // Build time
    try {
        const start = Date.now();
        execSync("pnpm build", { cwd: repoPath, stdio: "ignore", timeout: 300000 });
        buildTime = Date.now() - start;
    }
    catch { /* skip */ }
    // Test time
    try {
        const start = Date.now();
        execSync("pnpm test", { cwd: repoPath, stdio: "ignore", timeout: 300000 });
        testTime = Date.now() - start;
    }
    catch { /* skip */ }
    // Layer sweep time (baseline-os only)
    if (repo === "baseline-os") {
        try {
            const start = Date.now();
            execSync("node 03-platform/packages/baselineos/dist/cli/bin.js status", { cwd: repoPath, stdio: "ignore", timeout: 60000 });
            layerSweepTime = Date.now() - start;
        }
        catch { /* skip */ }
    }
    // Bundle size (check dist/ if exists)
    try {
        const output = execSync("du -sb dist/ node_modules/.pnpm 2>/dev/null || du -sb dist/ 2>/dev/null || echo 0", {
            cwd: repoPath,
            encoding: "utf-8",
        });
        bundleSize = parseInt(output.split("\n")[0]) || 0;
    }
    catch { /* skip */ }
    return { timestamp, repo, buildTime, testTime, layerSweepTime, bundleSize };
}
function analyzeTrend(current, history) {
    const previous = history[history.length - 1];
    if (!previous)
        return [];
    const trends = [];
    const metrics = [
        { key: "buildTime", label: "Build time", threshold: 10 },
        { key: "testTime", label: "Test time", threshold: 10 },
        { key: "layerSweepTime", label: "Layer sweep", threshold: 20 },
        { key: "bundleSize", label: "Bundle size", threshold: 5 },
    ];
    for (const { key, label, threshold } of metrics) {
        const cur = current[key];
        const prev = previous[key];
        if (prev === 0)
            continue;
        const delta = cur - prev;
        const deltaPercent = Math.round((delta / prev) * 100);
        let status = "stable";
        if (deltaPercent > threshold)
            status = "regressed";
        else if (deltaPercent < -threshold)
            status = "improved";
        trends.push({ metric: label, current: cur, previous: prev, delta, deltaPercent, status });
    }
    return trends;
}
function generateMarkdown(results) {
    let md = `# Performance Regression Report\n\n`;
    md += `**Generated:** ${new Date().toISOString().split("T")[0]}\n\n`;
    const regressions = results.flatMap(r => r.trends.filter(t => t.status === "regressed"));
    const improvements = results.flatMap(r => r.trends.filter(t => t.status === "improved"));
    md += `## Summary\n\n`;
    md += `| Metric | Value |\n`;
    md += `|--------|-------|\n`;
    md += `| Repos benchmarked | ${results.length} |\n`;
    md += `| Regressions | ${regressions.length} |\n`;
    md += `| Improvements | ${improvements.length} |\n\n`;
    if (regressions.length > 0) {
        md += `## Regressions\n\n`;
        md += `| Repo | Metric | Before | After | Delta |\n`;
        md += `|------|--------|--------|-------|-------|\n`;
        for (const r of regressions) {
            const repoResult = results.find(x => x.trends.includes(r));
            md += `| ${repoResult?.repo} | ${r.metric} | ${r.previous}ms | ${r.current}ms | +${r.deltaPercent}% |\n`;
        }
        md += `\n`;
    }
    if (improvements.length > 0) {
        md += `## Improvements\n\n`;
        md += `| Repo | Metric | Before | After | Delta |\n`;
        md += `|------|--------|--------|-------|-------|\n`;
        for (const r of improvements) {
            const repoResult = results.find(x => x.trends.includes(r));
            md += `| ${repoResult?.repo} | ${r.metric} | ${r.previous}ms | ${r.current}ms | ${r.deltaPercent}% |\n`;
        }
        md += `\n`;
    }
    md += `## Per-Repo Details\n\n`;
    for (const { repo, result } of results) {
        md += `### ${repo}\n\n`;
        md += `| Metric | Value |\n`;
        md += `|--------|-------|\n`;
        if (result.buildTime > 0)
            md += `| Build | ${result.buildTime}ms |\n`;
        if (result.testTime > 0)
            md += `| Test | ${result.testTime}ms |\n`;
        if (result.layerSweepTime > 0)
            md += `| Layer sweep | ${result.layerSweepTime}ms |\n`;
        if (result.bundleSize > 0)
            md += `| Bundle size | ${(result.bundleSize / 1024 / 1024).toFixed(2)}MB |\n`;
        md += `\n`;
    }
    return md;
}
function main() {
    const targetRepos = ["baseline-os", "gtcx-core", "gtcx-mobile", "compliance-os", "terminal-os"];
    console.log("Benchmarking performance across repos...");
    const results = [];
    for (const repo of targetRepos) {
        process.stdout.write(`  ${repo}... `);
        const history = loadHistory(repo);
        const result = benchmarkRepo(repo);
        recordResult(result);
        const trends = analyzeTrend(result, history);
        results.push({ repo, result, trends });
        const regressed = trends.filter(t => t.status === "regressed").length;
        const improved = trends.filter(t => t.status === "improved").length;
        console.log(`${regressed > 0 ? `${regressed} regressed` : improved > 0 ? `${improved} improved` : "stable"}`);
    }
    const md = generateMarkdown(results);
    const outPath = join(ECOSYSTEM_ROOT, "gtcx-operations", "workstream", `performance-regression-${new Date().toISOString().split("T")[0]}.md`);
    writeFileSync(outPath, md);
    const totalRegressed = results.flatMap(r => r.trends).filter(t => t.status === "regressed").length;
    console.log(`\nTotal regressions: ${totalRegressed}`);
    console.log(`Report: ${outPath}`);
}
main();
//# sourceMappingURL=performance-regression-tracker.js.map