/**
 * WhatsApp Business API client
 * Supports Twilio, Meta Cloud API, and mock providers
 */
import type { WhatsAppProvider, WhatsAppMessage, WhatsAppTemplate } from '../schemas/whatsapp.js';
export interface WhatsAppSendResult {
    success: boolean;
    messageId?: string;
    error?: string;
}
export interface WhatsAppClient {
    send(message: WhatsAppMessage, config: WhatsAppProvider): Promise<WhatsAppSendResult>;
    sendTemplate(to: string, template: WhatsAppTemplate, variables: Record<string, string>, config: WhatsAppProvider): Promise<WhatsAppSendResult>;
}
export declare class MockWhatsAppClient implements WhatsAppClient {
    send(message: WhatsAppMessage): Promise<WhatsAppSendResult>;
    sendTemplate(to: string, template: WhatsAppTemplate, variables: Record<string, string>): Promise<WhatsAppSendResult>;
}
export declare class TwilioWhatsAppClient implements WhatsAppClient {
    send(message: WhatsAppMessage, config: WhatsAppProvider): Promise<WhatsAppSendResult>;
    sendTemplate(to: string, template: WhatsAppTemplate, variables: Record<string, string>, config: WhatsAppProvider): Promise<WhatsAppSendResult>;
}
export declare class MetaWhatsAppClient implements WhatsAppClient {
    send(message: WhatsAppMessage, config: WhatsAppProvider): Promise<WhatsAppSendResult>;
    sendTemplate(to: string, template: WhatsAppTemplate, variables: Record<string, string>, config: WhatsAppProvider): Promise<WhatsAppSendResult>;
}
export declare function getWhatsAppClient(config: WhatsAppProvider): WhatsAppClient;
export declare function generateWhatsAppId(): string;
//# sourceMappingURL=whatsapp-client.d.ts.map