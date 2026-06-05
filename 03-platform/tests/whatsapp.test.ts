import { describe, it, expect } from 'vitest';
import { WhatsAppProviderSchema, WhatsAppTemplateSchema, WhatsAppMessageSchema } from '../src/schemas/whatsapp.js';

describe('WhatsAppProviderSchema', () => {
  it('accepts mock provider', () => {
    const config = {
      provider: 'mock',
      from_number: '+1234567890',
    };
    expect(WhatsAppProviderSchema.safeParse(config).success).toBe(true);
  });

  it('accepts meta provider with phone number ID', () => {
    const config = {
      provider: 'meta',
      from_number: '+1234567890',
      phone_number_id: '123456789012345',
      template_namespace: 'gtcx_protocol',
    };
    expect(WhatsAppProviderSchema.safeParse(config).success).toBe(true);
  });

  it('rejects invalid from number format', () => {
    const bad = {
      provider: 'mock',
      from_number: '1234567890', // missing +
    };
    expect(WhatsAppProviderSchema.safeParse(bad).success).toBe(false);
  });
});

describe('WhatsAppTemplateSchema', () => {
  it('accepts a valid template', () => {
    const template = {
      id: 'investor-update',
      name: 'investor_update_english',
      category: 'fundraising',
      language: 'en',
      status: 'approved',
      components: [
        {
          type: 'body',
          text: 'Hi {{first_name}}, here is the update.',
        },
      ],
      variables: ['first_name'],
    };
    expect(WhatsAppTemplateSchema.safeParse(template).success).toBe(true);
  });

  it('rejects template without components', () => {
    const bad = {
      id: 'test',
      name: 'test_template',
      components: [],
    };
    expect(WhatsAppTemplateSchema.safeParse(bad).success).toBe(false);
  });
});

describe('WhatsAppMessageSchema', () => {
  it('accepts a valid message', () => {
    const message = {
      id: 'WA-ABC123',
      to: '+1234567890',
      from: '+0987654321',
      type: 'text',
      body: 'Hello',
      sent_at: '2026-05-17T10:00:00Z',
    };
    expect(WhatsAppMessageSchema.safeParse(message).success).toBe(true);
  });

  it('rejects invalid message ID', () => {
    const bad = {
      id: 'INVALID',
      to: '+1234567890',
      from: '+0987654321',
      type: 'text',
      body: 'Hello',
      sent_at: '2026-05-17T10:00:00Z',
    };
    expect(WhatsAppMessageSchema.safeParse(bad).success).toBe(false);
  });
});
