import { z } from 'zod';
/**
 * Unified Communication Thread
 * Aggregates all touchpoints with a contact across Email, WhatsApp, Calendar, CRM
 */
export const ThreadMessageSchema = z.object({
    id: z.string(),
    channel: z.enum(['email', 'whatsapp', 'calendar', 'call', 'meeting', 'note']),
    direction: z.enum(['inbound', 'outbound']),
    timestamp: z.string().datetime(),
    subject: z.string().optional(),
    body: z.string(),
    from: z.string(),
    to: z.array(z.string()),
    status: z.enum(['sent', 'delivered', 'read', 'failed', 'scheduled', 'completed']).optional(),
    source_id: z.string().optional(), // Original message ID (EML-xxx, WA-xxx, etc.)
    metadata: z.record(z.string(), z.unknown()).default({}),
});
export const ThreadFollowUpSchema = z.object({
    id: z.string(),
    type: z.enum(['email', 'whatsapp', 'call', 'meeting']),
    scheduled_at: z.string().datetime(),
    action: z.string(),
    status: z.enum(['pending', 'sent', 'completed', 'cancelled']).default('pending'),
    triggered_by: z.string().optional(), // Message ID that triggered this follow-up
    auto_trigger: z.boolean().default(false),
});
export const ThreadSchema = z.object({
    id: z.string().regex(/^THR-[A-Z0-9]{6}$/),
    contact_id: z.string(),
    contact_name: z.string(),
    contact_email: z.string().email().optional(),
    contact_whatsapp: z.string().optional(),
    company_id: z.string().optional(),
    company_name: z.string().optional(),
    purpose: z.enum(['fundraising', 'legal', 'vendor', 'partner', 'general']).default('general'),
    messages: z.array(ThreadMessageSchema),
    follow_ups: z.array(ThreadFollowUpSchema).default([]),
    last_activity: z.string().datetime(),
    last_outbound: z.string().datetime().optional(),
    last_inbound: z.string().datetime().optional(),
    next_scheduled: z.string().datetime().optional(),
    status: z.enum(['active', 'stale', 'resolved', 'blocked']).default('active'),
    tags: z.array(z.string()).default([]),
    clickup_task_id: z.string().optional(),
});
export const ThreadRegistrySchema = z.object({
    version: z.string(),
    generated_at: z.string().datetime(),
    threads: z.array(ThreadSchema),
});
//# sourceMappingURL=thread.js.map