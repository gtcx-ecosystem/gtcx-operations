import { describe, it, expect } from 'vitest';
import { CrmContactSchema, CrmCompanySchema, CrmInteractionSchema } from '../03-platform/src/schemas/crm.js';
describe('CrmContactSchema', () => {
    it('accepts a valid contact', () => {
        const contact = {
            id: 'CNT-ABC123',
            email: 'jane@example.com',
            first_name: 'Jane',
            last_name: 'Doe',
            created_at: '2026-05-17T00:00:00Z',
        };
        expect(CrmContactSchema.safeParse(contact).success).toBe(true);
    });
    it('rejects invalid contact ID', () => {
        const bad = {
            id: 'INVALID',
            email: 'jane@example.com',
            first_name: 'Jane',
            last_name: 'Doe',
            created_at: '2026-05-17T00:00:00Z',
        };
        expect(CrmContactSchema.safeParse(bad).success).toBe(false);
    });
    it('rejects invalid email', () => {
        const bad = {
            id: 'CNT-ABC123',
            email: 'not-an-email',
            first_name: 'Jane',
            last_name: 'Doe',
            created_at: '2026-05-17T00:00:00Z',
        };
        expect(CrmContactSchema.safeParse(bad).success).toBe(false);
    });
});
describe('CrmCompanySchema', () => {
    it('accepts a valid company', () => {
        const company = {
            id: 'CO-ABC123',
            name: 'Example Ventures',
            type: 'investor',
            status: 'active',
            created_at: '2026-05-17T00:00:00Z',
        };
        expect(CrmCompanySchema.safeParse(company).success).toBe(true);
    });
});
describe('CrmInteractionSchema', () => {
    it('accepts a valid interaction', () => {
        const interaction = {
            id: 'INT-ABC123',
            contact_id: 'CNT-ABC123',
            type: 'email',
            subject: 'Follow-up',
            date: '2026-05-17T10:00:00Z',
        };
        expect(CrmInteractionSchema.safeParse(interaction).success).toBe(true);
    });
    it('rejects invalid interaction type', () => {
        const bad = {
            id: 'INT-ABC123',
            contact_id: 'CNT-ABC123',
            type: 'invalid',
            subject: 'Test',
            date: '2026-05-17T10:00:00Z',
        };
        expect(CrmInteractionSchema.safeParse(bad).success).toBe(false);
    });
});
//# sourceMappingURL=crm.test.js.map