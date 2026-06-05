#!/usr/bin/env tsx
/**
 * Ecosystem Self-Healing Script
 *
 * Detects and auto-fixes common hygiene issues across repos.
 * Run: `pnpm ecosystem:self-heal` or `tsx 03-platform/scripts/ecosystem-self-heal.ts`
 */
import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync, appendFileSync } from "fs";
import { join } from "path";
const ECOSYSTEM_ROOT = process.env.ECOSYSTEM_ROOT || join(process.env.HOME || "", "Sites", "gtcx-ecosystem");
const REPOS = [
    "baseline-os", "gtcx-core", "gtcx-protocols", "gtcx-infrastructure",
    "gtcx-agentic", "gtcx-mobile", "gtcx-intelligence", "terminal-os",
    "ledger-ui", "compliance-os", "exploration-os", "griot-ai",
    "sensei-ai", "terra-os", "veritas-ai", "nyota-ai",
    "gtcx-operations", "gtcx-docs", "gtcx-agile", "gtcx-markets",
    "gtcx-platforms", "gtcx-hardware",
];
const GITIGNORE_ENTRIES = [
    "# OS",
    ".DS_Store",
    "Thumbs.db",
    "",
    "# Logs",
    "*.log",
    "logs/",
    "",
    "# Coverage",
    "coverage/",
    ".nyc_output/",
    "",
    "# Build",
    "dist/",
    "build/",
    ".turbo/",
    ".next/",
    "out/",
];
function run(repo, cmd) {
    try {
        return execSync(cmd, { cwd: join(ECOSYSTEM_ROOT, repo), encoding: "utf-8", timeout: 5000 }).trim();
    }
    catch {
        return "";
    }
}
function ensureGitignore(repo) {
    const fixes = [];
    const gitignorePath = join(ECOSYSTEM_ROOT, repo, ".gitignore");
    let content = "";
    if (existsSync(gitignorePath)) {
        content = readFileSync(gitignorePath, "utf-8");
    }
    const missing = [];
    for (const entry of GITIGNORE_ENTRIES) {
        if (!entry)
            continue;
        if (entry.startsWith("#"))
            continue;
        if (!content.includes(entry)) {
            missing.push(entry);
        }
    }
    if (missing.length > 0) {
        appendFileSync(gitignorePath, "\n# Auto-added by ecosystem-self-heal\n" + missing.join("\n") + "\n");
        fixes.push(`Added ${missing.length} entries to .gitignore`);
    }
    return fixes;
}
function ensureAgentInfra(repo) {
    const fixes = [];
    const agentDirs = [".agent", ".claude", ".kimi", ".baseline"];
    const present = agentDirs.filter(d => existsSync(join(ECOSYSTEM_ROOT, repo, d)));
    if (present.length < 2) {
        fixes.push(`WARNING: Only ${present.length}/4 agent infra dirs present (${present.join(", ")})`);
    }
    return fixes;
}
function ensureRoadmapIndex(repo) {
    const fixes = [];
    const readmePath = join(ECOSYSTEM_ROOT, repo, "docs", "roadmap", "README.md");
    if (!existsSync(readmePath)) {
        const roadmapDir = join(ECOSYSTEM_ROOT, repo, "docs", "roadmap");
        if (existsSync(roadmapDir)) {
            writeFileSync(readmePath, `# ${repo} — Roadmap Index\n\nLatest canonical roadmap: [ROADMAP-2026-07-13.md](./ROADMAP-2026-07-13.md)\n`);
            fixes.push("Created 01-docs/roadmap/README.md index");
        }
    }
    return fixes;
}
function healRepo(repo) {
    const fixes = [];
    const warnings = [];
    fixes.push(...ensureGitignore(repo));
    const agentWarnings = ensureAgentInfra(repo);
    warnings.push(...agentWarnings);
    fixes.push(...ensureRoadmapIndex(repo));
    const dirtyCount = run(repo, "git status --short | wc -l | tr -d ' '");
    if (parseInt(dirtyCount) > 400) {
        warnings.push(`Extreme dirty file backlog: ${dirtyCount}`);
    }
    if (!existsSync(join(ECOSYSTEM_ROOT, repo, "AGENTS.md"))) {
        warnings.push("Missing AGENTS.md");
    }
    if (!existsSync(join(ECOSYSTEM_ROOT, repo, "CONVENTIONS.md"))) {
        warnings.push("Missing CONVENTIONS.md");
    }
    return { repo, fixes, warnings };
}
function main() {
    console.log("Running ecosystem self-heal across 22 repos...\n");
    const results = [];
    for (const repo of REPOS) {
        const result = healRepo(repo);
        results.push(result);
        if (result.fixes.length > 0) {
            console.log(`${repo}: ${result.fixes.join(", ")}`);
        }
        if (result.warnings.length > 0) {
            console.log(`${repo} ⚠️: ${result.warnings.join(", ")}`);
        }
    }
    const totalFixes = results.reduce((s, r) => s + r.fixes.length, 0);
    const totalWarnings = results.reduce((s, r) => s + r.warnings.length, 0);
    console.log(`\nSelf-heal complete:`);
    console.log(`  Fixes applied: ${totalFixes}`);
    console.log(`  Warnings: ${totalWarnings}`);
    if (totalFixes > 0) {
        console.log(`\nReview changes with: cd <repo> && git diff`);
    }
}
main();
//# sourceMappingURL=ecosystem-self-heal.js.map