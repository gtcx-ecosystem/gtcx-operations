/**
 * Gmail API client for GTCX Operations
 * Send, read, label, and track emails
 */
import { google } from 'googleapis';
import { getGmailClient } from './google-auth.js';
import type { GoogleAuthConfig } from './google-auth.js';
import type { EmailLog } from '../schemas/email.js';

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

function createMimeMessage(options: GmailSendOptions): string {
  const lines: string[] = [];
  lines.push(`To: ${options.to.join(', ')}`);
  if (options.cc && options.cc.length > 0) lines.push(`Cc: ${options.cc.join(', ')}`);
  if (options.bcc && options.bcc.length > 0) lines.push(`Bcc: ${options.bcc.join(', ')}`);
  
  const fromHeader = options.fromName 
    ? `${options.fromName} <${options.from}>` 
    : options.from;
  lines.push(`From: ${fromHeader}`);
  
  if (options.replyTo) lines.push(`Reply-To: ${options.replyTo}`);
  lines.push(`Subject: ${options.subject}`);
  lines.push('MIME-Version: 1.0');
  
  if (options.bodyHtml) {
    lines.push('Content-Type: multipart/alternative; boundary="boundary"');
    lines.push('');
    lines.push('--boundary');
    lines.push('Content-Type: text/plain; charset=UTF-8');
    lines.push('');
    lines.push(options.bodyText);
    lines.push('--boundary');
    lines.push('Content-Type: text/html; charset=UTF-8');
    lines.push('');
    lines.push(options.bodyHtml);
    lines.push('--boundary--');
  } else {
    lines.push('Content-Type: text/plain; charset=UTF-8');
    lines.push('');
    lines.push(options.bodyText);
  }
  
  return lines.join('\r\n');
}

export class GmailClient {
  private config: GoogleAuthConfig;
  
  constructor(config: GoogleAuthConfig) {
    this.config = config;
  }

  async send(options: GmailSendOptions): Promise<{ messageId: string; threadId: string }> {
    const gmail = await getGmailClient(this.config);
    const mimeMessage = createMimeMessage(options);
    const encodedMessage = Buffer.from(mimeMessage)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await gmail.users.messages.send({
      userId: this.config.userId || 'me',
      requestBody: {
        raw: encodedMessage,
        labelIds: options.labels,
      },
    });

    const messageId = response.data.id!;
    const threadId = response.data.threadId!;

    // Apply labels if specified
    if (options.labels && options.labels.length > 0) {
      await this.applyLabels(messageId, options.labels);
    }

    return { messageId, threadId };
  }

  async applyLabels(messageId: string, labels: string[]): Promise<void> {
    const gmail = await getGmailClient(this.config);
    await gmail.users.messages.modify({
      userId: this.config.userId || 'me',
      id: messageId,
      requestBody: {
        addLabelIds: labels,
      },
    });
  }

  async getLabels(): Promise<Array<{ id: string; name: string }>> {
    const gmail = await getGmailClient(this.config);
    const response = await gmail.users.labels.list({
      userId: this.config.userId || 'me',
    });
    return response.data.labels?.map((l) => ({ id: l.id!, name: l.name! })) || [];
  }

  async search(query: string, maxResults = 50): Promise<Array<{
    id: string;
    threadId: string;
    subject: string;
    from: string;
    date: string;
    snippet: string;
  }>> {
    const gmail = await getGmailClient(this.config);
    const response = await gmail.users.messages.list({
      userId: this.config.userId || 'me',
      q: query,
      maxResults,
    });

    const messages = response.data.messages || [];
    const results = [];

    for (const msg of messages) {
      if (!msg.id) continue;
      const detail = await gmail.users.messages.get({
        userId: this.config.userId || 'me',
        id: msg.id,
        format: 'metadata',
        metadataHeaders: ['Subject', 'From', 'Date'],
      });

      const headers = detail.data.payload?.headers || [];
      results.push({
        id: msg.id,
        threadId: msg.threadId || msg.id,
        subject: headers.find((h) => h.name === 'Subject')?.value || '(no subject)',
        from: headers.find((h) => h.name === 'From')?.value || '(unknown)',
        date: headers.find((h) => h.name === 'Date')?.value || '',
        snippet: detail.data.snippet || '',
      });
    }

    return results;
  }

  async getThread(threadId: string): Promise<{
    messages: Array<{
      id: string;
      from: string;
      to: string;
      subject: string;
      date: string;
      body: string;
    }>;
  }> {
    const gmail = await getGmailClient(this.config);
    const response = await gmail.users.threads.get({
      userId: this.config.userId || 'me',
      id: threadId,
    });

    const messages = (response.data.messages || []).map((msg) => {
      const headers = msg.payload?.headers || [];
      return {
        id: msg.id!,
        from: headers.find((h) => h.name === 'From')?.value || '',
        to: headers.find((h) => h.name === 'To')?.value || '',
        subject: headers.find((h) => h.name === 'Subject')?.value || '',
        date: headers.find((h) => h.name === 'Date')?.value || '',
        body: msg.snippet || '',
      };
    });

    return { messages };
  }
}
