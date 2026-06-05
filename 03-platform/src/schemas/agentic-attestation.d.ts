import { z } from 'zod';
/** Compliance mirror row — not the full protocols attestation payload. */
export declare const AgenticAttestationRecordSchema: z.ZodObject<{
    work_id: z.ZodString;
    coordination_spec: z.ZodDefault<z.ZodString>;
    pilot: z.ZodOptional<z.ZodString>;
    algorithm: z.ZodOptional<z.ZodString>;
    evidence_uri: z.ZodString;
    evidence_sha256: z.ZodString;
    attested_at: z.ZodString;
    implementation_owner: z.ZodEnum<["gtcx-agentic"]>;
    protocols_repo_commit: z.ZodOptional<z.ZodString>;
    soc2_controls: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    mirrored_at: z.ZodString;
    external_wording: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    work_id: string;
    coordination_spec: string;
    evidence_uri: string;
    evidence_sha256: string;
    attested_at: string;
    implementation_owner: "gtcx-agentic";
    soc2_controls: string[];
    mirrored_at: string;
    pilot?: string | undefined;
    algorithm?: string | undefined;
    protocols_repo_commit?: string | undefined;
    external_wording?: string | undefined;
    notes?: string | undefined;
}, {
    work_id: string;
    evidence_uri: string;
    evidence_sha256: string;
    attested_at: string;
    implementation_owner: "gtcx-agentic";
    mirrored_at: string;
    coordination_spec?: string | undefined;
    pilot?: string | undefined;
    algorithm?: string | undefined;
    protocols_repo_commit?: string | undefined;
    soc2_controls?: string[] | undefined;
    external_wording?: string | undefined;
    notes?: string | undefined;
}>;
export declare const AttestationRegisterSchema: z.ZodObject<{
    version: z.ZodString;
    updated_at: z.ZodString;
    records: z.ZodArray<z.ZodObject<{
        work_id: z.ZodString;
        coordination_spec: z.ZodDefault<z.ZodString>;
        pilot: z.ZodOptional<z.ZodString>;
        algorithm: z.ZodOptional<z.ZodString>;
        evidence_uri: z.ZodString;
        evidence_sha256: z.ZodString;
        attested_at: z.ZodString;
        implementation_owner: z.ZodEnum<["gtcx-agentic"]>;
        protocols_repo_commit: z.ZodOptional<z.ZodString>;
        soc2_controls: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        mirrored_at: z.ZodString;
        external_wording: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        work_id: string;
        coordination_spec: string;
        evidence_uri: string;
        evidence_sha256: string;
        attested_at: string;
        implementation_owner: "gtcx-agentic";
        soc2_controls: string[];
        mirrored_at: string;
        pilot?: string | undefined;
        algorithm?: string | undefined;
        protocols_repo_commit?: string | undefined;
        external_wording?: string | undefined;
        notes?: string | undefined;
    }, {
        work_id: string;
        evidence_uri: string;
        evidence_sha256: string;
        attested_at: string;
        implementation_owner: "gtcx-agentic";
        mirrored_at: string;
        coordination_spec?: string | undefined;
        pilot?: string | undefined;
        algorithm?: string | undefined;
        protocols_repo_commit?: string | undefined;
        soc2_controls?: string[] | undefined;
        external_wording?: string | undefined;
        notes?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    version: string;
    updated_at: string;
    records: {
        work_id: string;
        coordination_spec: string;
        evidence_uri: string;
        evidence_sha256: string;
        attested_at: string;
        implementation_owner: "gtcx-agentic";
        soc2_controls: string[];
        mirrored_at: string;
        pilot?: string | undefined;
        algorithm?: string | undefined;
        protocols_repo_commit?: string | undefined;
        external_wording?: string | undefined;
        notes?: string | undefined;
    }[];
}, {
    version: string;
    updated_at: string;
    records: {
        work_id: string;
        evidence_uri: string;
        evidence_sha256: string;
        attested_at: string;
        implementation_owner: "gtcx-agentic";
        mirrored_at: string;
        coordination_spec?: string | undefined;
        pilot?: string | undefined;
        algorithm?: string | undefined;
        protocols_repo_commit?: string | undefined;
        soc2_controls?: string[] | undefined;
        external_wording?: string | undefined;
        notes?: string | undefined;
    }[];
}>;
export type AgenticAttestationRecord = z.infer<typeof AgenticAttestationRecordSchema>;
export type AttestationRegister = z.infer<typeof AttestationRegisterSchema>;
//# sourceMappingURL=agentic-attestation.d.ts.map