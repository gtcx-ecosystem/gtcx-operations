import { z } from 'zod';

export const LineItemSchema = z.object({
  item: z.string().min(1),
  budget: z.number().min(0),
  spent: z.number().min(0),
});

export const BudgetCategorySchema = z.object({
  name: z.string().min(1),
  budget: z.number().min(0),
  spent: z.number().min(0),
  forecast: z.number().min(0),
  line_items: z.array(LineItemSchema).optional(),
});

export const BudgetSchema = z.object({
  quarter: z.string().regex(/^Q[1-4]-\d{4}$/),
  period: z.object({
    start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
  currency: z.string().min(1),
  owner: z.string().email(),
  version: z.string(),
  categories: z.record(z.string(), BudgetCategorySchema),
  alerts: z.object({
    threshold_percent: z.number().min(0).max(100),
    notify: z.array(z.string().email()),
  }).optional(),
  total: z.object({
    budget: z.number().min(0),
    spent: z.number().min(0),
    forecast: z.number().min(0),
    remaining: z.number(),
  }),
});

export type Budget = z.infer<typeof BudgetSchema>;
export type BudgetCategory = z.infer<typeof BudgetCategorySchema>;
export type LineItem = z.infer<typeof LineItemSchema>;
