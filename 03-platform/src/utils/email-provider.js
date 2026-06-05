export class MockProvider {
    async send(log) {
        console.log(`[MOCK] Would send email to ${log.to.join(', ')}`);
        console.log(`       Subject: ${log.subject}`);
        console.log(`       Preview: ${log.body_preview}`);
        return { success: true, messageId: `mock-${log.id}` };
    }
}
export class WebhookProvider {
    async send(log, config) {
        if (!config.webhook_url) {
            return { success: false, error: 'No webhook_url configured' };
        }
        try {
            const response = await fetch(config.webhook_url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: log.to,
                    cc: log.cc,
                    bcc: log.bcc,
                    from: log.from,
                    subject: log.subject,
                    body: log.body_preview,
                    metadata: log.metadata,
                }),
            });
            if (!response.ok) {
                return { success: false, error: `Webhook returned ${response.status}` };
            }
            const data = await response.json();
            return { success: true, messageId: data.messageId };
        }
        catch (e) {
            return { success: false, error: String(e) };
        }
    }
}
export class ResendProvider {
    async send(log, config) {
        const apiKey = process.env[config.api_key_env];
        if (!apiKey) {
            return { success: false, error: `Missing env var: ${config.api_key_env}` };
        }
        try {
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: `${config.from_name} <${config.from_address}>`,
                    to: log.to,
                    cc: log.cc.length > 0 ? log.cc : undefined,
                    bcc: log.bcc.length > 0 ? log.bcc : undefined,
                    reply_to: config.reply_to,
                    subject: log.subject,
                    text: log.body_preview,
                }),
            });
            if (!response.ok) {
                const error = await response.text();
                return { success: false, error: `Resend API error: ${error}` };
            }
            const data = await response.json();
            return { success: true, messageId: data.id };
        }
        catch (e) {
            return { success: false, error: String(e) };
        }
    }
}
export function getProvider(config) {
    switch (config.provider) {
        case 'webhook':
            return new WebhookProvider();
        case 'resend':
            return new ResendProvider();
        case 'mock':
        default:
            return new MockProvider();
    }
}
export function generateEmailId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'EML-';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
export function generateCampaignId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'CAMP-';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
//# sourceMappingURL=email-provider.js.map