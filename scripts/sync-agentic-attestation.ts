#!/usr/bin/env node
/**
 * Mirror INF-86 XR-401 agentic attestation from gtcx-protocols evidence into
 * docs/operations/compliance/attestation-register.yaml
 */
import { createHash } from 'crypto';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';
import { REPO_ROOT, readYaml } from '../src/utils/files.js';
import {
  AttestationRegisterSchema,
  type AgenticAttestationRecord,
  type AttestationRegister,
} from '../src/schemas/agentic-attestation.js';

const EVIDENCE_REL =
  'docs/audit/evidence/inf-86-xr-401-agentic-attestation-latest.json';

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

interface ProtocolsAttestation {
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
const evidencePath = join(protocolsRoot, EVIDENCE_REL);

if (!existsSync(evidencePath)) {
  console.error(`❌ Evidence not found: ${evidencePath}`);
  console.error('   Wait for gtcx-agentic PR to land attestation on protocols main.');
  process.exit(1);
}

const payload = JSON.parse(readFileSync(evidencePath, 'utf-8')) as ProtocolsAttestation;
const hash = sha256File(evidencePath);

const registerPath = join(
  REPO_ROOT,
  'docs/operations/compliance/attestation-register.yaml'
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

const row: AgenticAttestationRecord = {
  work_id: payload.work_id,
  coordination_spec: 'COORD-ATR-001',
  pilot: payload.pilot,
  algorithm: payload.algorithm,
  evidence_uri: `gtcx-protocols/${EVIDENCE_REL}`,
  evidence_sha256: hash,
  attested_at: payload.attested_at,
  implementation_owner: 'gtcx-agentic',
  protocols_repo_commit: payload.repo_commit,
  soc2_controls: ['CC8.1'],
  mirrored_at: new Date().toISOString(),
  external_wording:
    'Algorithm approval recorded per COORD-ATR-001 agentic attestation artifact',
};

const idx = register.records.findIndex((r) => r.work_id === row.work_id);
if (idx >= 0) {
  register.records[idx] = { ...register.records[idx], ...row };
  console.log(`🔄 Updated register row: ${row.work_id}`);
} else {
  register.records.push(row);
  console.log(`➕ Added register row: ${row.work_id}`);
}

register.updated_at = new Date().toISOString();

const header = `# Agentic attestation compliance mirror (COORD-ATR-001)
# Source of truth: gtcx-protocols/docs/audit/evidence/
# Refresh: pnpm sync:agentic-attestation

`;
writeFileSync(registerPath, header + yaml.dump(register, { lineWidth: 100 }));

console.log(`✅ Register: ${registerPath}`);
console.log(`   evidence_sha256: ${hash}`);
