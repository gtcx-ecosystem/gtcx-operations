import { z } from 'zod';
export declare const EmailProviderConfigSchema: z.ZodObject<{
    provider: z.ZodEnum<["gmail", "resend", "sendgrid", "ses", "webhook", "mock"]>;
    api_key_env: z.ZodDefault<z.ZodString>;
    from_address: z.ZodString;
    from_name: z.ZodDefault<z.ZodString>;
    reply_to: z.ZodOptional<z.ZodString>;
    webhook_url: z.ZodOptional<z.ZodString>;
    rate_limit_per_second: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    provider: "gmail" | "resend" | "sendgrid" | "ses" | "webhook" | "mock";
    api_key_env: string;
    from_address: string;
    from_name: string;
    rate_limit_per_second: number;
    reply_to?: string | undefined;
    webhook_url?: string | undefined;
}, {
    provider: "gmail" | "resend" | "sendgrid" | "ses" | "webhook" | "mock";
    from_address: string;
    api_key_env?: string | undefined;
    from_name?: string | undefined;
    reply_to?: string | undefined;
    webhook_url?: string | undefined;
    rate_limit_per_second?: number | undefined;
}>;
export declare const EmailTemplateSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    subject: z.ZodString;
    body_html: z.ZodOptional<z.ZodString>;
    body_text: z.ZodString;
    variables: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    category: z.ZodDefault<z.ZodEnum<["fundraising", "legal", "hr", "ops", "bd", "general"]>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    subject: string;
    id: string;
    body_text: string;
    variables: string[];
    category: "legal" | "hr" | "ops" | "fundraising" | "general" | "bd";
    body_html?: string | undefined;
}, {
    name: string;
    subject: string;
    id: string;
    body_text: string;
    body_html?: string | undefined;
    variables?: string[] | undefined;
    category?: "legal" | "hr" | "ops" | "fundraising" | "general" | "bd" | undefined;
}>;
export declare const EmailLogSchema: z.ZodObject<{
    id: z.ZodString;
    template_id: z.ZodOptional<z.ZodString>;
    campaign_id: z.ZodOptional<z.ZodString>;
    to: z.ZodArray<z.ZodString, "many">;
    cc: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    bcc: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    from: z.ZodString;
    subject: z.ZodString;
    body_preview: z.ZodString;
    sent_at: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<["queued", "sent", "delivered", "bounced", "failed", "opened", "clicked"]>>;
    provider_message_id: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
    metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    subject: string;
    status: "queued" | "sent" | "failed" | "delivered" | "bounced" | "opened" | "clicked";
    id: string;
    to: string[];
    cc: string[];
    bcc: string[];
    from: string;
    body_preview: string;
    sent_at: string;
    metadata: Record<string, unknown>;
    error?: string | undefined;
    template_id?: string | undefined;
    campaign_id?: string | undefined;
    provider_message_id?: string | undefined;
}, {
    subject: string;
    id: string;
    to: string[];
    from: string;
    body_preview: string;
    sent_at: string;
    status?: "queued" | "sent" | "failed" | "delivered" | "bounced" | "opened" | "clicked" | undefined;
    error?: string | undefined;
    template_id?: string | undefined;
    campaign_id?: string | undefined;
    cc?: string[] | undefined;
    bcc?: string[] | undefined;
    provider_message_id?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
}>;
export declare const EmailCampaignSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    template_id: z.ZodString;
    audience: z.ZodArray<z.ZodString, "many">;
    status: z.ZodDefault<z.ZodEnum<["draft", "scheduled", "sending", "sent", "paused", "cancelled"]>>;
    scheduled_at: z.ZodOptional<z.ZodString>;
    sent_at: z.ZodOptional<z.ZodString>;
    stats: z.ZodDefault<z.ZodObject<{
        total: z.ZodDefault<z.ZodNumber>;
        sent: z.ZodDefault<z.ZodNumber>;
        delivered: z.ZodDefault<z.ZodNumber>;
        bounced: z.ZodDefault<z.ZodNumber>;
        opened: z.ZodDefault<z.ZodNumber>;
        clicked: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        total: number;
        sent: number;
        delivered: number;
        bounced: number;
        opened: number;
        clicked: number;
    }, {
        total?: number | undefined;
        sent?: number | undefined;
        delivered?: number | undefined;
        bounced?: number | undefined;
        opened?: number | undefined;
        clicked?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    status: "sent" | "draft" | "scheduled" | "sending" | "paused" | "cancelled";
    id: string;
    template_id: string;
    audience: string[];
    stats: {
        total: number;
        sent: number;
        delivered: number;
        bounced: number;
        opened: number;
        clicked: number;
    };
    sent_at?: string | undefined;
    scheduled_at?: string | undefined;
}, {
    name: string;
    id: string;
    template_id: string;
    audience: string[];
    status?: "sent" | "draft" | "scheduled" | "sending" | "paused" | "cancelled" | undefined;
    sent_at?: string | undefined;
    scheduled_at?: string | undefined;
    stats?: {
        total?: number | undefined;
        sent?: number | undefined;
        delivered?: number | undefined;
        bounced?: number | undefined;
        opened?: number | undefined;
        clicked?: number | undefined;
    } | undefined;
}>;
export type EmailProviderConfig = z.infer<typeof EmailProviderConfigSchema>;
export type EmailTemplate = z.infer<typeof EmailTemplateSchema>;
export type EmailLog = z.infer<typeof EmailLogSchema>;
export type EmailCampaign = z.infer<typeof EmailCampaignSchema>;
//# sourceMappingURL=email.d.ts.map