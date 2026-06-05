#!/usr/bin/env node
/**
 * Mirror INF-86 XR-401 A/B/C agentic attestations from gtcx-protocols evidence
 * into 01-docs/04-ops/compliance/attestation-register.yaml
 */
import { createHash } from 'crypto';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';
import { REPO_ROOT, readYaml } from '../03-platform/src/utils/files.js';
import {
  AttestationRegisterSchema,
  type AgenticAttestationRecord,
  type AttestationRegister,
} from '../03-platform/src/schemas/agentic-attestation.js';

const EVIDENCE_MANIFEST: Array<{
  rel: string;
  external_wording: string;
  notes: string;
}> = [
  {
    rel: '01-docs/05-audit/evidence/inf-86-xr-401-agentic-attestation-latest.json',
    external_wording:
      'Algorithm approval recorded per COORD-ATR-001 agentic attestation artifact',
    notes: 'INF-86 Option A — security-engineer + platform-architect dual attestation.',
  },
  {
    rel: '01-docs/05-audit/evidence/inf-86-xr-401b-custodian-roster-latest.json',
    external_wording:
      'Custodian roster recorded per COORD-ATR-001 agentic ceremony model (XR-401-B)',
    notes: 'Dual custodian + ceremony-witness roster for INF-86-H02-GHBOG-2026.',
  },
  {
    rel: '01-docs/05-audit/evidence/inf-86-xr-401c-ceremony-authorization-latest.json',
    external_wording:
      'Pilot ceremony authorization recorded per COORD-ATR-001 (XR-401-C; agentic path)',
    notes: 'Release-governance + security-engineer authorization — pilot gh-bog only.',
  },
];

function resolveProtocolsRoot(): string {
  if (process.env.PROTOCOLS_ROOT) {
    return process.env.PROTOCOLS_ROOT;
  }
  const sibling = join(REPO_ROOT, '..', 'gtcx-protocols');
  if (existsSync(join(sibling, 'package.json'))) {
    return sibling;
  }
  throw new Error(
    'gtcx-protocols not found. Set PROTOCOLS_ROOT or clone sibling at ../gtcx-protocols'
  );
}

interface ProtocolsEvidence {
  work_id: string;
  pilot?: string;
  algorithm?: string;
  attested_at: string;
  repo_commit?: string;
}

function sha256File(path: string): string {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

const protocolsRoot = resolveProtocolsRoot();
const registerPath = join(
  REPO_ROOT,
  '01-docs/04-ops/compliance/attestation-register.yaml'
);

let register: AttestationRegister;
if (existsSync(registerPath)) {
  register = AttestationRegisterSchema.parse(readYaml(registerPath));
} else {
  register = {
    version: '1.0',
    updated_at: new Date().toISOString(),
    records: [],
  };
}

let mirrored = 0;
let missing = 0;

for (const entry of EVIDENCE_MANIFEST) {
  const evidencePath = join(protocolsRoot, entry.rel);
  if (!existsSync(evidencePath)) {
    console.warn(`⚠️  Skip ${entry.rel} — not found (wait for gtcx-agentic → protocols main)`);
    missing++;
    continue;
  }

  const payload = JSON.parse(readFileSync(evidencePath, 'utf-8')) as ProtocolsEvidence;
  const hash = sha256File(evidencePath);

  const row: AgenticAttestationRecord = {
    work_id: payload.work_id,
    coordination_spec: 'COORD-ATR-001',
    pilot: payload.pilot,
    algorithm: payload.algorithm,
    evidence_uri: `gtcx-protocols/${entry.rel}`,
    evidence_sha256: hash,
    attested_at: payload.attested_at,
    implementation_owner: 'gtcx-agentic',
    protocols_repo_commit: payload.repo_commit,
    soc2_controls: ['CC8.1'],
    mirrored_at: new Date().toISOString(),
    external_wording: entry.external_wording,
    notes: entry.notes,
  };

  const idx = register.records.findIndex((r) => r.work_id === row.work_id);
  if (idx >= 0) {
    register.records[idx] = { ...register.records[idx], ...row };
    console.log(`🔄 ${row.work_id}: ${hash.slice(0, 12)}…`);
  } else {
    register.records.push(row);
    console.log(`➕ ${row.work_id}: ${hash.slice(0, 12)}…`);
  }
  mirrored++;
}

register.updated_at = new Date().toISOString();

const header = `# Agentic attestation compliance mirror (COORD-ATR-001)
# Source of truth: gtcx-protocols/01-docs/05-audit/evidence/
# Refresh: pnpm sync:agentic-attestation

`;
writeFileSync(registerPath, header + yaml.dump(register, { lineWidth: 100 }));

console.log(`\n✅ Register: ${registerPath}`);
console.log(`   Mirrored: ${mirrored} | Missing: ${missing}`);

if (mirrored === 0) {
  process.exit(1);
}
