#!/usr/bin/env tsx
/**
 * Documentation Freshness CI Gate
 *
 * Runs in CI to fail builds if documentation is critically stale.
 *
 * Run: `pnpm gate:docs [--max-stale=90]`
 */
import { execSync } from "child_process";
import { join } from "path";
const ECOSYSTEM_ROOT = process.env.ECOSYSTEM_ROOT || join(process.env.HOME || "", "Sites", "gtcx-ecosystem");
const MAX_STALE_DAYS = parseInt(process.argv.find(a => a.startsWith("--max-stale="))?.replace("--max-stale=", "") || "90");
const REPOS = [
    "baseline-os", "gtcx-core", "gtcx-protocols", "gtcx-infrastructure",
    "gtcx-agentic", "gtcx-mobile", "gtcx-intelligence", "terminal-os",
    "ledger-ui", "compliance-os", "exploration-os", "griot-ai",
    "sensei-ai", "terra-os", "veritas-ai", "nyota-ai",
    "gtcx-operations", "gtcx-docs", "gtcx-agile", "gtcx-markets",
    "gtcx-platforms", "gtcx-hardware"
];
function scanRepo(repo) {
    const repoPath = join(ECOSYSTEM_ROOT, repo);
    const stale = [];
    try {
        // Batch: get all file mtimes in one command
        const output = execSync(`git ls-files -- '*.md' | head -100 | while read f; do echo "$(git log -1 --format=%aI -- \\"$f\\" 2>/dev/null)|$f"; done`, { cwd: repoPath, encoding: "utf-8", shell: "/bin/bash" });
        for (const line of output.trim().split("\n").filter(Boolean)) {
            const [dateStr, ...fileParts] = line.split("|");
            const file = fileParts.join("|");
            if (dateStr && file) {
                const daysStale = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
                if (daysStale > MAX_STALE_DAYS) {
                    stale.push({ repo, file, daysStale });
                }
            }
        }
    }
    catch { /* ignore */ }
    return stale;
}
function main() {
    console.log(`Scanning for docs stale >${MAX_STALE_DAYS} days across 22 repos...`);
    let allStale = [];
    for (const repo of REPOS) {
        process.stdout.write(`  ${repo}... `);
        const stale = scanRepo(repo);
        allStale.push(...stale);
        console.log(`${stale.length} stale`);
    }
    const critical = allStale.filter(s => s.daysStale > 365);
    console.log(`\nTotal stale docs: ${allStale.length}`);
    console.log(`Critical (>1 year): ${critical.length}`);
    if (critical.length > 0) {
        console.error("\nCRITICAL: Documentation is critically stale. Failing gate.");
        for (const s of critical.slice(0, 10)) {
            console.error(`  ${s.repo}: ${s.file} (${s.daysStale} days)`);
        }
        process.exit(1);
    }
    if (allStale.length > 100) {
        console.warn("\nWARNING: More than 100 stale docs. Consider a docs sprint.");
    }
    console.log("\nGate passed. Documentation freshness acceptable.");
}
main();
//# sourceMappingURL=docs-freshness-ci-gate.js.map