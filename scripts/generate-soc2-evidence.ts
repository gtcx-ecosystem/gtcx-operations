#!/usr/bin/env tsx
/**
 * SOC 2 Type II Evidence Template Generator
 *
 * Generates markdown evidence templates for Trust Services Criteria.
 * Run: `pnpm generate:soc2`
 */

import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const ECOSYSTEM_ROOT = process.env.ECOSYSTEM_ROOT || join(process.env.HOME || "", "Sites", "gtcx-ecosystem");
const OUTPUT_DIR = join(ECOSYSTEM_ROOT, "gtcx-operations", "workstream", "soc2");

interface EvidenceTemplate {
  criterion: string;
  title: string;
  controlDescription: string;
  testProcedure: string;
  expectedResult: string;
  evidenceSources: string[];
  responsibleParty: string;
  frequency: string;
}

const TEMPLATES: EvidenceTemplate[] = [
  {
    criterion: "CC6.1",
    title: "Logical Access Controls",
    controlDescription: "The entity implements logical access controls to protect its assets from unauthorized access.",
    testProcedure: "1. Review access control policy\n2. Sample user accounts and verify least privilege\n3. Verify access review cadence\n4. Check offboarding automation",
    expectedResult: "All user accounts have documented roles, least privilege is enforced, quarterly access reviews are completed, offboarding is automated within 24 hours.",
    evidenceSources: ["AGENTS.md credential access section", "CI workflow security gates", "Vault audit logs"],
    responsibleParty: "security-engineer",
    frequency: "quarterly",
  },
  {
    criterion: "CC6.2",
    title: "Access Removal",
    controlDescription: "The entity removes access upon termination or role change.",
    testProcedure: "1. Sample terminated employee accounts\n2. Verify access revocation within 24 hours\n3. Check Vault credential rotation post-removal",
    expectedResult: "100% of terminated accounts have access revoked within 24 hours. Vault credentials rotated.",
    evidenceSources: ["HR offboarding checklist", "Vault audit trail", "GitHub org audit logs"],
    responsibleParty: "hr-ops",
    frequency: "per-event",
  },
  {
    criterion: "CC6.3",
    title: "Access Changes",
    controlDescription: "The entity authorizes and documents access changes.",
    testProcedure: "1. Review access change request log\n2. Verify approval workflow in CI\n3. Check ABAC policy changes are versioned",
    expectedResult: "All access changes require approval. ABAC policies versioned in Git.",
    evidenceSources: [".github/workflows/ci.yml", "ABAC policy Git history", "OPA evaluation logs"],
    responsibleParty: "platform-engineer",
    frequency: "continuous",
  },
  {
    criterion: "CC7.1",
    title: "Security Operations",
    controlDescription: "The entity detects and responds to security events.",
    testProcedure: "1. Verify security scanning in CI (Trivy, CodeQL, pnpm audit)\n2. Check incident response runbook exists\n3. Validate pentest tracking dashboard",
    expectedResult: "All CI runs include security scans. Incident response runbook < 1 year old. Pentest findings tracked with SLA.",
    evidenceSources: [".github/workflows/ci.yml", "ops/runbooks/incident-response.md", "workstream/pentest-tracker.md"],
    responsibleParty: "security-engineer",
    frequency: "continuous",
  },
  {
    criterion: "CC7.2",
    title: "System Monitoring",
    controlDescription: "The entity monitors its systems for anomalies.",
    testProcedure: "1. Verify monitoring dashboards exist\n2. Check alerting thresholds\n3. Validate health check automation",
    expectedResult: "All production services have monitoring dashboards. Alerts configured for p99 > 50ms, error rate > 0.1%.",
    evidenceSources: ["workstream/ecosystem-health.md", "k8s monitoring configs", "alert-manager rules"],
    responsibleParty: "platform-engineer",
    frequency: "continuous",
  },
  {
    criterion: "CC8.1",
    title: "Change Management",
    controlDescription: "The entity authorizes, tests, and documents changes.",
    testProcedure: "1. Review PR approval requirements\n2. Verify CI gates before merge\n3. Check deployment rollback procedure",
    expectedResult: "All code changes require PR + 1 approval. CI gates (test, lint, typecheck, security) must pass. Rollback script tested monthly.",
    evidenceSources: [".github/PULL_REQUEST_TEMPLATE.md", ".github/workflows/ci.yml", "deploy/rollback.sh"],
    responsibleParty: "platform-engineer",
    frequency: "continuous",
  },
  {
    criterion: "A1.1",
    title: "Availability Monitoring",
    controlDescription: "The entity monitors system availability.",
    testProcedure: "1. Check uptime SLAs documented\n2. Verify status page exists\n3. Validate DR drill frequency",
    expectedResult: "99.9% uptime SLA documented. Status page active. DR drill completed quarterly.",
    evidenceSources: ["docs/operations/sla.md", "status page URL", "docs/operations/dr-drill-evidence.md"],
    responsibleParty: "ops-engineer",
    frequency: "quarterly",
  },
  {
    criterion: "C1.1",
    title: "Confidentiality Classification",
    controlDescription: "The entity classifies information based on confidentiality.",
    testProcedure: "1. Verify data classification policy\n2. Check secret scanning in CI\n3. Validate encryption at rest and in transit",
    expectedResult: "Data classified as Public/Internal/Restricted/Evidence. Secret scanning gates CI. AES-256 at rest, TLS 1.3 in transit.",
    evidenceSources: ["docs/security/classification-policy.md", ".github/workflows/ci.yml", "k8s secret configs"],
    responsibleParty: "security-engineer",
    frequency: "annual",
  },
];

function generateMarkdown(template: EvidenceTemplate): string {
  let md = `# SOC 2 Evidence: ${template.criterion} — ${template.title}\n\n`;
  md += `**Criterion:** ${template.criterion}\n`;
  md += `**Responsible:** ${template.responsibleParty}\n`;
  md += `**Frequency:** ${template.frequency}\n\n`;

  md += `## Control Description\n\n${template.controlDescription}\n\n`;
  md += `## Test Procedure\n\n${template.testProcedure}\n\n`;
  md += `## Expected Result\n\n${template.expectedResult}\n\n`;
  md += `## Evidence Sources\n\n`;
  for (const source of template.evidenceSources) {
    md += `- [ ] ${source}\n`;
  }

  md += `\n## Evidence Collection Log\n\n`;
  md += `| Date | Collector | Finding | Status |\n`;
  md += `|------|-----------|---------|--------|\n`;
  md += `| | | | |\n`;

  md += `\n## Auditor Review\n\n`;
  md += `| Date | Auditor | Result | Notes |\n`;
  md += `|------|---------|--------|-------|\n`;
  md += `| | | | |\n`;

  return md;
}

function main() {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  for (const template of TEMPLATES) {
    const fileName = `evidence-${template.criterion.toLowerCase()}-${template.frequency}.md`;
    const path = join(OUTPUT_DIR, fileName);
    writeFileSync(path, generateMarkdown(template));
    console.log(`Generated: ${fileName}`);
  }

  console.log(`\nAll ${TEMPLATES.length} SOC 2 evidence templates written to ${OUTPUT_DIR}`);
}

main();
