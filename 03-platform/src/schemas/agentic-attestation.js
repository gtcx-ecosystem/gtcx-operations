import { z } from 'zod';
/** Compliance mirror row — not the full protocols attestation payload. */
export const AgenticAttestationRecordSchema = z.object({
    work_id: z.string().min(1),
    coordination_spec: z.string().default('COORD-ATR-001'),
    pilot: z.string().optional(),
    algorithm: z.string().optional(),
    evidence_uri: z.string().min(1),
    evidence_sha256: z.string().regex(/^[a-f0-9]{64}$/),
    attested_at: z.string().datetime(),
    implementation_owner: z.enum(['gtcx-agentic']),
    protocols_repo_commit: z.string().min(7).optional(),
    soc2_controls: z.array(z.string()).default([]),
    mirrored_at: z.string().datetime(),
    external_wording: z.string().optional(),
    notes: z.string().optional(),
});
export const AttestationRegisterSchema = z.object({
    version: z.string(),
    updated_at: z.string().datetime(),
    records: z.array(AgenticAttestationRecordSchema),
});
//# sourceMappingURL=agentic-attestation.js.map