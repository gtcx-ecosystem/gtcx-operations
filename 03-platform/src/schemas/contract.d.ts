import { z } from 'zod';
export declare const ContractFrontmatterSchema: z.ZodObject<{
    type: z.ZodEnum<["nda", "msa", "employment", "consulting", "vendor"]>;
    version: z.ZodString;
    effective_date: z.ZodString;
    party_a: z.ZodString;
    party_b: z.ZodString;
    jurisdiction: z.ZodString;
    term_months: z.ZodOptional<z.ZodNumber>;
    mutual: z.ZodOptional<z.ZodBoolean>;
    status: z.ZodEnum<["draft", "review", "approved", "signed", "expired", "terminated"]>;
}, "strip", z.ZodTypeAny, {
    type: "vendor" | "nda" | "msa" | "employment" | "consulting";
    version: string;
    effective_date: string;
    jurisdiction: string;
    status: "review" | "draft" | "approved" | "signed" | "expired" | "terminated";
    party_a: string;
    party_b: string;
    term_months?: number | undefined;
    mutual?: boolean | undefined;
}, {
    type: "vendor" | "nda" | "msa" | "employment" | "consulting";
    version: string;
    effective_date: string;
    jurisdiction: string;
    status: "review" | "draft" | "approved" | "signed" | "expired" | "terminated";
    party_a: string;
    party_b: string;
    term_months?: number | undefined;
    mutual?: boolean | undefined;
}>;
export declare const PolicyFrontmatterSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    version: z.ZodString;
    effective_date: z.ZodString;
    owner: z.ZodOptional<z.ZodString>;
    review_date: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["draft", "review", "approved", "archived"]>>;
}, "strip", z.ZodTypeAny, {
    version: string;
    effective_date: string;
    title: string;
    status?: "review" | "draft" | "approved" | "archived" | undefined;
    owner?: string | undefined;
    review_date?: string | undefined;
    id?: string | undefined;
}, {
    version: string;
    effective_date: string;
    title: string;
    status?: "review" | "draft" | "approved" | "archived" | undefined;
    owner?: string | undefined;
    review_date?: string | undefined;
    id?: string | undefined;
}>;
export type ContractFrontmatter = z.infer<typeof ContractFrontmatterSchema>;
export type PolicyFrontmatter = z.infer<typeof PolicyFrontmatterSchema>;
//# sourceMappingURL=contract.d.ts.map