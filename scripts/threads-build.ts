#!/usr/bin/env node
/**
 * Build unified communication threads from all channels
 * Aggregates Email + WhatsApp + CRM interactions into per-contact threads
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { REPO_ROOT, readJson } from '../src/utils/files.js';
import type { EmailLog } from '../src/schemas/email.js';
import type { WhatsAppMessage } from '../src/schemas/whatsapp.js';
import type { CrmContact, CrmInteraction, CrmCompany } from '../src/schemas/crm.js';
import type { Thread, ThreadMessage, ThreadRegistry } from '../src/schemas/thread.js';

function generateThreadId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'THR-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Load all data sources
function loadEmailLogs(): EmailLog[] {
  const dir = join(REPO_ROOT, 'email', 'sent');
  if (!existsSync(dir)) return [];
  const logs: EmailLog[] = [];
  for (const f of readdirSync(dir)) {
    if (f.endsWith('.json')) {
      try {
        logs.push(readJson(join(dir, f)));
      } catch { /* skip invalid */ }
    }
  }
  return logs;
}

function loadWhatsAppLogs(): WhatsAppMessage[] {
  const dir = join(REPO_ROOT, 'whatsapp', 'sent');
  if (!existsSync(dir)) return [];
  const logs: WhatsAppMessage[] = [];
  for (const f of readdirSync(dir)) {
    if (f.endsWith('.json')) {
      try {
        logs.push(readJson(join(dir, f)));
      } catch { /* skip invalid */ }
    }
  }
  return logs;
}

function loadCRM(): { contacts: CrmContact[]; companies: CrmCompany[]; interactions: CrmInteraction[] } {
  const contacts = existsSync(join(REPO_ROOT, 'crm', 'contacts.json'))
    ? readJson(join(REPO_ROOT, 'crm', 'contacts.json'))
    : { contacts: [] };
  const companies = existsSync(join(REPO_ROOT, 'crm', 'companies.json'))
    ? readJson(join(REPO_ROOT, 'crm', 'companies.json'))
    : { companies: [] };
  const interactions = existsSync(join(REPO_ROOT, 'crm', 'interactions.json'))
    ? readJson(join(REPO_ROOT, 'crm', 'interactions.json'))
    : { interactions: [] };
  return { contacts: contacts.contacts || [], companies: companies.companies || [], interactions: interactions.interactions || [] };
}

// Build threads
const emailLogs = loadEmailLogs();
const whatsappLogs = loadWhatsAppLogs();
const crm = loadCRM();

const threadsByContact = new Map<string, Thread>();

function getOrCreateThread(contactId: string): Thread {
  if (threadsByContact.has(contactId)) {
    return threadsByContact.get(contactId)!;
  }
  const contact = crm.contacts.find((c) => c.id === contactId);
  const company = contact?.company_id ? crm.companies.find((c) => c.id === contact.company_id) : undefined;
  
  // Determine purpose from contact type
  let purpose: Thread['purpose'] = 'general';
  if (contact?.type === 'investor') purpose = 'fundraising';
  if (contact?.type === 'producer') purpose = 'general'; // Producer engagement
  if (contact?.type === 'vendor') purpose = 'general';
  if (contact?.type === 'legal') purpose = 'legal';
  
  const thread: Thread = {
    id: generateThreadId(),
    contact_id: contactId,
    contact_name: contact ? `${contact.first_name} ${contact.last_name}` : 'Unknown',
    contact_email: contact?.email,
    contact_whatsapp: contact?.whatsapp,
    company_id: contact?.company_id,
    company_name: company?.name,
    purpose,
    messages: [],
    follow_ups: [],
    last_activity: new Date().toISOString(),
    status: 'active',
    tags: contact?.tags || [],
  };
  threadsByContact.set(contactId, thread);
  return thread;
}

// Map email logs to threads
for (const email of emailLogs) {
  // Find contact by email
  const contact = crm.contacts.find((c) => c.email === email.to[0]);
  if (!contact) continue;
  
  const thread = getOrCreateThread(contact.id);
  thread.messages.push({
    id: email.id,
    channel: 'email',
    direction: 'outbound',
    timestamp: email.sent_at,
    subject: email.subject,
    body: email.body_preview,
    from: email.from,
    to: email.to,
    status: email.status as any,
    source_id: email.provider_message_id,
    metadata: { template: email.template_id },
  });
}

// Map WhatsApp logs to threads
for (const wa of whatsappLogs) {
  const contact = crm.contacts.find((c) => c.whatsapp === wa.to);
  if (!contact) continue;
  
  const thread = getOrCreateThread(contact.id);
  thread.messages.push({
    id: wa.id,
    channel: 'whatsapp',
    direction: 'outbound',
    timestamp: wa.sent_at,
    body: wa.body,
    from: wa.from,
    to: [wa.to],
    status: wa.status as any,
    source_id: wa.provider_message_id,
    metadata: { template: wa.template_id },
  });
}

