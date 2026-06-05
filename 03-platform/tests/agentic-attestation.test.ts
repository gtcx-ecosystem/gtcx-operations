import { describe, it, expect } from 'vitest';
import {
  AgenticAttestationRecordSchema,
  AttestationRegisterSchema,
} from '../03-platform/src/schemas/agentic-attestation.js';

const validRecord = {
  work_id: 'XR-401-A',
  coordination_spec: 'COORD-ATR-001',
  evidence_uri: 'gtcx-protocols/01-docs/05-audit/evidence/inf-86-xr-401-agentic-attestation-latest.json',
  evidence_sha256: 'cada8400140945ec521855dcf30004cc0878ce8c83d290ffd85ccf396cd40cd5',
  attested_at: '2026-06-03T10:32:37.540Z',
  implementation_owner: 'gtcx-agentic' as const,
  mirrored_at: '2026-06-03T12:00:00.000Z',
};

describe('AgenticAttestationRecordSchema', () => {
  it('accepts a valid mirror row', () => {
    expect(AgenticAttestationRecordSchema.safeParse(validRecord).success).toBe(true);
  });

  it('rejects invalid sha256', () => {
    const bad = { ...validRecord, evidence_sha256: 'not-a-hash' };
    expect(AgenticAttestationRecordSchema.safeParse(bad).success).toBe(false);
  });
});

describe('AttestationRegisterSchema', () => {
  it('accepts register with one record', () => {
    const reg = {
      version: '1.0',
      updated_at: '2026-06-03T12:00:00.000Z',
      records: [validRecord],
    };
    expect(AttestationRegisterSchema.safeParse(reg).success).toBe(true);
  });
});
