import { z } from 'zod';
export const IpAssetSchema = z.object({
    id: z.string().regex(/^IP-\d{3}$/),
    type: z.enum(['patent', 'trademark', 'trade_secret', 'copyright']),
    title: z.string().min(1),
    status: z.enum(['draft', 'filed', 'pending', 'registered', 'active', 'expired', 'abandoned']),
    jurisdiction: z.string().min(1),
    filing_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
    grant_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
    expiry_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
    owner: z.string().min(1),
    inventors: z.array(z.string()).optional(),
    classes: z.array(z.string()).optional(),
    priority: z.enum(['critical', 'high', 'medium', 'low']),
    next_action: z.string().min(1),
    next_action_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export const IpRegistrySchema = z.object({
    version: z.string(),
    last_updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    assets: z.array(IpAssetSchema),
});
//# sourceMappingURL=ip-asset.js.map