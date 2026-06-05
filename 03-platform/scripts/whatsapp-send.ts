#!/usr/bin/env node
/**
 * Send WhatsApp messages using Twilio, Meta Cloud API, or mock
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { REPO_ROOT, readYaml } from '../03-platform/src/utils/files.js';
import { WhatsAppProviderSchema, WhatsAppMessageSchema, WhatsAppTemplateSchema } from '../03-platform/src/schemas/whatsapp.js';
import { getWhatsAppClient, generateWhatsAppId } from '../03-platform/src/utils/whatsapp-client.js';
import type { WhatsAppMessage, WhatsAppTemplate, WhatsAppProvider } from '../03-platform/src/schemas/whatsapp.js';

interface SendArgs {
  template?: string;
  to?: string;
  body?: string;
  dryRun?: boolean;
  variables?: Record<string, string>;
}

function parseArgs(): SendArgs {
  const args: SendArgs = { variables: {} };
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg.startsWith('--template=')) args.template = arg.split('=')[1];
    if (arg.startsWith('--to=')) args.to = arg.split('=')[1];
    if (arg.startsWith('--body=')) args.body = arg.split('=')[1];
    if (arg.startsWith('--var-')) {
      const [key, value] = arg.substring(6).split('=');
      if (key && value) args.variables![key] = value;
    }
    if (arg === '--dry-run') args.dryRun = true;
  }
  return args;
}

const args = parseArgs();

// Load config
const configPath = join(REPO_ROOT, 'whatsapp', 'config', 'provider.yaml');
if (!existsSync(configPath)) {
  console.error('❌ WhatsApp config not found');
  process.exit(1);
}

const config = WhatsAppProviderSchema.parse(readYaml(configPath));
console.log(`📱 WhatsApp provider: ${config.provider}`);
console.log(`   From: ${config.from_number}\n`);

// Build message
let message: WhatsAppMessage;
let template: WhatsAppTemplate | undefined;

if (args.template) {
  const templatePath = join(REPO_ROOT, 'whatsapp', 'templates', `${args.template}.yaml`);
  if (!existsSync(templatePath)) {
    console.error(`❌ Template not found: ${args.template}`);
    console.error('Available:');
    const templatesDir = join(REPO_ROOT, 'whatsapp', 'templates');
    if (existsSync(templatesDir)) {
      const { readdirSync } = await import('fs');
      for (const f of readdirSync(templatesDir)) {
        if (f.endsWith('.yaml')) console.error(`  - ${f.replace('.yaml', '')}`);
      }
    }
    process.exit(1);
  }

  template = WhatsAppTemplateSchema.parse(readYaml(templatePath));

  if (!args.to) {
    console.error('❌ --to is required (E.164 format: +1234567890)');
    process.exit(1);
  }

  // Build body from template
  let body = template.components.find((c) => c.type === 'body')?.text || '';
  for (const [key, value] of Object.entries(args.variables || {})) {
    body = body.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }

  message = WhatsAppMessageSchema.parse({
    id: generateWhatsAppId(),
    template_id: template.id,
    to: args.to,
    from: config.from_number,
    type: 'template',
    body,
    sent_at: new Date().toISOString(),
    status: 'queued',
    metadata: { template: template.id, variables: args.variables },
  });
} else if (args.body && args.to) {
  message = WhatsAppMessageSchema.parse({
    id: generateWhatsAppId(),
    to: args.to,
    from: config.from_number,
    type: 'text',
    body: args.body,
    sent_at: new Date().toISOString(),
    status: 'queued',
  });
} else {
  console.log('Usage: pnpm whatsapp:send [options]\n');
  console.log('Template mode:');
  console.log('  pnpm whatsapp:send --template=investor-update --to="+1234567890"');
  console.log('    --var-first_name="Jane" --var-month="May"');
  console.log('');
  console.log('Ad-hoc mode:');
  console.log('  pnpm whatsapp:send --to="+1234567890" --body="Hello"');
  console.log('');
  console.log('Options:');
  console.log('  --template=<id>        Template from whatsapp/templates/');
  console.log('  --to=<number>          E.164 phone number (+1234567890)');
  console.log('  --body=<text>          Ad-hoc message text');
  console.log('  --var-<name>=<value>   Template variable replacement');
  console.log('  --dry-run              Preview without sending');
  process.exit(0);
}

// Preview
console.log('Message Preview:');
console.log(`  To: ${message.to}`);
console.log(`  From: ${message.from}`);
console.log(`  Type: ${message.type}`);
console.log(`  Body: ${message.body.substring(0, 200)}`);
console.log('');

if (args.dryRun) {
  console.log('🧪 Dry run — logged but not sent');
  message.status = 'sent';
} else {
  const client = getWhatsAppClient(config);

  try {
    let result: { success: boolean; messageId?: string; error?: string };

    if (template && config.provider === 'meta') {
      result = await client.sendTemplate(message.to, template, args.variables || {}, config);
    } else {
      result = await client.send(message, config);
    }

    if (result.success) {
      console.log('✅ WhatsApp sent');
      message.status = 'sent';
      message.provider_message_id = result.messageId;
    } else {
      console.error(`❌ Failed: ${result.error}`);
      message.status = 'failed';
      message.error = result.error;
      process.exit(1);
    }
  } catch (e) {
    console.error(`❌ Failed: ${e}`);
    message.status = 'failed';
    message.error = String(e);
    process.exit(1);
  }
}

// Log
const logDir = join(REPO_ROOT, 'whatsapp', 'sent');
const logPath = join(logDir, `${message.id}.json`);
writeFileSync(logPath, JSON.stringify(message, null, 2));
console.log(`📝 Logged to ${logPath}`);
