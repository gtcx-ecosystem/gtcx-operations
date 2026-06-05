import { z } from 'zod';
export const InvestorSchema = z.object({
    name: z.string().min(1),
    contact: z.string().email().optional(),
    introduced_by: z.string().optional(),
    date_added: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    status: z.enum(['active', 'paused', 'committed', 'passed', 'closed']),
    next_action: z.string().optional(),
    next_action_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    notes: z.string().optional(),
    committed_amount: z.number().optional(),
});
export const StageSchema = z.object({
    name: z.string().min(1),
    description: z.string(),
    investors: z.array(InvestorSchema),
});
export const PipelineSchema = z.object({
    pipeline: z.object({
        name: z.string().min(1),
        target_raise: z.number().min(0),
        currency: z.string().min(1),
        target_close: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        owner: z.string().email(),
    }),
    stages: z.array(StageSchema),
    metrics: z.object({
        total_contacts: z.number().min(0),
        active_conversations: z.number().min(0),
        term_sheets_received: z.number().min(0),
        amount_committed: z.number().min(0),
        days_since_start: z.number().min(0),
    }),
});
//# sourceMappingURL=fundraising.js.map