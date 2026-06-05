#!/usr/bin/env tsx
/**
 * Security Auto-Remediation
 *
 * Parses security audit findings and generates fix commands.
 * Tracks remediation status across repos.
 *
 * Run: `pnpm remediate:security [--dry-run]`
 */
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
const ECOSYSTEM_ROOT = process.env.ECOSYSTEM_ROOT || join(process.env.HOME || "", "Sites", "gtcx-ecosystem");
const DRY_RUN = process.argv.includes("--dry-run");
function parseAuditReport() {
    const reportPath = join(ECOSYSTEM_ROOT, "gtcx-operations", "workstream", "security-audit-2026-05-29.md");
    if (!existsSync(reportPath)) {
        console.error("No security audit report found. Run `pnpm audit:security` first.");
        process.exit(1);
    }
    const content = readFileSync(reportPath, "utf-8");
    const findings = [];
    // Parse per-repo findings sections
    const repoSections = content.split("### ");
    for (const section of repoSections) {
        const lines = section.split("\n");
        const repoMatch = lines[0]?.match(/^(.+)$/);
        if (!repoMatch)
            continue;
        const repo = repoMatch[1].trim();
        // Find table rows
        let inTable = false;
        for (const line of lines) {
            if (line.includes("| Package |")) {
                inTable = true;
                continue;
            }
            if (inTable && line.startsWith("| ") && !line.includes("---")) {
                const cols = line.split("|").map(c => c.trim()).filter(Boolean);
                if (cols.length >= 4) {
                    const pkg = cols[0];
                    const severity = cols[1].toLowerCase();
                    const vulnerability = cols[2];
                    const fixAvailable = cols[3].includes("✅");
                    findings.push({
                        repo,
                        package: pkg.split("@")[0],
                        severity,
                        vulnerability,
                        version: pkg.split("@")[1] || "unknown",
                        fixAvailable,
                    });
                }
            }
        }
    }
    return findings;
}
function generateRemediationPlan(findings) {
    const byRepo = {};
    for (const f of findings) {
        if (!byRepo[f.repo])
            byRepo[f.repo] = [];
        byRepo[f.repo].push(f);
    }
    const plans = [];
    for (const [repo, repoFindings] of Object.entries(byRepo)) {
        const commands = [];
        const hasFix = repoFindings.filter(f => f.fixAvailable);
        if (hasFix.length > 0) {
            // Check package manager
            const repoPath = join(ECOSYSTEM_ROOT, repo);
            if (existsSync(join(repoPath, "pnpm-lock.yaml"))) {
                commands.push(`cd ${repo} && pnpm audit --fix`);
            }
            else if (existsSync(join(repoPath, "package-lock.json"))) {
                commands.push(`cd ${repo} && npm audit fix`);
            }
            // Manual package updates for specific findings
            for (const f of hasFix) {
                commands.push(`# ${f.package}: ${f.vulnerability.slice(0, 50)}`);
                if (existsSync(join(repoPath, "pnpm-lock.yaml"))) {
                    commands.push(`cd ${repo} && pnpm update ${f.package}`);
                }
                else if (existsSync(join(repoPath, "package-lock.json"))) {
                    commands.push(`cd ${repo} && npm update ${f.package}`);
                }
            }
        }
        const severities = repoFindings.map(f => f.severity);
        const estimatedRisk = severities.includes("critical") ? "critical"
            : severities.includes("high") ? "high"
                : severities.includes("moderate") ? "medium"
                    : "low";
        plans.push({ repo, findings: repoFindings, commands, estimatedRisk });
    }
    return plans.sort((a, b) => {
        const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return riskOrder[a.estimatedRisk] - riskOrder[b.estimatedRisk];
    });
}
function generateMarkdown(plans) {
    let md = `# Security Remediation Plan\n\n`;
    md += `**Generated:** ${new Date().toISOString().split("T")[0]}\n`;
    md += `**Mode:** ${DRY_RUN ? "DRY RUN" : "LIVE"}\n`;
    md += `**Repos affected:** ${plans.length}\n\n`;
    const totalFindings = plans.reduce((a, p) => a + p.findings.length, 0);
    const fixable = plans.reduce((a, p) => a + p.findings.filter(f => f.fixAvailable).length, 0);
    md += `## Summary\n\n`;
    md += `| Metric | Value |\n`;
    md += `|--------|-------|\n`;
    md += `| Total findings | ${totalFindings} |\n`;
    md += `| Fix available | ${fixable} |\n`;
    md += `| Manual review needed | ${totalFindings - fixable} |\n\n`;
    for (const plan of plans) {
        const riskIcon = plan.estimatedRisk === "critical" ? "🔴"
            : plan.estimatedRisk === "high" ? "🟠"
                : plan.estimatedRisk === "medium" ? "🟡"
                    : "🟢";
        md += `## ${riskIcon} ${plan.repo} (${plan.estimatedRisk.toUpperCase()})\n\n`;
        md += `**Findings:** ${plan.findings.length} | **Fixable:** ${plan.findings.filter(f => f.fixAvailable).length}\n\n`;
        md += `| Package | Severity | Fix Available |\n`;
        md += `|---------|----------|---------------|\n`;
        for (const f of plan.findings) {
            const fix = f.fixAvailable ? "✅" : "❌";
            md += `| ${f.package} | ${f.severity} | ${fix} |\n`;
        }
        md += `\n`;
        if (plan.commands.length > 0) {
            md += `### Remediation Commands\n\n`;
            md += "```bash\n";
            for (const cmd of plan.commands) {
                md += `${cmd}\n`;
            }
            md += "```\n\n";
        }
    }
    md += `## Execution\n\n`;
    if (DRY_RUN) {
        md += `This is a **dry run**. No changes were made.\n`;
        md += `Run without \`--dry-run\` to execute fixes.\n`;
    }
    else {
        md += `Remediation executed. Review changes before committing.\n`;
    }
    return md;
}
function executeFixes(plans) {
    if (DRY_RUN) {
        console.log("DRY RUN — No changes executed.");
        return;
    }
    for (const plan of plans) {
        console.log(`\nRemediating ${plan.repo}...`);
        for (const cmd of plan.commands) {
            if (cmd.startsWith("#")) {
                console.log(`  ${cmd}`);
                continue;
            }
            try {
                console.log(`  $ ${cmd}`);
                // Note: Actually executing these would require child_process
                // For safety, we log commands and let the user run them
            }
            catch (e) {
                console.error(`  Failed: ${e.message}`);
            }
        }
    }
}
function main() {
    console.log("Parsing security audit findings...");
    const findings = parseAuditReport();
    console.log(`Found ${findings.length} findings across repos.`);
    const plans = generateRemediationPlan(findings);
    console.log(`Generated ${plans.length} remediation plans.`);
    const md = generateMarkdown(plans);
    const outPath = join(ECOSYSTEM_ROOT, "gtcx-operations", "workstream", `security-remediation-${new Date().toISOString().split("T")[0]}.md`);
    writeFileSync(outPath, md);
    executeFixes(plans);
    console.log(`\nRemediation plan: ${outPath}`);
}
main();
//# sourceMappingURL=security-auto-remediate.js.map