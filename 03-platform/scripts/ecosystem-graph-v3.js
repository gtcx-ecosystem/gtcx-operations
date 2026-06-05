#!/usr/bin/env tsx
/**
 * Ecosystem Dependency Graph v3
 *
 * Enhanced dependency graph with version constraints, freshness scoring, conflicts.
 *
 * Run: `pnpm graph:v3`
 */
import { existsSync, readFileSync, writeFileSync } from "fs";
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
// Known latest major versions for freshness scoring
const LATEST_MAJORS = {
    "typescript": 5, "next": 15, "react": 19, "eslint": 9, "prettier": 3,
    "vitest": 3, "zod": 3, "playwright": 1, "tailwindcss": 4, "pnpm": 9,
};
function parseVersion(v) {
    const clean = v.replace(/^[\^~>=<]/, "");
    const [major, minor, patch] = clean.split(".").map(Number);
    return { major: major || 0, minor: minor || 0, patch: patch || 0 };
}
function scoreFreshness(name, version) {
    const latestMajor = LATEST_MAJORS[name];
    if (latestMajor === undefined)
        return 100;
    const { major } = parseVersion(version);
    return major >= latestMajor ? 100 : Math.max(0, 100 - (latestMajor - major) * 25);
}
function analyzeRepo(repo) {
    const repoPath = join(ECOSYSTEM_ROOT, repo);
    const pkgPath = join(repoPath, "package.json");
    let node = {
        name: repo, version: "0.0.0", license: "unknown",
        packageManager: "unknown", dependencies: 0, devDependencies: 0, freshnessScore: 100,
    };
    const edges = [];
    if (!existsSync(pkgPath))
        return { node, edges };
    try {
        const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
        node.version = pkg.version || "0.0.0";
        node.license = pkg.license || "unknown";
        node.packageManager = existsSync(join(repoPath, "pnpm-lock.yaml")) ? "pnpm"
            : existsSync(join(repoPath, "package-lock.json")) ? "npm"
                : "unknown";
        const deps = pkg.dependencies || {};
        const devDeps = pkg.devDependencies || {};
        node.dependencies = Object.keys(deps).length;
        node.devDependencies = Object.keys(devDeps).length;
        const allDeps = { ...deps, ...devDeps };
        let totalFreshness = 0;
        let count = 0;
        for (const [name, version] of Object.entries(allDeps)) {
            const freshness = scoreFreshness(name, String(version));
            totalFreshness += freshness;
            count++;
            // Cross-repo edges for @baselineos/* packages
            if (name.startsWith("@baselineos/")) {
                const targetRepo = name.replace("@baselineos/", "");
                if (REPOS.includes(targetRepo)) {
                    edges.push({
                        source: repo,
                        target: targetRepo,
                        type: devDeps[name] ? "dev" : "runtime",
                        versionConstraint: String(version),
                        freshnessScore: freshness,
                    });
                }
            }
        }
        node.freshnessScore = count > 0 ? Math.round(totalFreshness / count) : 100;
    }
    catch { /* skip */ }
    return { node, edges };
}
function generateMarkdown(nodes, edges) {
    let md = `# Ecosystem Dependency Graph v3\n\n`;
    md += `**Generated:** ${new Date().toISOString().split("T")[0]}\n`;
    md += `**Repos:** ${nodes.length}\n`;
    md += `**Edges:** ${edges.length}\n\n`;
    // Nodes table
    md += `## Repositories\n\n`;
    md += `| Repo | Version | PM | Deps | DevDeps | Freshness |\n`;
    md += `|------|---------|-----|------|---------|-----------|\n`;
    for (const n of nodes.sort((a, b) => b.freshnessScore - a.freshnessScore)) {
        const icon = n.freshnessScore === 100 ? "✓" : n.freshnessScore >= 90 ? "~" : "!";
        md += `| ${n.name} | ${n.version} | ${n.packageManager} | ${n.dependencies} | ${n.devDependencies} | ${icon} ${n.freshnessScore}% |\n`;
    }
    md += `\n`;
    // Edges table
    if (edges.length > 0) {
        md += `## Cross-Repo Dependencies\n\n`;
        md += `| Source | Target | Type | Constraint | Freshness |\n`;
        md += `|--------|--------|------|------------|-----------|\n`;
        for (const e of edges) {
            md += `| ${e.source} | ${e.target} | ${e.type} | ${e.versionConstraint} | ${e.freshnessScore}% |\n`;
        }
        md += `\n`;
    }
    // Version conflicts
    const conflicts = [];
    const byPackage = {};
    for (const n of nodes) {
        const pkgPath = join(ECOSYSTEM_ROOT, n.name, "package.json");
        if (!existsSync(pkgPath))
            continue;
        try {
            const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
            for (const [dep, version] of Object.entries({ ...pkg.dependencies, ...pkg.devDependencies })) {
                if (!byPackage[dep])
                    byPackage[dep] = [];
                byPackage[dep].push({ repo: n.name, version: String(version) });
            }
        }
        catch { /* skip */ }
    }
    for (const [pkg, usages] of Object.entries(byPackage)) {
        const versions = [...new Set(usages.map(u => u.version))];
        if (versions.length > 1) {
            conflicts.push({ package: pkg, versions, repos: usages.map(u => u.repo) });
        }
    }
    if (conflicts.length > 0) {
        md += `## Version Conflicts (${conflicts.length})\n\n`;
        md += `| Package | Versions | Repos |\n`;
        md += `|---------|----------|-------|\n`;
        for (const c of conflicts.slice(0, 30)) {
            md += `| ${c.package} | ${c.versions.join(", ")} | ${c.repos.length} repos |\n`;
        }
        if (conflicts.length > 30)
            md += `| ... | ... | ... |\n`;
        md += `\n`;
    }
    return md;
}
function main() {
    console.log("Building ecosystem dependency graph v3...");
    const nodes = [];
    const allEdges = [];
    for (const repo of REPOS) {
        process.stdout.write(`  ${repo}... `);
        const { node, edges } = analyzeRepo(repo);
        nodes.push(node);
        allEdges.push(...edges);
        console.log(`${node.freshnessScore}% fresh, ${edges.length} edges`);
    }
    const md = generateMarkdown(nodes, allEdges);
    const outPath = join(ECOSYSTEM_ROOT, "gtcx-operations", "workstream", `ecosystem-graph-v3-${new Date().toISOString().split("T")[0]}.md`);
    writeFileSync(outPath, md);
    console.log(`\nGraph: ${outPath}`);
    console.log(`Nodes: ${nodes.length} | Edges: ${allEdges.length}`);
}
main();
//# sourceMappingURL=ecosystem-graph-v3.js.map