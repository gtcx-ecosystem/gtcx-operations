import type { GoogleAuthConfig } from './google-auth.js';
export interface GmailSendOptions {
    to: string[];
    cc?: string[];
    bcc?: string[];
    from: string;
    fromName?: string;
    replyTo?: string;
    subject: string;
    bodyText: string;
    bodyHtml?: string;
    labels?: string[];
}
export declare class GmailClient {
    private config;
    constructor(config: GoogleAuthConfig);
    send(options: GmailSendOptions): Promise<{
        messageId: string;
        threadId: string;
    }>;
    applyLabels(messageId: string, labels: string[]): Promise<void>;
    getLabels(): Promise<Array<{
        id: string;
        name: string;
    }>>;
    search(query: string, maxResults?: number): Promise<Array<{
        id: string;
        threadId: string;
        subject: string;
        from: string;
        date: string;
        snippet: string;
    }>>;
    getThread(threadId: string): Promise<{
        messages: Array<{
            id: string;
            from: string;
            to: string;
            subject: string;
            date: string;
            body: string;
        }>;
    }>;
}
//# sourceMappingURL=gmail-client.d.ts.map