#!/usr/bin/env tsx
/**
 * Dependency Freshness Scorer
 *
 * Scans package.json across repos and scores dependency freshness.
 * Run: `pnpm score:dependencies`
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
const ECOSYSTEM_ROOT = process.env.ECOSYSTEM_ROOT || join(process.env.HOME || "", "Sites", "gtcx-ecosystem");
// Known latest major versions (updated periodically)
const LATEST_MAJORS = {
    "typescript": 5,
    "next": 15,
    "react": 19,
    "react-dom": 19,
    "vue": 3,
    "vite": 6,
    "vitest": 3,
    "eslint": 9,
    "prettier": 3,
    "tailwindcss": 4,
    "zod": 3,
    "axios": 1,
    "express": 4,
    "fastify": 5,
    "prisma": 6,
    "drizzle-orm": 0,
    "trpc": 11,
    "playwright": 1,
    "cypress": 14,
    "jest": 29,
    "mocha": 10,
    "node": 22,
    "pnpm": 9,
};
const REPOS = [
    "baseline-os", "gtcx-core", "gtcx-protocols", "gtcx-infrastructure",
    "gtcx-agentic", "gtcx-mobile", "gtcx-intelligence", "terminal-os",
    "ledger-ui", "compliance-os", "exploration-os", "griot-ai",
    "sensei-ai", "terra-os", "veritas-ai", "nyota-ai",
    "gtcx-operations", "gtcx-docs", "gtcx-agile", "gtcx-markets",
    "gtcx-platforms", "gtcx-hardware"
];
function parseVersion(v) {
    const clean = v.replace(/^[\^~>=<]/, "");
    const [major, minor, patch] = clean.split(".").map(Number);
    return { major: major || 0, minor: minor || 0, patch: patch || 0 };
}
function getRepoDeps(repo) {
    const deps = {};
    const pkgPath = join(ECOSYSTEM_ROOT, repo, "package.json");
    try {
        const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
        for (const [name, version] of Object.entries(pkg.dependencies || {})) {
            deps[name] = { repo, version: String(version), dev: false };
        }
        for (const [name, version] of Object.entries(pkg.devDependencies || {})) {
            deps[name] = { repo, version: String(version), dev: true };
        }
    }
    catch { /* no package.json */ }
    return deps;
}
function analyze() {
    const allDeps = {};
    const repoScores = [];
    for (const repo of REPOS) {
        const deps = getRepoDeps(repo);
        let outdated = 0;
        let total = 0;
        const mismatches = [];
        for (const [name, info] of Object.entries(deps)) {
            total++;
            if (!allDeps[name])
                allDeps[name] = [];
            allDeps[name].push(info);
            const latestMajor = LATEST_MAJORS[name];
            if (latestMajor !== undefined) {
                const { major } = parseVersion(info.version);
                if (major < latestMajor) {
                    outdated++;
                    mismatches.push(`${name}@${info.version} (latest: ${latestMajor}.x)`);
                }
            }
        }
        const freshnessScore = total > 0 ? Math.round(((total - outdated) / total) * 100) : 100;
        repoScores.push({ repo, totalDeps: total, outdatedDeps: outdated, freshnessScore, mismatches });
    }
    const duplicates = Object.entries(allDeps)
        .filter(([, infos]) => {
        const versions = new Set(infos.map(i => parseVersion(i.version).major));
        return versions.size > 1;
    })
        .map(([name, infos]) => {
        const versions = [...new Set(infos.map(i => i.version))].sort();
        return `${name}: ${versions.join(", ")}`;
    });
    return { repos: repoScores, globalDeps: allDeps, duplicates };
}
function generateMarkdown(repos, duplicates) {
    let md = `# Dependency Freshness Report\n\n`;
    md += `**Generated:** ${new Date().toISOString().split("T")[0]}\n`;
    md += `**Repos:** ${REPOS.length}\n\n`;
    const avgScore = Math.round(repos.reduce((a, r) => a + r.freshnessScore, 0) / repos.length);
    md += `## Summary\n\n`;
    md += `| Metric | Value |\n`;
    md += `|--------|-------|\n`;
    md += `| Average freshness | ${avgScore}% |\n`;
    md += `| Repos with 100% | ${repos.filter(r => r.freshnessScore === 100).length} |\n`;
    md += `| Repos below 90% | ${repos.filter(r => r.freshnessScore < 90).length} |\n`;
    md += `| Version conflicts | ${duplicates.length} |\n\n`;
    md += `## Per-Repo Scores\n\n`;
    md += `| Repo | Deps | Outdated | Score |\n`;
    md += `|------|------|----------|-------|\n`;
    for (const r of repos.sort((a, b) => b.freshnessScore - a.freshnessScore)) {
        const icon = r.freshnessScore === 100 ? "🟢" : r.freshnessScore >= 90 ? "🟡" : "🔴";
        md += `| ${icon} ${r.repo} | ${r.totalDeps} | ${r.outdatedDeps} | ${r.freshnessScore}% |\n`;
    }
    md += `\n`;
    const problematic = repos.filter(r => r.mismatches.length > 0);
    if (problematic.length) {
        md += `## Outdated Dependencies\n\n`;
        for (const r of problematic) {
            md += `### ${r.repo}\n\n`;
            for (const m of r.mismatches) {
                md += `- ${m}\n`;
            }
            md += `\n`;
        }
    }
    if (duplicates.length) {
        md += `## Version Conflicts Across Repos\n\n`;
        for (const d of duplicates.slice(0, 30)) {
            md += `- ${d}\n`;
        }
        if (duplicates.length > 30) {
            md += `- ... and ${duplicates.length - 30} more\n`;
        }
        md += `\n`;
    }
    return md;
}
function main() {
    console.log("Scanning dependencies across 22 repos...");
    const { repos, duplicates } = analyze();
    const md = generateMarkdown(repos, duplicates);
    const outPath = join(ECOSYSTEM_ROOT, "gtcx-operations", "workstream", `dependency-freshness-${new Date().toISOString().split("T")[0]}.md`);
    writeFileSync(outPath, md);
    const avgScore = Math.round(repos.reduce((a, r) => a + r.freshnessScore, 0) / repos.length);
    console.log(`Average freshness: ${avgScore}%`);
    console.log(`Version conflicts: ${duplicates.length}`);
    console.log(`Report: ${outPath}`);
}
main();
//# sourceMappingURL=dependency-freshness-scorer.js.map