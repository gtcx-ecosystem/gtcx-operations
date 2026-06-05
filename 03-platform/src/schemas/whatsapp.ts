import { z } from 'zod';

export const WhatsAppProviderSchema = z.object({
  provider: z.enum(['twilio', 'meta', 'mock']),
  phone_number_id: z.string().optional(), // Meta Cloud API
  account_sid: z.string().optional(),       // Twilio
  auth_token_env: z.string().default('WHATSAPP_AUTH_TOKEN'),
  api_key_env: z.string().default('WHATSAPP_API_KEY'),
  from_number: z.string().regex(/^\+\d{10,15}$/), // E.164 format
  webhook_url: z.string().url().optional(),
  webhook_verify_token_env: z.string().default('WHATSAPP_VERIFY_TOKEN'),
  template_namespace: z.string().optional(), // Meta template namespace
});

export const WhatsAppTemplateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.enum(['fundraising', 'legal', 'hr', 'ops', 'bd', 'general']).default('general'),
  language: z.string().default('en'),
  // Meta requires pre-approved templates with placeholders
  components: z.array(z.object({
    type: z.enum(['header', 'body', 'footer', 'button']),
    format: z.enum(['text', 'image', 'document', 'video']).optional(),
    text: z.string().min(1),
    example: z.object({
      body_text: z.array(z.string()).optional(),
      header_text: z.array(z.string()).optional(),
    }).optional(),
    buttons: z.array(z.object({
      type: z.enum(['quick_reply', 'url', 'phone_number']),
      text: z.string(),
      url: z.string().optional(),
      phone_number: z.string().optional(),
    })).optional(),
  })).min(1),
  variables: z.array(z.string()).default([]),
  status: z.enum(['draft', 'pending_approval', 'approved', 'rejected']).default('draft'),
});

export const WhatsAppMessageSchema = z.object({
  id: z.string().regex(/^WA-[A-Z0-9]{6}$/),
  template_id: z.string().optional(),
  campaign_id: z.string().optional(),
  to: z.string().regex(/^\+\d{10,15}$/), // E.164
  from: z.string().regex(/^\+\d{10,15}$/),
  type: z.enum(['text', 'template', 'image', 'document', 'audio', 'video', 'location', 'interactive']),
  body: z.string(),
  media_url: z.string().url().optional(),
  caption: z.string().optional(),
  sent_at: z.string().datetime(),
  status: z.enum(['queued', 'sent', 'delivered', 'read', 'failed']).default('queued'),
  provider_message_id: z.string().optional(),
  error: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export const WhatsAppIncomingSchema = z.object({
  id: z.string(),
  from: z.string().regex(/^\+\d{10,15}$/),
  to: z.string().regex(/^\+\d{10,15}$/),
  type: z.enum(['text', 'image', 'document', 'audio', 'video', 'location', 'interactive', 'button', 'reaction']),
  body: z.string(),
  timestamp: z.string().datetime(),
  profile_name: z.string().optional(),
  context: z.object({
    message_id: z.string().optional(),
    from: z.string().optional(),
  }).optional(),
  processed: z.boolean().default(false),
  processed_at: z.string().datetime().optional(),
  response: z.string().optional(),
});

export const WhatsAppCampaignSchema = z.object({
  id: z.string().regex(/^WA-CAMP-[A-Z0-9]{6}$/),
  name: z.string().min(1),
  template_id: z.string(),
  audience: z.array(z.string().regex(/^\+\d{10,15}$/)),
  status: z.enum(['draft', 'scheduled', 'sending', 'sent', 'paused']).default('draft'),
  scheduled_at: z.string().datetime().optional(),
  stats: z.object({
    total: z.number().default(0),
    sent: z.number().default(0),
    delivered: z.number().default(0),
    read: z.number().default(0),
    failed: z.number().default(0),
  }).default({}),
});

export type WhatsAppProvider = z.infer<typeof WhatsAppProviderSchema>;
export type WhatsAppTemplate = z.infer<typeof WhatsAppTemplateSchema>;
export type WhatsAppMessage = z.infer<typeof WhatsAppMessageSchema>;
export type WhatsAppIncoming = z.infer<typeof WhatsAppIncomingSchema>;
export type WhatsAppCampaign = z.infer<typeof WhatsAppCampaignSchema>;
