#!/usr/bin/env node
/**
 * Generate SOC 2 Type II evidence templates for Trust Services Criteria.
 *
 * Usage: pnpm generate:soc2
 */

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const REPO_ROOT = process.cwd();
const OUTPUT_DIR = join(REPO_ROOT, 'workstream', 'soc2');

interface Criterion {
  id: string;
  title: string;
  description: string;
  testProcedure: string;
  expectedResult: string;
  evidenceReference: string;
}

const CRITERIA: Criterion[] = [
  {
    id: 'CC6.1',
    title: 'Logical Access Controls',
    description:
      'The entity implements logical access security measures to protect against threats from sources outside the boundaries of the system, using access control software and rule sets.',
    testProcedure:
      '1. Inspect the access control policy document.\n' +
      '2. Review identity and access management (IAM) configuration for production systems.\n' +
      '3. Sample user access lists and verify that access rights are granted based on job roles.\n' +
      '4. Verify that access reviews are performed on a defined frequency (e.g., quarterly).',
    expectedResult:
      'Access control policy is documented and approved. IAM configurations enforce role-based access control (RBAC). Access reviews are performed and documented with evidence of follow-up for exceptions.',
    evidenceReference:
      '- Access Control Policy (docs/governance/access-control-policy.md)\n' +
      '- IAM configuration exports (infra/iam/*.tf or cloud console reports)\n' +
      '- Quarterly access review tickets/meeting notes',
  },
  {
    id: 'CC6.2',
    title: 'Access Removal',
    description:
      'The entity authorizes, modifies, or removes access to data, software, functions, and other protected information assets based on roles, responsibilities, or the system design, and changes are authorized and documented.',
    testProcedure:
      '1. Review the offboarding / termination checklist and runbook.\n' +
      '2. Select a sample of terminated employees and verify their system access was revoked within the defined SLA.\n' +
      '3. Review access removal tickets for completeness and approval.',
    expectedResult:
      'Access removal procedures are defined and followed. Terminated user access is revoked within the documented SLA (e.g., 24 hours). Evidence of access removal is retained for audit trail.',
    evidenceReference:
      '- HR offboarding checklist (hr/offboarding-checklist.md)\n' +
      '- Access removal tickets (Jira/ClickUp/GitHub Issues)\n' +
      '- IAM audit logs showing deprovisioning timestamps',
  },
  {
    id: 'CC6.3',
    title: 'Access Changes',
    description:
      'The entity creates or modifies access to protected information assets based on authorization from the asset\'s owner.',
    testProcedure:
      '1. Inspect the access request and approval workflow.\n' +
      '2. Sample access change requests (add/modify/elevate) and verify they are approved by the asset owner or designated authority.\n' +
      '3. Verify that changes are logged and that the requestor\'s identity is authenticated.',
    expectedResult:
      'Access changes require documented approval from the asset owner. Requests are authenticated and logged. No unauthorized access changes are present in the sample.',
    evidenceReference:
      '- Access request form / ticket template\n' +
      '- Sample of approved access change tickets\n' +
      '- Identity provider logs (SSO / OIDC audit trail)',
  },
  {
    id: 'CC7.1',
    title: 'Security Operations',
    description:
      'The entity uses detection and monitoring procedures to identify security events and anomalies that could indicate security threats.',
    testProcedure:
      '1. Review the security operations policy and incident response plan.\n' +
      '2. Verify that security monitoring tools (SIEM, IDS/IPS, EDR) are deployed and configured.\n' +
      '3. Inspect alerting rules and escalation procedures.\n' +
      '4. Sample security event logs and verify they are reviewed and acted upon.',
    expectedResult:
      'Security operations policy is current. Monitoring and detection tools are active with documented alerting thresholds. Security events are reviewed and escalated per the incident response plan.',
    evidenceReference:
      '- Security Operations Policy (ops/security-operations-policy.md)\n' +
      '- SIEM / monitoring dashboard screenshots or configurations\n' +
      '- Incident response tickets and post-mortem reports',
  },
  {
    id: 'CC7.2',
    title: 'System Monitoring',
    description:
      'The entity monitors system components and the operation of those components for anomalies that could indicate security threats.',
    testProcedure:
      '1. Review system monitoring strategy and tooling documentation.\n' +
      '2. Verify that critical system components (servers, databases, network devices) are monitored.\n' +
      '3. Sample monitoring alerts and verify they were investigated and resolved.\n' +
      '4. Verify that log integrity protections (tamper-evident storage, immutability) are in place.',
    expectedResult:
      'All critical components are under continuous monitoring. Alerts are triaged and resolved with documented outcomes. Logs are protected from tampering.',
    evidenceReference:
      '- System monitoring architecture diagram\n' +
      '- Monitoring alert samples and resolution tickets\n' +
      '- Log integrity configuration (WORM / immutable storage settings)',
  },
  {
    id: 'CC8.1',
    title: 'Change Management',
    description:
      'The entity authorizes, designs, develops or acquires, configures, documents, tests, approves, and implements changes to infrastructure, data, software, and procedures to meet the entity\'s objectives.',
    testProcedure:
      '1. Review the change management policy and runbook.\n' +
      '2. Sample production changes from the change log / ticketing system.\n' +
      '3. Verify each change has: request ticket, risk assessment, approval, testing evidence, and post-deployment validation.\n' +
      '4. Verify emergency change procedures exist and are documented.',
    expectedResult:
      'Changes follow a documented lifecycle. Each production change has request, risk assessment, approval, test results, and deployment validation. Emergency changes are documented and retroactively approved.',
    evidenceReference:
      '- Change Management Policy (ops/change-management-policy.md)\n' +
      '- Change tickets / RFCs (Request for Change)\n' +
      '- CI/CD pipeline logs and deployment records',
  },
];

function generateTemplate(criterion: Criterion, date: string): string {
  return `---
criterion: ${criterion.id}
title: ${criterion.title}
date: ${date}
status: draft
type: soc2-evidence
---

# SOC 2 Evidence — ${criterion.id}: ${criterion.title}

**Date:** ${date}  
**Criterion:** ${criterion.id}  
**Status:** Draft

---

## Control Description

${criterion.description}

---

## Test Procedure

${criterion.testProcedure}

---

## Expected Result

${criterion.expectedResult}

---

## Evidence Reference

${criterion.evidenceReference}

---

## Actual Evidence

<!-- Populate during audit period -->

| Evidence Item | Location | Date Collected | Reviewer |
|---------------|----------|----------------|----------|
|               |          |                |          |

---

## Test Results

<!-- Complete after performing test procedure -->

- **Result:** PASS / FAIL / PARTIAL
- **Exceptions Noted:**
- **Remediation Plan:**
- **Reviewer:**
- **Review Date:**

---

*Generated by gtcx-operations SOC 2 evidence generator.*
`;
}

function main(): void {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const today = new Date().toISOString().split('T')[0];
  let generatedCount = 0;

  console.log(`Generating SOC 2 Type II evidence templates...`);
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  for (const criterion of CRITERIA) {
    const filename = `evidence-${criterion.id.toLowerCase()}-${today}.md`;
    const filepath = join(OUTPUT_DIR, filename);
    const content = generateTemplate(criterion, today);

    writeFileSync(filepath, content, 'utf-8');
    console.log(`  Created: ${filename}`);
    generatedCount++;
  }

  console.log(`\nDone. ${generatedCount} evidence template(s) generated.`);
  process.exit(0);
}

main();
