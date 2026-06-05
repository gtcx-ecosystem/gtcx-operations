import { describe, it, expect } from 'vitest';
import { EmailTemplateSchema, EmailLogSchema, EmailProviderConfigSchema } from '../03-platform/src/schemas/email.js';
describe('EmailTemplateSchema', () => {
    it('accepts a valid template', () => {
        const template = {
            id: 'investor-update',
            name: 'Monthly Investor Update',
            category: 'fundraising',
            subject: 'GTCX Protocol — {{month}} Update',
            body_text: 'Hi {{first_name}},\n\nHere is the update.',
            variables: ['first_name', 'month'],
        };
        expect(EmailTemplateSchema.safeParse(template).success).toBe(true);
    });
    it('rejects template with empty subject', () => {
        const bad = {
            id: 'test',
            name: 'Test',
            subject: '',
            body_text: 'Hello',
        };
        expect(EmailTemplateSchema.safeParse(bad).success).toBe(false);
    });
});
describe('EmailLogSchema', () => {
    it('accepts a valid email log', () => {
        const log = {
            id: 'EML-ABC123',
            to: ['test@example.com'],
            from: 'ops@gtcx.trade',
            subject: 'Test',
            body_preview: 'Hello world',
            sent_at: '2026-05-17T10:00:00Z',
            status: 'sent',
        };
        expect(EmailLogSchema.safeParse(log).success).toBe(true);
    });
    it('rejects invalid email log ID', () => {
        const bad = {
            id: 'INVALID',
            to: ['test@example.com'],
            from: 'ops@gtcx.trade',
            subject: 'Test',
            body_preview: 'Hello',
            sent_at: '2026-05-17T10:00:00Z',
        };
        expect(EmailLogSchema.safeParse(bad).success).toBe(false);
    });
});
describe('EmailProviderConfigSchema', () => {
    it('accepts mock provider config', () => {
        const config = {
            provider: 'mock',
            from_address: 'ops@gtcx.trade',
        };
        expect(EmailProviderConfigSchema.safeParse(config).success).toBe(true);
    });
    it('rejects unknown provider', () => {
        const bad = {
            provider: 'unknown',
            from_address: 'ops@gtcx.trade',
        };
        expect(EmailProviderConfigSchema.safeParse(bad).success).toBe(false);
    });
});
//# sourceMappingURL=email.test.js.map