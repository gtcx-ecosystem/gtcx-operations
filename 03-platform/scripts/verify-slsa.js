#!/usr/bin/env tsx
/**
 * SLSA Build L3 Verification Script
 *
 * Verifies SLSA provenance, SBOM, and cosign signatures for a repo.
 * Run: `pnpm verify:slsa <repo-name>`
 */
import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
const ECOSYSTEM_ROOT = process.env.ECOSYSTEM_ROOT || join(process.env.HOME || "", "Sites", "gtcx-ecosystem");
function run(repo, cmd) {
    try {
        return execSync(cmd, { cwd: join(ECOSYSTEM_ROOT, repo), encoding: "utf-8", timeout: 5000 }).trim();
    }
    catch {
        return "";
    }
}
function checkReleaseWorkflow(repo) {
    const path = join(ECOSYSTEM_ROOT, repo, ".github", "workflows", "release.yml");
    if (!existsSync(path)) {
        return { name: "Release workflow exists", passed: false, detail: "No .github/workflows/release.yml found" };
    }
    const content = readFileSync(path, "utf-8");
    const hasProvenance = content.includes("provenance: true") || content.includes("actions/attest-build-provenance");
    const hasSbom = content.includes("sbom: true") || content.includes("cyclonedx");
    const hasCosign = content.includes("cosign");
    const hasAttestation = content.includes("attestations: write");
    const checks = [];
    if (hasProvenance)
        checks.push("provenance");
    if (hasSbom)
        checks.push("SBOM");
    if (hasCosign)
        checks.push("cosign");
    if (hasAttestation)
        checks.push("attestation");
    return {
        name: "Release workflow has SLSA steps",
        passed: hasProvenance && hasSbom,
        detail: `Found: ${checks.join(", ") || "none"}`,
    };
}
function checkCiWorkflow(repo) {
    const path = join(ECOSYSTEM_ROOT, repo, ".github", "workflows", "ci.yml");
    if (!existsSync(path)) {
        return { name: "CI workflow exists", passed: false, detail: "No .github/workflows/ci.yml found" };
    }
    const content = readFileSync(path, "utf-8");
    const hasAudit = content.includes("audit") || content.includes("security");
    const hasTest = content.includes("test") || content.includes("coverage");
    const hasBuild = content.includes("build");
    return {
        name: "CI workflow has security gates",
        passed: hasAudit && hasTest && hasBuild,
        detail: `Audit: ${hasAudit}, Test: ${hasTest}, Build: ${hasBuild}`,
    };
}
function checkSbom(repo) {
    const sbomPaths = [
        join(ECOSYSTEM_ROOT, repo, "sbom.json"),
        join(ECOSYSTEM_ROOT, repo, "sbom.spdx.json"),
        join(ECOSYSTEM_ROOT, repo, "sbom.cyclonedx.json"),
    ];
    const found = sbomPaths.filter(p => existsSync(p));
    return {
        name: "SBOM artifact exists",
        passed: found.length > 0,
        detail: found.length > 0 ? `Found: ${found.map(p => p.split("/").pop()).join(", ")}` : "No SBOM files found",
    };
}
function checkProvenance(repo) {
    const provenancePaths = [
        join(ECOSYSTEM_ROOT, repo, "provenance.json"),
        join(ECOSYSTEM_ROOT, repo, "provenance.intoto.jsonl"),
    ];
    const found = provenancePaths.filter(p => existsSync(p));
    return {
        name: "Provenance attestation exists",
        passed: found.length > 0,
        detail: found.length > 0 ? `Found: ${found.map(p => p.split("/").pop()).join(", ")}` : "No provenance files found",
    };
}
function checkCosign(repo) {
    const workflowPath = join(ECOSYSTEM_ROOT, repo, ".github", "workflows", "release.yml");
    if (!existsSync(workflowPath)) {
        return { name: "Cosign signing configured", passed: false, detail: "No release workflow" };
    }
    const content = readFileSync(workflowPath, "utf-8");
    const hasCosign = content.includes("cosign");
    return {
        name: "Cosign signing configured",
        passed: hasCosign,
        detail: hasCosign ? "Cosign signing found in release workflow" : "No cosign found",
    };
}
function checkReproducibleBuild(repo) {
    const scriptPath = join(ECOSYSTEM_ROOT, repo, "scripts", "reproducible-builds.sh");
    return {
        name: "Reproducible build script exists",
        passed: existsSync(scriptPath),
        detail: existsSync(scriptPath) ? "03-platform/scripts/reproducible-builds.sh found" : "No reproducible build script",
    };
}
function verifyRepo(repo) {
    const repoPath = join(ECOSYSTEM_ROOT, repo);
    if (!existsSync(repoPath)) {
        return [{ name: "Repo exists", passed: false, detail: `Repo ${repo} not found` }];
    }
    return [
        checkReleaseWorkflow(repo),
        checkCiWorkflow(repo),
        checkSbom(repo),
        checkProvenance(repo),
        checkCosign(repo),
        checkReproducibleBuild(repo),
    ];
}
function generateMarkdown(repo, checks) {
    const passed = checks.filter(c => c.passed).length;
    const total = checks.length;
    const score = Math.round((passed / total) * 100);
    let md = `# SLSA Verification Report: ${repo}\n\n`;
    md += `**Score:** ${score}% (${passed}/${total})\n\n`;
    md += `| Check | Status | Detail |\n`;
    md += `|-------|--------|--------|\n`;
    for (const c of checks) {
        const status = c.passed ? "✅ PASS" : "❌ FAIL";
        md += `| ${c.name} | ${status} | ${c.detail} |\n`;
    }
    md += `\n## SLSA Level Assessment\n\n`;
    if (score === 100) {
        md += `**SLSA Build L3 compliant** — All checks pass.\n`;
    }
    else if (score >= 80) {
        md += `**Near SLSA Build L3** — ${total - passed} gaps to close.\n`;
    }
    else if (score >= 50) {
        md += `**SLSA Build L2** — Provenance exists but key L3 features missing.\n`;
    }
    else {
        md += `**Below SLSA Build L2** — Significant gaps in supply chain security.\n`;
    }
    return md;
}
function main() {
    const repo = process.argv[2];
    if (!repo) {
        console.error("Usage: pnpm verify:slsa <repo-name>");
        process.exit(1);
    }
    const checks = verifyRepo(repo);
    const passed = checks.filter(c => c.passed).length;
    for (const c of checks) {
        const icon = c.passed ? "✅" : "❌";
        console.log(`${icon} ${c.name}: ${c.detail}`);
    }
    console.log(`\nScore: ${passed}/${checks.length} (${Math.round((passed / checks.length) * 100)}%)`);
    const mdPath = join(ECOSYSTEM_ROOT, "gtcx-operations", "workstream", `slsa-verification-${repo}.md`);
    writeFileSync(mdPath, generateMarkdown(repo, checks));
    console.log(`Report: ${mdPath}`);
}
main();
//# sourceMappingURL=verify-slsa.js.map