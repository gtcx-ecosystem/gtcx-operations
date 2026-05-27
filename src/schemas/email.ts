import { z } from 'zod';

export const EmailProviderConfigSchema = z.object({
  provider: z.enum(['gmail', 'resend', 'sendgrid', 'ses', 'webhook', 'mock']),
  api_key_env: z.string().default('EMAIL_API_KEY'),
  from_address: z.string().email(),
  from_name: z.string().default('GTCX Operations'),
  reply_to: z.string().email().optional(),
  webhook_url: z.string().url().optional(),
  rate_limit_per_second: z.number().min(1).default(10),
});

export const EmailTemplateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  subject: z.string().min(1),
  body_html: z.string().optional(),
  body_text: z.string().min(1),
  variables: z.array(z.string()).default([]),
  category: z.enum(['fundraising', 'legal', 'hr', 'ops', 'bd', 'general']).default('general'),
});

export const EmailLogSchema = z.object({
  id: z.string().regex(/^EML-[A-Z0-9]{6}$/),
  template_id: z.string().optional(),
  campaign_id: z.string().optional(),
  to: z.array(z.string().email()),
  cc: z.array(z.string().email()).default([]),
  bcc: z.array(z.string().email()).default([]),
  from: z.string().email(),
  subject: z.string(),
  body_preview: z.string().max(200),
  sent_at: z.string().datetime(),
  status: z.enum(['queued', 'sent', 'delivered', 'bounced', 'failed', 'opened', 'clicked']).default('queued'),
  provider_message_id: z.string().optional(),
  error: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export const EmailCampaignSchema = z.object({
  id: z.string().regex(/^CAMP-[A-Z0-9]{6}$/),
  name: z.string().min(1),
  template_id: z.string(),
  audience: z.array(z.string().email()),
  status: z.enum(['draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled']).default('draft'),
  scheduled_at: z.string().datetime().optional(),
  sent_at: z.string().datetime().optional(),
  stats: z.object({
    total: z.number().default(0),
    sent: z.number().default(0),
    delivered: z.number().default(0),
    bounced: z.number().default(0),
    opened: z.number().default(0),
    clicked: z.number().default(0),
  }).default({}),
});

export type EmailProviderConfig = z.infer<typeof EmailProviderConfigSchema>;
export type EmailTemplate = z.infer<typeof EmailTemplateSchema>;
export type EmailLog = z.infer<typeof EmailLogSchema>;
export type EmailCampaign = z.infer<typeof EmailCampaignSchema>;
