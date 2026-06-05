#!/usr/bin/env tsx
/**
 * Ecosystem Impact Analyzer
 *
 * Predicts cross-repo breakage from package changes.
 * Reads dependency graph, traces downstream impact.
 *
 * Run: `pnpm analyze:impact <repo> [package]`
 */
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
const ECOSYSTEM_ROOT = process.env.ECOSYSTEM_ROOT || join(process.env.HOME || "", "Sites", "gtcx-ecosystem");
function loadEcosystemGraph() {
    const graphPath = join(ECOSYSTEM_ROOT, "gtcx-agile", "src", "ecosystem-graph.ts");
    if (!existsSync(graphPath)) {
        // Fallback: infer from package.json dependencies
        return inferEdgesFromPackageJson();
    }
    try {
        const content = readFileSync(graphPath, "utf-8");
        const edges = [];
        // Parse GTCX_EDGES array
        const edgesMatch = content.match(/GTCX_EDGES\s*=\s*\[([\s\S]*?)\];/);
        if (edgesMatch) {
            const edgesBlock = edgesMatch[1];
            const edgeMatches = edgesBlock.matchAll(/\{\s*source:\s*['"](.+?)['"]\s*,\s*target:\s*['"](.+?)['"]\s*,\s*type:\s*['"](.+?)['"]\s*\}/g);
            for (const m of edgeMatches) {
                edges.push({ from: m[1], to: m[2], type: m[3] });
            }
        }
        return edges;
    }
    catch {
        return inferEdgesFromPackageJson();
    }
}
function inferEdgesFromPackageJson() {
    const edges = [];
    const repos = [
        "baseline-os", "gtcx-core", "gtcx-protocols", "gtcx-infrastructure",
        "gtcx-agentic", "gtcx-mobile", "gtcx-intelligence", "terminal-os",
        "ledger-ui", "compliance-os", "exploration-os", "griot-ai",
        "sensei-ai", "terra-os", "veritas-ai", "nyota-ai",
        "gtcx-operations", "gtcx-docs", "gtcx-agile", "gtcx-markets",
        "gtcx-platforms", "gtcx-hardware"
    ];
    for (const repo of repos) {
        const pkgPath = join(ECOSYSTEM_ROOT, repo, "package.json");
        if (!existsSync(pkgPath))
            continue;
        try {
            const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
            const deps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
            for (const [dep] of Object.entries(deps)) {
                if (dep.startsWith("@baselineos/")) {
                    const targetRepo = dep.replace("@baselineos/", "");
                    if (repos.includes(targetRepo)) {
                        edges.push({ from: targetRepo, to: repo, type: "runtime" });
                    }
                }
            }
        }
        catch { /* skip */ }
    }
    return edges;
}
function analyzeImpact(changedRepo, changedPackage) {
    const edges = loadEcosystemGraph();
    const directlyAffected = new Set();
    const transitivelyAffected = new Set();
    // Direct consumers
    for (const edge of edges) {
        if (edge.from === changedRepo) {
            directlyAffected.add(edge.to);
        }
    }
    // Transitive consumers
    const queue = [...directlyAffected];
    const visited = new Set();
    while (queue.length > 0) {
        const current = queue.shift();
        if (visited.has(current))
            continue;
        visited.add(current);
        for (const edge of edges) {
            if (edge.from === current) {
                if (!directlyAffected.has(edge.to)) {
                    transitivelyAffected.add(edge.to);
                }
                queue.push(edge.to);
            }
        }
    }
    const totalAffected = directlyAffected.size + transitivelyAffected.size;
    const breakingRisk = totalAffected > 10 ? "high" : totalAffected > 3 ? "medium" : "low";
    const recommendedTests = [];
    for (const repo of [...directlyAffected, ...transitivelyAffected]) {
        recommendedTests.push(`${repo}: pnpm test`);
    }
    return {
        changedRepo,
        changedPackage,
        directlyAffected: [...directlyAffected],
        transitivelyAffected: [...transitivelyAffected],
        breakingRisk,
        recommendedTests,
    };
}
function generateMarkdown(report) {
    let md = `# Ecosystem Impact Analysis\n\n`;
    md += `**Changed:** ${report.changedRepo}${report.changedPackage ? ` / ${report.changedPackage}` : ""}\n`;
    md += `**Risk:** ${report.breakingRisk.toUpperCase()}\n`;
    md += `**Directly affected:** ${report.directlyAffected.length}\n`;
    md += `**Transitively affected:** ${report.transitivelyAffected.length}\n\n`;
    if (report.directlyAffected.length > 0) {
        md += `## Directly Affected Repos\n\n`;
        for (const repo of report.directlyAffected) {
            md += `- ${repo}\n`;
        }
        md += `\n`;
    }
    if (report.transitivelyAffected.length > 0) {
        md += `## Transitively Affected Repos\n\n`;
        for (const repo of report.transitivelyAffected) {
            md += `- ${repo}\n`;
        }
        md += `\n`;
    }
    md += `## Recommended Test Sequence\n\n`;
    md += "```bash\n";
    for (const test of report.recommendedTests) {
        md += `${test}\n`;
    }
    md += "```\n\n";
    md += `## Pre-Change Checklist\n\n`;
    md += `- [ ] Run tests in ${report.changedRepo}\n`;
    for (const repo of report.directlyAffected) {
        md += `- [ ] Run tests in ${repo}\n`;
    }
    md += `- [ ] Update CHANGELOG.md in ${report.changedRepo}\n`;
    md += `- [ ] Version bump (semver: ${report.breakingRisk === "high" ? "major" : report.breakingRisk === "medium" ? "minor" : "patch"})\n`;
    return md;
}
function main() {
    const changedRepo = process.argv[2];
    const changedPackage = process.argv[3];
    if (!changedRepo) {
        console.error("Usage: pnpm analyze:impact <repo> [package]");
        console.error("Example: pnpm analyze:impact baseline-os @baselineos/lang");
        process.exit(1);
    }
    console.log(`Analyzing impact of changing ${changedRepo}${changedPackage ? ` / ${changedPackage}` : ""}...`);
    const report = analyzeImpact(changedRepo, changedPackage);
    console.log(`\nDirectly affected: ${report.directlyAffected.length}`);
    console.log(`Transitively affected: ${report.transitivelyAffected.length}`);
    console.log(`Breaking risk: ${report.breakingRisk.toUpperCase()}`);
    const md = generateMarkdown(report);
    const outPath = join(ECOSYSTEM_ROOT, "gtcx-operations", "workstream", `impact-${changedRepo}-${new Date().toISOString().split("T")[0]}.md`);
    writeFileSync(outPath, md);
    console.log(`\nReport: ${outPath}`);
}
main();
//# sourceMappingURL=ecosystem-impact-analyzer.js.map