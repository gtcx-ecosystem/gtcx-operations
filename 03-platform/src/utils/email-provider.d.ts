import type { EmailProviderConfig, EmailLog } from '../schemas/email.js';
export interface SendResult {
    success: boolean;
    messageId?: string;
    error?: string;
}
export interface EmailProvider {
    send(log: EmailLog, config: EmailProviderConfig): Promise<SendResult>;
}
export declare class MockProvider implements EmailProvider {
    send(log: EmailLog): Promise<SendResult>;
}
export declare class WebhookProvider implements EmailProvider {
    send(log: EmailLog, config: EmailProviderConfig): Promise<SendResult>;
}
export declare class ResendProvider implements EmailProvider {
    send(log: EmailLog, config: EmailProviderConfig): Promise<SendResult>;
}
export declare function getProvider(config: EmailProviderConfig): EmailProvider;
export declare function generateEmailId(): string;
export declare function generateCampaignId(): string;
//# sourceMappingURL=email-provider.d.ts.map