#!/usr/bin/env tsx
/**
 * Security Audit Scheduler
 *
 * Runs security audits across all repos and aggregates findings.
 * Run: `pnpm audit:security`
 */
import { execSync } from "child_process";
import { existsSync, writeFileSync } from "fs";
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
function auditRepo(repo) {
    const repoPath = join(ECOSYSTEM_ROOT, repo);
    const result = { repo, scanned: false, findings: [] };
    // Check for pnpm
    if (existsSync(join(repoPath, "pnpm-lock.yaml"))) {
        try {
            const output = execSync("pnpm audit --json", { cwd: repoPath, encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 });
            const data = JSON.parse(output);
            for (const adv of Object.values(data.advisories || {})) {
                const a = adv;
                result.findings.push({
                    repo,
                    severity: (a.severity || "low").toLowerCase(),
                    package: a.module_name || "unknown",
                    vulnerability: a.title || "Unknown",
                    version: a.findings?.[0]?.version || "unknown",
                    fixAvailable: !!a.patched_versions,
                });
            }
            result.scanned = true;
        }
        catch (e) {
            // pnpm audit exits non-zero when findings exist
            try {
                const stdoutStr = e.stdout ? e.stdout.toString() : "";
                const data = JSON.parse(stdoutStr || "{}");
                for (const adv of Object.values(data.advisories || {})) {
                    const a = adv;
                    result.findings.push({
                        repo,
                        severity: (a.severity || "low").toLowerCase(),
                        package: a.module_name || "unknown",
                        vulnerability: a.title || "Unknown",
                        version: a.findings?.[0]?.version || "unknown",
                        fixAvailable: !!a.patched_versions,
                    });
                }
                result.scanned = true;
            }
            catch {
                result.error = e.message || "Audit failed";
            }
        }
    }
    // Check for npm
    else if (existsSync(join(repoPath, "package-lock.json"))) {
        try {
            const output = execSync("npm audit --json", { cwd: repoPath, encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 });
            const data = JSON.parse(output);
            for (const [pkg, info] of Object.entries(data.vulnerabilities || {})) {
                const vuln = info;
                result.findings.push({
                    repo,
                    severity: (vuln.severity || "low").toLowerCase(),
                    package: pkg,
                    vulnerability: vuln.via?.[0]?.title || "Unknown",
                    version: vuln.range || "unknown",
                    fixAvailable: vuln.fixAvailable || false,
                });
            }
            result.scanned = true;
        }
        catch (e) {
            try {
                const stdoutStr = e.stdout ? e.stdout.toString() : "";
                const data = JSON.parse(stdoutStr || "{}");
                for (const [pkg, info] of Object.entries(data.vulnerabilities || {})) {
                    const vuln = info;
                    result.findings.push({
                        repo,
                        severity: (vuln.severity || "low").toLowerCase(),
                        package: pkg,
                        vulnerability: vuln.via?.[0]?.title || "Unknown",
                        version: vuln.range || "unknown",
                        fixAvailable: vuln.fixAvailable || false,
                    });
                }
                result.scanned = true;
            }
            catch {
                result.error = e.message || "Audit failed";
            }
        }
    }
    // Check for Cargo
    else if (existsSync(join(repoPath, "Cargo.lock"))) {
        try {
            execSync("cargo audit --json", { cwd: repoPath, encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 });
            result.scanned = true;
        }
        catch (e) {
            try {
                const stdoutStr = e.stdout ? e.stdout.toString() : "";
                const data = JSON.parse(stdoutStr || "{}");
                for (const vuln of data.vulnerabilities?.list || []) {
                    result.findings.push({
                        repo,
                        severity: (vuln.advisory?.severity || "low").toLowerCase(),
                        package: vuln.package?.name || "unknown",
                        vulnerability: vuln.advisory?.title || "Unknown",
                        version: vuln.package?.version || "unknown",
                        fixAvailable: !!vuln.versions?.patched?.length,
                    });
                }
                result.scanned = true;
            }
            catch {
                result.error = e.message || "cargo audit failed";
            }
        }
    }
    return result;
}
function generateMarkdown(results) {
    const allFindings = results.flatMap(r => r.findings);
    const severityOrder = ["critical", "high", "moderate", "low", "info"];
    let md = `# Security Audit Report\n\n`;
    md += `**Generated:** ${new Date().toISOString().split("T")[0]}\n`;
    md += `**Repos scanned:** ${results.filter(r => r.scanned).length}/${REPOS.length}\n\n`;
    md += `## Summary\n\n`;
    md += `| Severity | Count |\n`;
    md += `|----------|-------|\n`;
    for (const sev of severityOrder) {
        const count = allFindings.filter(f => f.severity === sev).length;
        const icon = sev === "critical" ? "🔴" : sev === "high" ? "🟠" : sev === "moderate" ? "🟡" : "🟢";
        md += `| ${icon} ${sev.charAt(0).toUpperCase() + sev.slice(1)} | ${count} |\n`;
    }
    md += `| **Total** | **${allFindings.length}** |\n\n`;
    md += `## Per-Repo Results\n\n`;
    md += `| Repo | Status | Findings |\n`;
    md += `|------|--------|----------|\n`;
    for (const r of results) {
        const icon = r.error ? "❌" : r.scanned ? (r.findings.length ? "⚠️" : "✅") : "➖";
        const status = r.error ? `Error: ${r.error.slice(0, 40)}` : r.scanned ? `${r.findings.length} findings` : "No lockfile";
        md += `| ${icon} ${r.repo} | ${status} | ${r.findings.length} |\n`;
    }
    md += `\n`;
    const withFindings = results.filter(r => r.findings.length > 0);
    if (withFindings.length) {
        md += `## Findings by Repo\n\n`;
        for (const r of withFindings) {
            md += `### ${r.repo}\n\n`;
            md += `| Package | Severity | Vulnerability | Fix Available |\n`;
            md += `|---------|----------|---------------|---------------|\n`;
            for (const f of r.findings) {
                const fix = f.fixAvailable ? "✅" : "❌";
                md += `| ${f.package}@${f.version} | ${f.severity} | ${f.vulnerability.slice(0, 50)} | ${fix} |\n`;
            }
            md += `\n`;
        }
    }
    if (results.some(r => r.error)) {
        md += `## Errors\n\n`;
        for (const r of results.filter(r => r.error)) {
            md += `- **${r.repo}**: ${r.error}\n`;
        }
        md += `\n`;
    }
    return md;
}
function main() {
    console.log("Running security audits across 22 repos...");
    const results = [];
    for (const repo of REPOS) {
        process.stdout.write(`  ${repo}... `);
        const result = auditRepo(repo);
        results.push(result);
        if (result.error) {
            console.log(`ERROR: ${result.error.slice(0, 60)}`);
        }
        else if (result.scanned) {
            console.log(`${result.findings.length} findings`);
        }
        else {
            console.log("skipped (no lockfile)");
        }
    }
    const md = generateMarkdown(results);
    const outPath = join(ECOSYSTEM_ROOT, "gtcx-operations", "workstream", `security-audit-${new Date().toISOString().split("T")[0]}.md`);
    writeFileSync(outPath, md);
    const totalFindings = results.reduce((a, r) => a + r.findings.length, 0);
    const critical = results.flatMap(r => r.findings).filter(f => f.severity === "critical").length;
    console.log(`\nTotal findings: ${totalFindings} (${critical} critical)`);
    console.log(`Report: ${outPath}`);
}
main();
//# sourceMappingURL=security-audit-scheduler.js.map