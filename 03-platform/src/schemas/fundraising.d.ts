import { z } from 'zod';
export declare const InvestorSchema: z.ZodObject<{
    name: z.ZodString;
    contact: z.ZodOptional<z.ZodString>;
    introduced_by: z.ZodOptional<z.ZodString>;
    date_added: z.ZodString;
    status: z.ZodEnum<["active", "paused", "committed", "passed", "closed"]>;
    next_action: z.ZodOptional<z.ZodString>;
    next_action_date: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    committed_amount: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    status: "closed" | "active" | "paused" | "committed" | "passed";
    date_added: string;
    notes?: string | undefined;
    contact?: string | undefined;
    introduced_by?: string | undefined;
    next_action?: string | undefined;
    next_action_date?: string | undefined;
    committed_amount?: number | undefined;
}, {
    name: string;
    status: "closed" | "active" | "paused" | "committed" | "passed";
    date_added: string;
    notes?: string | undefined;
    contact?: string | undefined;
    introduced_by?: string | undefined;
    next_action?: string | undefined;
    next_action_date?: string | undefined;
    committed_amount?: number | undefined;
}>;
export declare const StageSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    investors: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        contact: z.ZodOptional<z.ZodString>;
        introduced_by: z.ZodOptional<z.ZodString>;
        date_added: z.ZodString;
        status: z.ZodEnum<["active", "paused", "committed", "passed", "closed"]>;
        next_action: z.ZodOptional<z.ZodString>;
        next_action_date: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
        committed_amount: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        status: "closed" | "active" | "paused" | "committed" | "passed";
        date_added: string;
        notes?: string | undefined;
        contact?: string | undefined;
        introduced_by?: string | undefined;
        next_action?: string | undefined;
        next_action_date?: string | undefined;
        committed_amount?: number | undefined;
    }, {
        name: string;
        status: "closed" | "active" | "paused" | "committed" | "passed";
        date_added: string;
        notes?: string | undefined;
        contact?: string | undefined;
        introduced_by?: string | undefined;
        next_action?: string | undefined;
        next_action_date?: string | undefined;
        committed_amount?: number | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    investors: {
        name: string;
        status: "closed" | "active" | "paused" | "committed" | "passed";
        date_added: string;
        notes?: string | undefined;
        contact?: string | undefined;
        introduced_by?: string | undefined;
        next_action?: string | undefined;
        next_action_date?: string | undefined;
        committed_amount?: number | undefined;
    }[];
}, {
    name: string;
    description: string;
    investors: {
        name: string;
        status: "closed" | "active" | "paused" | "committed" | "passed";
        date_added: string;
        notes?: string | undefined;
        contact?: string | undefined;
        introduced_by?: string | undefined;
        next_action?: string | undefined;
        next_action_date?: string | undefined;
        committed_amount?: number | undefined;
    }[];
}>;
export declare const PipelineSchema: z.ZodObject<{
    pipeline: z.ZodObject<{
        name: z.ZodString;
        target_raise: z.ZodNumber;
        currency: z.ZodString;
        target_close: z.ZodString;
        owner: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        owner: string;
        currency: string;
        target_raise: number;
        target_close: string;
    }, {
        name: string;
        owner: string;
        currency: string;
        target_raise: number;
        target_close: string;
    }>;
    stages: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        investors: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            contact: z.ZodOptional<z.ZodString>;
            introduced_by: z.ZodOptional<z.ZodString>;
            date_added: z.ZodString;
            status: z.ZodEnum<["active", "paused", "committed", "passed", "closed"]>;
            next_action: z.ZodOptional<z.ZodString>;
            next_action_date: z.ZodOptional<z.ZodString>;
            notes: z.ZodOptional<z.ZodString>;
            committed_amount: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            status: "closed" | "active" | "paused" | "committed" | "passed";
            date_added: string;
            notes?: string | undefined;
            contact?: string | undefined;
            introduced_by?: string | undefined;
            next_action?: string | undefined;
            next_action_date?: string | undefined;
            committed_amount?: number | undefined;
        }, {
            name: string;
            status: "closed" | "active" | "paused" | "committed" | "passed";
            date_added: string;
            notes?: string | undefined;
            contact?: string | undefined;
            introduced_by?: string | undefined;
            next_action?: string | undefined;
            next_action_date?: string | undefined;
            committed_amount?: number | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        investors: {
            name: string;
            status: "closed" | "active" | "paused" | "committed" | "passed";
            date_added: string;
            notes?: string | undefined;
            contact?: string | undefined;
            introduced_by?: string | undefined;
            next_action?: string | undefined;
            next_action_date?: string | undefined;
            committed_amount?: number | undefined;
        }[];
    }, {
        name: string;
        description: string;
        investors: {
            name: string;
            status: "closed" | "active" | "paused" | "committed" | "passed";
            date_added: string;
            notes?: string | undefined;
            contact?: string | undefined;
            introduced_by?: string | undefined;
            next_action?: string | undefined;
            next_action_date?: string | undefined;
            committed_amount?: number | undefined;
        }[];
    }>, "many">;
    metrics: z.ZodObject<{
        total_contacts: z.ZodNumber;
        active_conversations: z.ZodNumber;
        term_sheets_received: z.ZodNumber;
        amount_committed: z.ZodNumber;
        days_since_start: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        total_contacts: number;
        active_conversations: number;
        term_sheets_received: number;
        amount_committed: number;
        days_since_start: number;
    }, {
        total_contacts: number;
        active_conversations: number;
        term_sheets_received: number;
        amount_committed: number;
        days_since_start: number;
    }>;
}, "strip", z.ZodTypeAny, {
    pipeline: {
        name: string;
        owner: string;
        currency: string;
        target_raise: number;
        target_close: string;
    };
    stages: {
        name: string;
        description: string;
        investors: {
            name: string;
            status: "closed" | "active" | "paused" | "committed" | "passed";
            date_added: string;
            notes?: string | undefined;
            contact?: string | undefined;
            introduced_by?: string | undefined;
            next_action?: string | undefined;
            next_action_date?: string | undefined;
            committed_amount?: number | undefined;
        }[];
    }[];
    metrics: {
        total_contacts: number;
        active_conversations: number;
        term_sheets_received: number;
        amount_committed: number;
        days_since_start: number;
    };
}, {
    pipeline: {
        name: string;
        owner: string;
        currency: string;
        target_raise: number;
        target_close: string;
    };
    stages: {
        name: string;
        description: string;
        investors: {
            name: string;
            status: "closed" | "active" | "paused" | "committed" | "passed";
            date_added: string;
            notes?: string | undefined;
            contact?: string | undefined;
            introduced_by?: string | undefined;
            next_action?: string | undefined;
            next_action_date?: string | undefined;
            committed_amount?: number | undefined;
        }[];
    }[];
    metrics: {
        total_contacts: number;
        active_conversations: number;
        term_sheets_received: number;
        amount_committed: number;
        days_since_start: number;
    };
}>;
export type Investor = z.infer<typeof InvestorSchema>;
export type Stage = z.infer<typeof StageSchema>;
export type Pipeline = z.infer<typeof PipelineSchema>;
//# sourceMappingURL=fundraising.d.ts.map