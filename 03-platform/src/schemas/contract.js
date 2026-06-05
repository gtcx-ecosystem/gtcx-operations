import { z } from 'zod';
export const ContractFrontmatterSchema = z.object({
    type: z.enum(['nda', 'msa', 'employment', 'consulting', 'vendor']),
    version: z.string(),
    effective_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // Can be template like {{effective_date}}
    party_a: z.string().min(1),
    party_b: z.string().min(1),
    jurisdiction: z.string().min(1),
    term_months: z.number().min(1).optional(),
    mutual: z.boolean().optional(),
    status: z.enum(['draft', 'review', 'approved', 'signed', 'expired', 'terminated']),
});
export const PolicyFrontmatterSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1),
    version: z.string(),
    effective_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    owner: z.string().email().optional(),
    review_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    status: z.enum(['draft', 'review', 'approved', 'archived']).optional(),
});
//# sourceMappingURL=contract.js.map