// Map CRM interactions to threads
for (const interaction of crm.interactions) {
  const thread = getOrCreateThread(interaction.contact_id);
  
  // Determine channel from interaction type
  let channel: ThreadMessage['channel'] = 'note';
  if (interaction.type === 'email') channel = 'email';
  if (interaction.type === 'whatsapp') channel = 'whatsapp';
  if (interaction.type === 'call') channel = 'call';
  if (interaction.type === 'meeting') channel = 'meeting';
  
  thread.messages.push({
    id: interaction.id,
    channel,
    direction: interaction.direction as any,
    timestamp: interaction.date,
    subject: interaction.subject,
    body: interaction.summary || interaction.subject,
    from: interaction.direction === 'outbound' ? 'gtcx-agent' : thread.contact_name,
    to: interaction.direction === 'outbound' ? [thread.contact_name] : ['gtcx-agent'],
    status: interaction.outcome === 'positive' ? 'completed' : interaction.outcome === 'follow-up' ? 'delivered' : undefined,
    metadata: { 
      duration_minutes: interaction.duration_minutes,
      follow_up_date: interaction.follow_up_date,
    },
  });
  
  // Add scheduled follow-ups
  if (interaction.follow_up_date) {
    thread.follow_ups.push({
      id: `FU-${interaction.id}`,
      type: 'email',
      scheduled_at: interaction.follow_up_date,
      action: interaction.follow_up_action || 'Follow up',
      status: 'pending',
      triggered_by: interaction.id,
      auto_trigger: false,
    });
  }
}

// Sort messages and compute thread metadata
for (const thread of threadsByContact.values()) {
  thread.messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
  if (thread.messages.length > 0) {
    thread.last_activity = thread.messages[thread.messages.length - 1]!.timestamp;
    const lastOutbound = thread.messages.filter((m) => m.direction === 'outbound').pop();
    const lastInbound = thread.messages.filter((m) => m.direction === 'inbound').pop();
    thread.last_outbound = lastOutbound?.timestamp;
    thread.last_inbound = lastInbound?.timestamp;
    thread.next_scheduled = thread.follow_ups.find((f) => f.status === 'pending')?.scheduled_at;
  }
  
  // Determine status
  const lastMsg = thread.messages[thread.messages.length - 1];
  if (lastMsg) {
    const daysSince = Math.floor((Date.now() - new Date(lastMsg.timestamp).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince > 30) thread.status = 'stale';
    else if (lastMsg.status === 'failed') thread.status = 'blocked';
  }
}

// Build registry
const registry: ThreadRegistry = {
  version: '1.0',
  generated_at: new Date().toISOString(),
  threads: Array.from(threadsByContact.values()),
};

// Write output
const outputPath = join(REPO_ROOT, 'threads', 'registry.json');
writeFileSync(outputPath, JSON.stringify(registry, null, 2));

// Generate markdown report
let md = '# Unified Communication Threads\n\n';
md += `*Generated: ${new Date().toISOString()}*\n\n`;
md += `**Total threads:** ${registry.threads.length}\n\n`;

for (const thread of registry.threads.sort((a, b) => 
  new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime()
)) {
  const statusEmoji = thread.status === 'active' ? '🟢' : thread.status === 'stale' ? '🟡' : thread.status === 'blocked' ? '🔴' : '⚪';
  md += `## ${statusEmoji} ${thread.contact_name}`;
  if (thread.company_name) md += ` (${thread.company_name})`;
  md += '\n\n';
  md += `- **Thread ID:** ${thread.id}\n`;
  md += `- **Purpose:** ${thread.purpose}\n`;
  md += `- **Messages:** ${thread.messages.length}\n`;
  md += `- **Last activity:** ${new Date(thread.last_activity).toLocaleDateString()}\n`;
  md += `- **Status:** ${thread.status}\n`;
  if (thread.contact_email) md += `- **Email:** ${thread.contact_email}\n`;
  if (thread.contact_whatsapp) md += `- **WhatsApp:** ${thread.contact_whatsapp}\n`;
  md += '\n';
  
  md += '| Time | Channel | Direction | Subject | Status |\n';
  md += '|------|---------|-----------|---------|--------|\n';
  for (const msg of thread.messages.slice(-5)) {
    const time = new Date(msg.timestamp).toLocaleDateString();
    const dir = msg.direction === 'outbound' ? '→' : '←';
    md += `| ${time} | ${msg.channel} | ${dir} | ${msg.subject || msg.body.substring(0, 30)} | ${msg.status || '-'} |\n`;
  }
  
  if (thread.follow_ups.length > 0) {
    md += '\n**Follow-ups:**\n';
    for (const fu of thread.follow_ups.filter((f) => f.status === 'pending')) {
      md += `- ⏰ ${new Date(fu.scheduled_at).toLocaleDateString()}: ${fu.action}\n`;
    }
  }
  
  md += '\n---\n\n';
}

const mdPath = join(REPO_ROOT, 'threads', 'report.md');
writeFileSync(mdPath, md);

console.log(`\n🧵 Unified Threads: ${registry.threads.length} threads`);
console.log(`   📄 Registry: ${outputPath}`);
console.log(`   📊 Report: ${mdPath}`);

const stale = registry.threads.filter((t) => t.status === 'stale').length;
const blocked = registry.threads.filter((t) => t.status === 'blocked').length;
const active = registry.threads.filter((t) => t.status === 'active').length;

console.log(`\n   🟢 Active: ${active}`);
console.log(`   🟡 Stale: ${stale}`);
console.log(`   🔴 Blocked: ${blocked}`);
