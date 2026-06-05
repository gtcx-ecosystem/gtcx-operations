import { z } from 'zod';
export declare const LineItemSchema: z.ZodObject<{
    item: z.ZodString;
    budget: z.ZodNumber;
    spent: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    item: string;
    budget: number;
    spent: number;
}, {
    item: string;
    budget: number;
    spent: number;
}>;
export declare const BudgetCategorySchema: z.ZodObject<{
    name: z.ZodString;
    budget: z.ZodNumber;
    spent: z.ZodNumber;
    forecast: z.ZodNumber;
    line_items: z.ZodOptional<z.ZodArray<z.ZodObject<{
        item: z.ZodString;
        budget: z.ZodNumber;
        spent: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        item: string;
        budget: number;
        spent: number;
    }, {
        item: string;
        budget: number;
        spent: number;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    budget: number;
    spent: number;
    forecast: number;
    line_items?: {
        item: string;
        budget: number;
        spent: number;
    }[] | undefined;
}, {
    name: string;
    budget: number;
    spent: number;
    forecast: number;
    line_items?: {
        item: string;
        budget: number;
        spent: number;
    }[] | undefined;
}>;
export declare const BudgetSchema: z.ZodObject<{
    quarter: z.ZodString;
    period: z.ZodObject<{
        start: z.ZodString;
        end: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        start: string;
        end: string;
    }, {
        start: string;
        end: string;
    }>;
    currency: z.ZodString;
    owner: z.ZodString;
    version: z.ZodString;
    categories: z.ZodRecord<z.ZodString, z.ZodObject<{
        name: z.ZodString;
        budget: z.ZodNumber;
        spent: z.ZodNumber;
        forecast: z.ZodNumber;
        line_items: z.ZodOptional<z.ZodArray<z.ZodObject<{
            item: z.ZodString;
            budget: z.ZodNumber;
            spent: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            item: string;
            budget: number;
            spent: number;
        }, {
            item: string;
            budget: number;
            spent: number;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        budget: number;
        spent: number;
        forecast: number;
        line_items?: {
            item: string;
            budget: number;
            spent: number;
        }[] | undefined;
    }, {
        name: string;
        budget: number;
        spent: number;
        forecast: number;
        line_items?: {
            item: string;
            budget: number;
            spent: number;
        }[] | undefined;
    }>>;
    alerts: z.ZodOptional<z.ZodObject<{
        threshold_percent: z.ZodNumber;
        notify: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        threshold_percent: number;
        notify: string[];
    }, {
        threshold_percent: number;
        notify: string[];
    }>>;
    total: z.ZodObject<{
        budget: z.ZodNumber;
        spent: z.ZodNumber;
        forecast: z.ZodNumber;
        remaining: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        budget: number;
        spent: number;
        forecast: number;
        remaining: number;
    }, {
        budget: number;
        spent: number;
        forecast: number;
        remaining: number;
    }>;
}, "strip", z.ZodTypeAny, {
    total: {
        budget: number;
        spent: number;
        forecast: number;
        remaining: number;
    };
    version: string;
    owner: string;
    quarter: string;
    period: {
        start: string;
        end: string;
    };
    currency: string;
    categories: Record<string, {
        name: string;
        budget: number;
        spent: number;
        forecast: number;
        line_items?: {
            item: string;
            budget: number;
            spent: number;
        }[] | undefined;
    }>;
    alerts?: {
        threshold_percent: number;
        notify: string[];
    } | undefined;
}, {
    total: {
        budget: number;
        spent: number;
        forecast: number;
        remaining: number;
    };
    version: string;
    owner: string;
    quarter: string;
    period: {
        start: string;
        end: string;
    };
    currency: string;
    categories: Record<string, {
        name: string;
        budget: number;
        spent: number;
        forecast: number;
        line_items?: {
            item: string;
            budget: number;
            spent: number;
        }[] | undefined;
    }>;
    alerts?: {
        threshold_percent: number;
        notify: string[];
    } | undefined;
}>;
export type Budget = z.infer<typeof BudgetSchema>;
export type BudgetCategory = z.infer<typeof BudgetCategorySchema>;
export type LineItem = z.infer<typeof LineItemSchema>;
//# sourceMappingURL=budget.d.ts.map