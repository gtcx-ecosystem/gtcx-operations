export class MockWhatsAppClient {
    async send(message) {
        console.log(`[MOCK] Would send WhatsApp to ${message.to}`);
        console.log(`       Type: ${message.type}`);
        console.log(`       Body: ${message.body.substring(0, 100)}`);
        return { success: true, messageId: `mock-${message.id}` };
    }
    async sendTemplate(to, template, variables) {
        console.log(`[MOCK] Would send template "${template.name}" to ${to}`);
        console.log(`       Variables: ${JSON.stringify(variables)}`);
        return { success: true, messageId: `mock-template-${template.id}` };
    }
}
export class TwilioWhatsAppClient {
    async send(message, config) {
        const authToken = process.env[config.auth_token_env];
        const accountSid = config.account_sid;
        if (!authToken || !accountSid) {
            return { success: false, error: 'Missing Twilio credentials' };
        }
        try {
            const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    From: `whatsapp:${config.from_number}`,
                    To: `whatsapp:${message.to}`,
                    Body: message.body,
                }),
            });
            if (!response.ok) {
                const error = await response.text();
                return { success: false, error: `Twilio error: ${error}` };
            }
            const data = await response.json();
            return { success: true, messageId: data.sid };
        }
        catch (e) {
            return { success: false, error: String(e) };
        }
    }
    async sendTemplate(to, template, variables, config) {
        // Twilio doesn't support WhatsApp templates directly — send as regular message
        let body = template.components.find((c) => c.type === 'body')?.text || '';
        for (const [key, value] of Object.entries(variables)) {
            body = body.replace(new RegExp(`{{${key}}}`, 'g'), value);
        }
        const message = {
            id: generateWhatsAppId(),
            to,
            from: config.from_number,
            type: 'text',
            body,
            sent_at: new Date().toISOString(),
            status: 'queued',
            metadata: { template: template.id, variables },
        };
        return this.send(message, config);
    }
}
export class MetaWhatsAppClient {
    async send(message, config) {
        const apiKey = process.env[config.api_key_env];
        if (!apiKey) {
            return { success: false, error: `Missing env var: ${config.api_key_env}` };
        }
        if (!config.phone_number_id) {
            return { success: false, error: 'Missing phone_number_id' };
        }
        try {
            const response = await fetch(`https://graph.facebook.com/v18.0/${config.phone_number_id}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    recipient_type: 'individual',
                    to: message.to,
                    type: message.type,
                    [message.type]: message.type === 'text' ? { body: message.body } : { link: message.media_url, caption: message.caption },
                }),
            });
            if (!response.ok) {
                const error = await response.text();
                return { success: false, error: `Meta API error: ${error}` };
            }
            const data = await response.json();
            return { success: true, messageId: data.messages[0]?.id };
        }
        catch (e) {
            return { success: false, error: String(e) };
        }
    }
    async sendTemplate(to, template, variables, config) {
        const apiKey = process.env[config.api_key_env];
        if (!apiKey) {
            return { success: false, error: `Missing env var: ${config.api_key_env}` };
        }
        if (!config.phone_number_id) {
            return { success: false, error: 'Missing phone_number_id' };
        }
        const bodyComponent = template.components.find((c) => c.type === 'body');
        const parameters = bodyComponent?.example?.body_text?.map((_, i) => ({
            type: 'text',
            text: variables[template.variables[i]] || '{{' + template.variables[i] + '}}',
        })) || [];
        try {
            const response = await fetch(`https://graph.facebook.com/v18.0/${config.phone_number_id}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    recipient_type: 'individual',
                    to,
                    type: 'template',
                    template: {
                        name: template.name,
                        language: { code: template.language },
                        components: parameters.length > 0 ? [{
                                type: 'body',
                                parameters,
                            }] : undefined,
                    },
                }),
            });
            if (!response.ok) {
                const error = await response.text();
                return { success: false, error: `Meta API error: ${error}` };
            }
            const data = await response.json();
            return { success: true, messageId: data.messages[0]?.id };
        }
        catch (e) {
            return { success: false, error: String(e) };
        }
    }
}
export function getWhatsAppClient(config) {
    switch (config.provider) {
        case 'twilio':
            return new TwilioWhatsAppClient();
        case 'meta':
            return new MetaWhatsAppClient();
        case 'mock':
        default:
            return new MockWhatsAppClient();
    }
}
export function generateWhatsAppId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'WA-';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
//# sourceMappingURL=whatsapp-client.js.map