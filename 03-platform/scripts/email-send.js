#!/usr/bin/env node
/**
 * Send an email using configured provider (Gmail API, webhook, or mock)
 */
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { domainPath, REPO_ROOT, readYaml } from '../src/utils/files.js';
import { EmailProviderConfigSchema, EmailLogSchema, EmailTemplateSchema } from '../src/schemas/email.js';
import { GmailClient } from '../src/utils/gmail-client.js';
import { getProvider, generateEmailId } from '../src/utils/email-provider.js';
function parseArgs() {
    const args = { labels: [] };
    for (let i = 2; i < process.argv.length; i++) {
        const arg = process.argv[i];
        if (arg.startsWith('--template='))
            args.template = arg.split('=')[1];
        if (arg.startsWith('--to='))
            args.to = arg.split('=')[1];
        if (arg.startsWith('--subject='))
            args.subject = arg.split('=')[1];
        if (arg.startsWith('--body='))
            args.body = arg.split('=')[1];
        if (arg.startsWith('--from='))
            args.from = arg.split('=')[1];
        if (arg.startsWith('--label='))
            args.labels.push(arg.split('=')[1]);
        if (arg === '--dry-run')
            args.dryRun = true;
    }
    return args;
}
const args = parseArgs();
// Load config
const configPath = domainPath('email', 'config', 'provider.yaml');
if (!existsSync(configPath)) {
    console.error('❌ Email provider config not found. Run: pnpm email:config');
    process.exit(1);
}
const config = EmailProviderConfigSchema.parse(readYaml(configPath));
console.log(`📧 Email provider: ${config.provider}\n`);
// Build the email
let log;
let template;
if (args.template) {
    const templatePath = domainPath('email', 'templates', `${args.template}.yaml`);
    if (!existsSync(templatePath)) {
        console.error(`❌ Template not found: ${args.template}`);
        console.error('Available templates:');
        const templatesDir = domainPath('email', 'templates');
        if (existsSync(templatesDir)) {
            const { readdirSync } = await import('fs');
            for (const f of readdirSync(templatesDir)) {
                console.error(`  - ${f.replace('.yaml', '')}`);
            }
        }
        process.exit(1);
    }
    template = EmailTemplateSchema.parse(readYaml(templatePath));
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
}
else if (args.subject && args.body && args.to) {
    log = EmailLogSchema.parse({
        id: generateEmailId(),
        to: [args.to],
        from: args.from || config.from_address,
        subject: args.subject,
        body_preview: args.body.substring(0, 200),
        sent_at: new Date().toISOString(),
        status: 'queued',
    });
}
else {
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
    console.log('  --label=<label>     Gmail label to apply');
    console.log('  --dry-run           Log only, do not send');
    process.exit(0);
}
// Show preview
console.log('Email Preview:');
console.log(`  To: ${log.to.join(', ')}`);
console.log(`  From: ${log.from}`);
console.log(`  Subject: ${log.subject}`);
console.log(`  Preview: ${log.body_preview}`);
if (args.labels && args.labels.length > 0) {
    console.log(`  Labels: ${args.labels.join(', ')}`);
}
console.log('');
if (args.dryRun) {
    console.log('🧪 Dry run — email logged but not sent');
    log.status = 'sent';
}
else {
    try {
        if (config.provider === 'gmail') {
            // Use Gmail API
            const gmailConfig = {
                credentialsPath: '.secrets/gmail-credentials.json',
                scopes: [
                    'https://www.googleapis.com/auth/gmail.send',
                    'https://www.googleapis.com/auth/gmail.modify',
                ],
            };
            const gmail = new GmailClient(gmailConfig);
            const result = await gmail.send({
                to: log.to,
                cc: log.cc,
                bcc: log.bcc,
                from: log.from,
                fromName: config.from_name,
                replyTo: config.reply_to,
                subject: log.subject,
                bodyText: template?.body_text || args.body || '',
                labels: args.labels,
            });
            console.log('✅ Email sent via Gmail API');
            log.status = 'sent';
            log.provider_message_id = result.messageId;
        }
        else {
            // Use generic provider (mock, webhook, resend, etc.)
            const provider = getProvider(config);
            const result = await provider.send(log, config);
            if (result.success) {
                console.log('✅ Email sent');
                log.status = 'sent';
                log.provider_message_id = result.messageId;
            }
            else {
                console.error(`❌ Failed to send: ${result.error}`);
                log.status = 'failed';
                log.error = result.error;
                process.exit(1);
            }
        }
    }
    catch (e) {
        console.error(`❌ Failed to send: ${e}`);
        log.status = 'failed';
        log.error = String(e);
        process.exit(1);
    }
}
// Log to file
const logDir = domainPath('email', 'sent');
const logPath = join(logDir, `${log.id}.json`);
writeFileSync(logPath, JSON.stringify(log, null, 2));
console.log(`📝 Logged to ${logPath}`);
//# sourceMappingURL=email-send.js.map