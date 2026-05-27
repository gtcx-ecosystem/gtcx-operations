import { describe, it, expect } from 'vitest';
import { BudgetSchema, LineItemSchema } from '../src/schemas/budget.js';

const validBudget = {
  quarter: 'Q2-2026',
  period: { start: '2026-04-01', end: '2026-06-30' },
  currency: 'USD',
  owner: 'finance@gtcx.io',
  version: '1.0',
  categories: {
    engineering: {
      name: 'Engineering',
      budget: 100000,
      spent: 50000,
      forecast: 95000,
      line_items: [
        { item: 'Salaries', budget: 80000, spent: 40000 },
      ],
    },
  },
  total: {
    budget: 100000,
    spent: 50000,
    forecast: 95000,
    remaining: 50000,
  },
};

describe('BudgetSchema', () => {
  it('accepts a valid budget', () => {
    expect(BudgetSchema.safeParse(validBudget).success).toBe(true);
  });

  it('rejects invalid quarter format', () => {
    const bad = { ...validBudget, quarter: 'Invalid' };
    expect(BudgetSchema.safeParse(bad).success).toBe(false);
  });

  it('rejects negative budget', () => {
    const bad = {
      ...validBudget,
      categories: {
        engineering: {
          ...validBudget.categories.engineering,
          budget: -100,
        },
      },
    };
    expect(BudgetSchema.safeParse(bad).success).toBe(false);
  });

  it('rejects invalid email', () => {
    const bad = { ...validBudget, owner: 'not-an-email' };
    expect(BudgetSchema.safeParse(bad).success).toBe(false);
  });
});

describe('LineItemSchema', () => {
  it('accepts a valid line item', () => {
    expect(LineItemSchema.safeParse({ item: 'Test', budget: 100, spent: 50 }).success).toBe(true);
  });

  it('rejects empty item name', () => {
    expect(LineItemSchema.safeParse({ item: '', budget: 100, spent: 50 }).success).toBe(false);
  });
});
