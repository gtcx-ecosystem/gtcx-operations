import { describe, it, expect } from 'vitest';
import { IpAssetSchema, IpRegistrySchema } from '../src/schemas/ip-asset.js';
describe('IpAssetSchema', () => {
    it('accepts a valid patent', () => {
        const patent = {
            id: 'IP-001',
            type: 'patent',
            title: 'Test Patent',
            status: 'filed',
            jurisdiction: 'USPTO',
            filing_date: '2025-03-15',
            grant_date: null,
            expiry_date: '2045-03-15',
            owner: 'GTCX Protocol Inc.',
            priority: 'critical',
            next_action: 'Respond to office action',
            next_action_date: '2026-06-30',
        };
        expect(IpAssetSchema.safeParse(patent).success).toBe(true);
    });
    it('rejects invalid ID format', () => {
        const bad = {
            id: 'INVALID',
            type: 'patent',
            title: 'Test',
            status: 'filed',
            jurisdiction: 'USPTO',
            filing_date: null,
            grant_date: null,
            expiry_date: null,
            owner: 'GTCX',
            priority: 'critical',
            next_action: 'Test',
            next_action_date: '2026-06-30',
        };
        expect(IpAssetSchema.safeParse(bad).success).toBe(false);
    });
    it('rejects unknown type', () => {
        const bad = {
            id: 'IP-002',
            type: 'unknown',
            title: 'Test',
            status: 'filed',
            jurisdiction: 'USPTO',
            filing_date: null,
            grant_date: null,
            expiry_date: null,
            owner: 'GTCX',
            priority: 'critical',
            next_action: 'Test',
            next_action_date: '2026-06-30',
        };
        expect(IpAssetSchema.safeParse(bad).success).toBe(false);
    });
});
describe('IpRegistrySchema', () => {
    it('accepts a valid registry', () => {
        const registry = {
            version: '1.0',
            last_updated: '2026-05-17',
            assets: [],
        };
        expect(IpRegistrySchema.safeParse(registry).success).toBe(true);
    });
});
//# sourceMappingURL=ip-asset.test.js.map