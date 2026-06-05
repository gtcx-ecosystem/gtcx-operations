import { z } from 'zod';
export declare const WhatsAppProviderSchema: z.ZodObject<{
    provider: z.ZodEnum<["twilio", "meta", "mock"]>;
    phone_number_id: z.ZodOptional<z.ZodString>;
    account_sid: z.ZodOptional<z.ZodString>;
    auth_token_env: z.ZodDefault<z.ZodString>;
    api_key_env: z.ZodDefault<z.ZodString>;
    from_number: z.ZodString;
    webhook_url: z.ZodOptional<z.ZodString>;
    webhook_verify_token_env: z.ZodDefault<z.ZodString>;
    template_namespace: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    provider: "meta" | "mock" | "twilio";
    api_key_env: string;
    auth_token_env: string;
    from_number: string;
    webhook_verify_token_env: string;
    webhook_url?: string | undefined;
    phone_number_id?: string | undefined;
    account_sid?: string | undefined;
    template_namespace?: string | undefined;
}, {
    provider: "meta" | "mock" | "twilio";
    from_number: string;
    api_key_env?: string | undefined;
    webhook_url?: string | undefined;
    phone_number_id?: string | undefined;
    account_sid?: string | undefined;
    auth_token_env?: string | undefined;
    webhook_verify_token_env?: string | undefined;
    template_namespace?: string | undefined;
}>;
export declare const WhatsAppTemplateSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    category: z.ZodDefault<z.ZodEnum<["fundraising", "legal", "hr", "ops", "bd", "general"]>>;
    language: z.ZodDefault<z.ZodString>;
    components: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["header", "body", "footer", "button"]>;
        format: z.ZodOptional<z.ZodEnum<["text", "image", "document", "video"]>>;
        text: z.ZodString;
        example: z.ZodOptional<z.ZodObject<{
            body_text: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            header_text: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            body_text?: string[] | undefined;
            header_text?: string[] | undefined;
        }, {
            body_text?: string[] | undefined;
            header_text?: string[] | undefined;
        }>>;
        buttons: z.ZodOptional<z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["quick_reply", "url", "phone_number"]>;
            text: z.ZodString;
            url: z.ZodOptional<z.ZodString>;
            phone_number: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "quick_reply" | "url" | "phone_number";
            text: string;
            url?: string | undefined;
            phone_number?: string | undefined;
        }, {
            type: "quick_reply" | "url" | "phone_number";
            text: string;
            url?: string | undefined;
            phone_number?: string | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        type: "body" | "header" | "footer" | "button";
        text: string;
        format?: "text" | "image" | "document" | "video" | undefined;
        example?: {
            body_text?: string[] | undefined;
            header_text?: string[] | undefined;
        } | undefined;
        buttons?: {
            type: "quick_reply" | "url" | "phone_number";
            text: string;
            url?: string | undefined;
            phone_number?: string | undefined;
        }[] | undefined;
    }, {
        type: "body" | "header" | "footer" | "button";
        text: string;
        format?: "text" | "image" | "document" | "video" | undefined;
        example?: {
            body_text?: string[] | undefined;
            header_text?: string[] | undefined;
        } | undefined;
        buttons?: {
            type: "quick_reply" | "url" | "phone_number";
            text: string;
            url?: string | undefined;
            phone_number?: string | undefined;
        }[] | undefined;
    }>, "many">;
    variables: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    status: z.ZodDefault<z.ZodEnum<["draft", "pending_approval", "approved", "rejected"]>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    status: "draft" | "approved" | "pending_approval" | "rejected";
    id: string;
    variables: string[];
    category: "legal" | "hr" | "ops" | "fundraising" | "general" | "bd";
    language: string;
    components: {
        type: "body" | "header" | "footer" | "button";
        text: string;
        format?: "text" | "image" | "document" | "video" | undefined;
        example?: {
            body_text?: string[] | undefined;
            header_text?: string[] | undefined;
        } | undefined;
        buttons?: {
            type: "quick_reply" | "url" | "phone_number";
            text: string;
            url?: string | undefined;
            phone_number?: string | undefined;
        }[] | undefined;
    }[];
}, {
    name: string;
    id: string;
    components: {
        type: "body" | "header" | "footer" | "button";
        text: string;
        format?: "text" | "image" | "document" | "video" | undefined;
        example?: {
            body_text?: string[] | undefined;
            header_text?: string[] | undefined;
        } | undefined;
        buttons?: {
            type: "quick_reply" | "url" | "phone_number";
            text: string;
            url?: string | undefined;
            phone_number?: string | undefined;
        }[] | undefined;
    }[];
    status?: "draft" | "approved" | "pending_approval" | "rejected" | undefined;
    variables?: string[] | undefined;
    category?: "legal" | "hr" | "ops" | "fundraising" | "general" | "bd" | undefined;
    language?: string | undefined;
}>;
export declare const WhatsAppMessageSchema: z.ZodObject<{
    id: z.ZodString;
    template_id: z.ZodOptional<z.ZodString>;
    campaign_id: z.ZodOptional<z.ZodString>;
    to: z.ZodString;
    from: z.ZodString;
    type: z.ZodEnum<["text", "template", "image", "document", "audio", "video", "location", "interactive"]>;
    body: z.ZodString;
    media_url: z.ZodOptional<z.ZodString>;
    caption: z.ZodOptional<z.ZodString>;
    sent_at: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<["queued", "sent", "delivered", "read", "failed"]>>;
    provider_message_id: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
    metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    type: "template" | "text" | "image" | "document" | "video" | "audio" | "location" | "interactive";
    status: "queued" | "sent" | "failed" | "delivered" | "read";
    body: string;
    id: string;
    to: string;
    from: string;
    sent_at: string;
    metadata: Record<string, unknown>;
    error?: string | undefined;
    template_id?: string | undefined;
    campaign_id?: string | undefined;
    provider_message_id?: string | undefined;
    media_url?: string | undefined;
    caption?: string | undefined;
}, {
    type: "template" | "text" | "image" | "document" | "video" | "audio" | "location" | "interactive";
    body: string;
    id: string;
    to: string;
    from: string;
    sent_at: string;
    status?: "queued" | "sent" | "failed" | "delivered" | "read" | undefined;
    error?: string | undefined;
    template_id?: string | undefined;
    campaign_id?: string | undefined;
    provider_message_id?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
    media_url?: string | undefined;
    caption?: string | undefined;
}>;
export declare const WhatsAppIncomingSchema: z.ZodObject<{
    id: z.ZodString;
    from: z.ZodString;
    to: z.ZodString;
    type: z.ZodEnum<["text", "image", "document", "audio", "video", "location", "interactive", "button", "reaction"]>;
    body: z.ZodString;
    timestamp: z.ZodString;
    profile_name: z.ZodOptional<z.ZodString>;
    context: z.ZodOptional<z.ZodObject<{
        message_id: z.ZodOptional<z.ZodString>;
        from: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        from?: string | undefined;
        message_id?: string | undefined;
    }, {
        from?: string | undefined;
        message_id?: string | undefined;
    }>>;
    processed: z.ZodDefault<z.ZodBoolean>;
    processed_at: z.ZodOptional<z.ZodString>;
    response: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "text" | "button" | "image" | "document" | "video" | "audio" | "location" | "interactive" | "reaction";
    body: string;
    timestamp: string;
    id: string;
    to: string;
    from: string;
    processed: boolean;
    profile_name?: string | undefined;
    context?: {
        from?: string | undefined;
        message_id?: string | undefined;
    } | undefined;
    processed_at?: string | undefined;
    response?: string | undefined;
}, {
    type: "text" | "button" | "image" | "document" | "video" | "audio" | "location" | "interactive" | "reaction";
    body: string;
    timestamp: string;
    id: string;
    to: string;
    from: string;
    profile_name?: string | undefined;
    context?: {
        from?: string | undefined;
        message_id?: string | undefined;
    } | undefined;
    processed?: boolean | undefined;
    processed_at?: string | undefined;
    response?: string | undefined;
}>;
export declare const WhatsAppCampaignSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    template_id: z.ZodString;
    audience: z.ZodArray<z.ZodString, "many">;
    status: z.ZodDefault<z.ZodEnum<["draft", "scheduled", "sending", "sent", "paused"]>>;
    scheduled_at: z.ZodOptional<z.ZodString>;
    stats: z.ZodDefault<z.ZodObject<{
        total: z.ZodDefault<z.ZodNumber>;
        sent: z.ZodDefault<z.ZodNumber>;
        delivered: z.ZodDefault<z.ZodNumber>;
        read: z.ZodDefault<z.ZodNumber>;
        failed: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        total: number;
        sent: number;
        failed: number;
        delivered: number;
        read: number;
    }, {
        total?: number | undefined;
        sent?: number | undefined;
        failed?: number | undefined;
        delivered?: number | undefined;
        read?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    status: "sent" | "draft" | "scheduled" | "sending" | "paused";
    id: string;
    template_id: string;
    audience: string[];
    stats: {
        total: number;
        sent: number;
        failed: number;
        delivered: number;
        read: number;
    };
    scheduled_at?: string | undefined;
}, {
    name: string;
    id: string;
    template_id: string;
    audience: string[];
    status?: "sent" | "draft" | "scheduled" | "sending" | "paused" | undefined;
    scheduled_at?: string | undefined;
    stats?: {
        total?: number | undefined;
        sent?: number | undefined;
        failed?: number | undefined;
        delivered?: number | undefined;
        read?: number | undefined;
    } | undefined;
}>;
export type WhatsAppProvider = z.infer<typeof WhatsAppProviderSchema>;
export type WhatsAppTemplate = z.infer<typeof WhatsAppTemplateSchema>;
export type WhatsAppMessage = z.infer<typeof WhatsAppMessageSchema>;
export type WhatsAppIncoming = z.infer<typeof WhatsAppIncomingSchema>;
export type WhatsAppCampaign = z.infer<typeof WhatsAppCampaignSchema>;
//# sourceMappingURL=whatsapp.d.ts.map