#!/usr/bin/env node
/**
 * Send an email using configured provider
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { REPO_ROOT, readYaml } from '../src/utils/files.js';
import { EmailProviderConfigSchema, EmailLogSchema, EmailTemplateSchema } from '../src/schemas/email.js';
import { getProvider, generateEmailId } from '../src/utils/email-provider.js';
import type { EmailLog, EmailTemplate, EmailProviderConfig } from '../src/schemas/email.js';

interface SendArgs {
  template?: string;
  to?: string;
  subject?: string;
  body?: string;
  from?: string;
  dryRun?: boolean;
}

function parseArgs(): SendArgs {
  const args: SendArgs = {};
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg.startsWith('--template=')) args.template = arg.split('=')[1];
    if (arg.startsWith('--to=')) args.to = arg.split('=')[1];
    if (arg.startsWith('--subject=')) args.subject = arg.split('=')[1];
    if (arg.startsWith('--body=')) args.body = arg.split('=')[1];
    if (arg.startsWith('--from=')) args.from = arg.split('=')[1];
    if (arg === '--dry-run') args.dryRun = true;
  }
  return args;
}

const args = parseArgs();

// Load config
const configPath = join(REPO_ROOT, 'email', 'config', 'provider.yaml');
if (!existsSync(configPath)) {
  console.error('❌ Email provider config not found. Run: pnpm email:config');
  process.exit(1);
}

const config = EmailProviderConfigSchema.parse(readYaml(configPath));
console.log(`📧 Email provider: ${config.provider}\n`);

// Build the email
let log: EmailLog;

if (args.template) {
  // Template-based email
  const templatePath = join(REPO_ROOT, 'email', 'templates', `${args.template}.yaml`);
  if (!existsSync(templatePath)) {
    console.error(`❌ Template not found: ${args.template}`);
    console.error('Available templates:');
    process.exit(1);
  }

  const template = EmailTemplateSchema.parse(readYaml(templatePath));
  
  if (!args.to) {
    console.error('❌ --to is required when using a template');
    process.exit(1);
  }

  log = EmailLogSchema.parse({
    id: generateEmailId(),
    template_id: template.id,
    to: [args.to],
    from: args.from || config.from_address,
    subject: template.subject,
    body_preview: template.body_text.substring(0, 200),
    sent_at: new Date().toISOString(),
    status: 'queued',
    metadata: { template: template.id, variables: template.variables },
  });
} else if (args.subject && args.body && args.to) {
  // Ad-hoc email
  log = EmailLogSchema.parse({
    id: generateEmailId(),
    to: [args.to],
    from: args.from || config.from_address,
    subject: args.subject,
    body_preview: args.body.substring(0, 200),
    sent_at: new Date().toISOString(),
    status: 'queued',
  });
} else {
  console.log('Usage: pnpm email:send [options]\n');
  console.log('Template mode:');
  console.log('  pnpm email:send --template=investor-update --to="jane@example.com"');
  console.log('');
  console.log('Ad-hoc mode:');
  console.log('  pnpm email:send --to="jane@example.com" --subject="Hello" --body="Message"');
  console.log('');
  console.log('Options:');
  console.log('  --template=<id>     Template ID from email/templates/');
  console.log('  --to=<email>        Recipient email');
  console.log('  --subject=<text>    Email subject (ad-hoc only)');
  console.log('  --body=<text>       Email body (ad-hoc only)');
  console.log('  --from=<email>      Override from address');
  console.log('  --dry-run           Log only, do not send');
  process.exit(0);
}

// Show preview
console.log('Email Preview:');
console.log(`  To: ${log.to.join(', ')}`);
console.log(`  From: ${log.from}`);
console.log(`  Subject: ${log.subject}`);
console.log(`  Preview: ${log.body_preview}`);
console.log('');

if (args.dryRun) {
  console.log('🧪 Dry run — email logged but not sent');
  log.status = 'sent';
} else {
  // Send via provider
  const provider = getProvider(config);
  const result = await provider.send(log, config);

  if (result.success) {
    console.log('✅ Email sent');
    log.status = 'sent';
    log.provider_message_id = result.messageId;
  } else {
    console.error(`❌ Failed to send: ${result.error}`);
    log.status = 'failed';
    log.error = result.error;
    process.exit(1);
  }
}

// Log to file
const logDir = join(REPO_ROOT, 'email', 'sent');
const logPath = join(logDir, `${log.id}.json`);
writeFileSync(logPath, JSON.stringify(log, null, 2));
console.log(`📝 Logged to ${logPath}`);
