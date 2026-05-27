import { z } from 'zod';

export const CrmContactSchema = z.object({
  id: z.string().regex(/^CNT-[A-Z0-9]{6}$/),
  email: z.string().email(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  title: z.string().optional(),
  phone: z.string().optional(),
  company_id: z.string().optional(),
  tags: z.array(z.string()).default([]),
  source: z.enum(['referral', 'conference', 'outbound', 'inbound', 'partner', 'other']).default('other'),
  status: z.enum(['active', 'inactive', 'do-not-contact', 'unsubscribed']).default('active'),
  created_at: z.string().datetime(),
  last_contact_at: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export const CrmCompanySchema = z.object({
  id: z.string().regex(/^CO-[A-Z0-9]{6}$/),
  name: z.string().min(1),
  domain: z.string().optional(),
  industry: z.string().optional(),
  size: z.enum(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']).optional(),
  jurisdiction: z.string().optional(),
  website: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  tags: z.array(z.string()).default([]),
  type: z.enum(['investor', 'vendor', 'partner', 'customer', 'legal', 'prospect', 'other']).default('other'),
  status: z.enum(['active', 'inactive', 'blacklisted']).default('active'),
  created_at: z.string().datetime(),
  notes: z.string().optional(),
});

export const CrmInteractionSchema = z.object({
  id: z.string().regex(/^INT-[A-Z0-9]{6}$/),
  contact_id: z.string(),
  company_id: z.string().optional(),
  type: z.enum(['email', 'call', 'meeting', 'conference', 'demo', 'proposal', 'contract', 'other']),
  direction: z.enum(['inbound', 'outbound']).default('outbound'),
  subject: z.string().min(1),
  summary: z.string().optional(),
  date: z.string().datetime(),
  duration_minutes: z.number().min(0).optional(),
  outcome: z.enum(['positive', 'neutral', 'negative', 'no-response', 'follow-up', 'closed']).optional(),
  follow_up_date: z.string().datetime().optional(),
  follow_up_action: z.string().optional(),
  related_deal_id: z.string().optional(),
  email_id: z.string().optional(),
  created_by: z.string().default('gtcx-agent'),
});

export const CrmRegistrySchema = z.object({
  version: z.string(),
  last_updated: z.string().datetime(),
  contacts: z.array(CrmContactSchema),
  companies: z.array(CrmCompanySchema),
  interactions: z.array(CrmInteractionSchema),
});

export type CrmContact = z.infer<typeof CrmContactSchema>;
export type CrmCompany = z.infer<typeof CrmCompanySchema>;
export type CrmInteraction = z.infer<typeof CrmInteractionSchema>;
export type CrmRegistry = z.infer<typeof CrmRegistrySchema>;
