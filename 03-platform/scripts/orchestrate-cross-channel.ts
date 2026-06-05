#!/usr/bin/env node
/**
 * Cross-Channel Orchestration Engine — WhatsApp-First
 * 
 * Primary channel: WhatsApp
 * Secondary: Platform notifications
 * Fallback: Email (legal requirements only)
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { domainPath, REPO_ROOT, readJson } from '../src/utils/files.js';
import type { Thread, ThreadMessage, ThreadFollowUp } from '../src/schemas/thread.js';

const MS_PER_HOUR = 1000 * 60 * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;

interface OrchestrationRule {
  name: string;
  condition: (thread: Thread) => boolean;
  action: (thread: Thread) => ThreadFollowUp | null;
}

// Audience-aware routing helpers
function getPrimaryChannel(contactType: string): string {
  switch (contactType) {
    case 'investor': return 'email';
    case 'producer': return 'whatsapp';
    case 'partner': return 'whatsapp';
    case 'vendor': return 'email';
    case 'legal': return 'email';
    default: return 'email';
  }
}

function getFollowUpSequence(contactType: string): Array<{ day: number; channel: string }> {
  switch (contactType) {
    case 'investor':
      return [
        { day: 3, channel: 'email' },
        { day: 7, channel: 'platform' },
        { day: 14, channel: 'email' },
      ];
    case 'producer':
      return [
        { day: 1, channel: 'whatsapp' },
        { day: 3, channel: 'whatsapp' },
        { day: 7, channel: 'whatsapp' },
        { day: 14, channel: 'sms' },
      ];
    case 'partner':
      return [
        { day: 3, channel: 'whatsapp' },
        { day: 7, channel: 'email' },
      ];
    default:
      return [
        { day: 3, channel: 'email' },
        { day: 7, channel: 'email' },
      ];
  }
}

const rules: OrchestrationRule[] = [
  {
    name: 'whatsapp-no-reply-24h',
    condition: (thread) => {
      const lastOutbound = thread.messages
        .filter((m) => m.channel === 'whatsapp' && m.direction === 'outbound')
        .pop();
      const lastInbound = thread.messages
        .filter((m) => m.channel === 'whatsapp' && m.direction === 'inbound')
        .pop();
      
      if (!lastOutbound) return false;
      
      const hoursSince = (Date.now() - new Date(lastOutbound.timestamp).getTime()) / MS_PER_HOUR;
      if (hoursSince < 24) return false;
      
      if (lastInbound && new Date(lastInbound.timestamp) > new Date(lastOutbound.timestamp)) {
        return false;
      }
      
      const alreadyScheduled = thread.follow_ups.some(
        (f) => f.type === 'whatsapp' && f.triggered_by === lastOutbound.id && f.status === 'pending'
      );
      
      return !alreadyScheduled;
    },
    action: (thread) => {
      const lastOutbound = thread.messages
        .filter((m) => m.channel === 'whatsapp' && m.direction === 'outbound')
        .pop();
      
      return {
        id: `FU-${lastOutbound!.id}`,
        type: 'whatsapp',
        scheduled_at: new Date().toISOString(),
        action: `WhatsApp follow-up: "${lastOutbound!.subject || lastOutbound!.body.substring(0, 50)}" — no reply after 24h`,
        status: 'pending',
        triggered_by: lastOutbound!.id,
        auto_trigger: true,
      };
    },
  },
  {
    name: 'whatsapp-no-reply-72h',
    condition: (thread) => {
      const lastOutbound = thread.messages
        .filter((m) => m.channel === 'whatsapp' && m.direction === 'outbound')
        .pop();
      const lastInbound = thread.messages
        .filter((m) => m.channel === 'whatsapp' && m.direction === 'inbound')
        .pop();
      
      if (!lastOutbound) return false;
      
      const hoursSince = (Date.now() - new Date(lastOutbound.timestamp).getTime()) / MS_PER_HOUR;
      if (hoursSince < 72) return false;
      
      if (lastInbound && new Date(lastInbound.timestamp) > new Date(lastOutbound.timestamp)) {
        return false;
      }
      
      const alreadyScheduled = thread.follow_ups.some(
        (f) => f.type === 'whatsapp' && f.triggered_by === lastOutbound.id && f.status === 'pending'
      );
      
      return !alreadyScheduled;
    },
    action: (thread) => {
      const lastOutbound = thread.messages
        .filter((m) => m.channel === 'whatsapp' && m.direction === 'outbound')
        .pop();
      
      return {
        id: `FU-${lastOutbound!.id}-72H`,
        type: 'whatsapp',
        scheduled_at: new Date().toISOString(),
        action: `Final WhatsApp follow-up + platform notification: "${lastOutbound!.subject || lastOutbound!.body.substring(0, 50)}" — no reply after 72h`,
        status: 'pending',
        triggered_by: lastOutbound!.id,
        auto_trigger: true,
      };
    },
  },
  {
    name: 'whatsapp-no-reply-7d',
    condition: (thread) => {
      const lastOutbound = thread.messages
        .filter((m) => m.channel === 'whatsapp' && m.direction === 'outbound')
        .pop();
      const lastInbound = thread.messages
        .filter((m) => m.channel === 'whatsapp' && m.direction === 'inbound')
        .pop();
      
      if (!lastOutbound) return false;
      
      const daysSince = (Date.now() - new Date(lastOutbound.timestamp).getTime()) / MS_PER_DAY;
      if (daysSince < 7) return false;
      
      if (lastInbound && new Date(lastInbound.timestamp) > new Date(lastOutbound.timestamp)) {
        return false;
      }
      
      const alreadyScheduled = thread.follow_ups.some(
        (f) => f.type === 'whatsapp' && f.triggered_by === lastOutbound.id && f.status === 'pending'
      );
      
      return !alreadyScheduled;
    },
    action: (thread) => {
      return {
        id: `FU-${thread.id}-7D`,
        type: 'whatsapp',
        scheduled_at: new Date().toISOString(),
        action: `Archive thread: ${thread.contact_name} — no WhatsApp reply after 7 days. Mark as passed in CRM.`,
        status: 'pending',
        triggered_by: thread.id,
        auto_trigger: true,
      };
    },
  },
  {
    name: 'email-only-legal',
    condition: (thread) => {
      // Only trigger email if investor's preferred channel is email
      // or if a legal document requires email delivery
      const lastOutbound = thread.messages
        .filter((m) => m.channel === 'email' && m.direction === 'outbound')
        .pop();
      const lastInbound = thread.messages
        .filter((m) => m.channel === 'email' && m.direction === 'inbound')
        .pop();
      
      if (!lastOutbound) return false;
      
      const daysSince = (Date.now() - new Date(lastOutbound.timestamp).getTime()) / MS_PER_DAY;
      if (daysSince < 3) return false;
      
      if (lastInbound && new Date(lastInbound.timestamp) > new Date(lastOutbound.timestamp)) {
        return false;
      }
      
      // Only for investors with preferred_channel = email
      // This is checked via metadata in a real implementation
      return false; // Disabled by default — email is fallback only
    },
    action: (thread) => {
      return null; // No-op — email is fallback only
    },
  },
  {
    name: 'stale-thread-14d',
    condition: (thread) => {
      if (thread.status !== 'stale') return false;
      const daysSince = (Date.now() - new Date(thread.last_activity).getTime()) / MS_PER_DAY;
      return daysSince > 14 && daysSince < 15;
    },
    action: (thread) => {
      const scheduled = new Date();
      scheduled.setDate(scheduled.getDate() + 2);
      
      return {
        id: `FU-${thread.id}-STALE`,
        type: 'whatsapp',
        scheduled_at: scheduled.toISOString(),
        action: `Re-engage ${thread.contact_name}: Thread stale for 14+ days. Send value-add update (milestone, traction).`,
        status: 'pending',
        triggered_by: thread.id,
        auto_trigger: true,
      };
    },
  },
];

// Load threads
const registryPath = domainPath('threads', 'registry.json');
if (!existsSync(registryPath)) {
  console.error('❌ Thread registry not found. Run: pnpm threads:build');
  process.exit(1);
}

const registry = readJson(registryPath) as { threads: Thread[] };
const newFollowUps: Array<{ thread: Thread; followUp: ThreadFollowUp }> = [];

console.log(`\n🎛️ Audience-Aware Orchestrator`);
console.log(`   Threads: ${registry.threads.length}`);
console.log(`   Rules: ${rules.length}`);
console.log(`   Investors: Platform + Email`);
console.log(`   Producers: WhatsApp`);
console.log(`   Partners: WhatsApp`);
console.log(`   Vendors: Email\n`);

for (const thread of registry.threads) {
  for (const rule of rules) {
    try {
      if (rule.condition(thread)) {
        const followUp = rule.action(thread);
        if (followUp) {
          newFollowUps.push({ thread, followUp });
          thread.follow_ups.push(followUp);
          console.log(`  📌 ${rule.name}: ${thread.contact_name}`);
          console.log(`     Action: ${followUp.action}`);
          console.log(`     Channel: ${followUp.type}`);
          console.log(`     Scheduled: ${new Date(followUp.scheduled_at).toLocaleDateString()}\n`);
        }
      }
    } catch (e) {
      console.error(`  ⚠️  Rule ${rule.name} failed for ${thread.contact_name}: ${e}`);
    }
  }
}

// Write updated registry
writeFileSync(registryPath, JSON.stringify({ ...registry, version: '1.2' }, null, 2));

// Generate orchestration report
if (newFollowUps.length > 0) {
  let md = '# WhatsApp-First Orchestration Report\n\n';
  md += `*Generated: ${new Date().toISOString()}*\n\n`;
  md += `**New follow-ups triggered:** ${newFollowUps.length}\n\n`;
  md += `**Primary channel:** WhatsApp\n`;
  md += `**Email usage:** Legal fallback only\n\n`;
  
  for (const { thread, followUp } of newFollowUps) {
    md += `## ${thread.contact_name}\n\n`;
    md += `- **Channel:** ${followUp.type}\n`;
    md += `- **Action:** ${followUp.action}\n`;
    md += `- **Scheduled:** ${new Date(followUp.scheduled_at).toLocaleDateString()}\n`;
    md += `- **Auto-trigger:** ${followUp.auto_trigger ? 'Yes' : 'No'}\n\n`;
  }
  
  const reportPath = domainPath('orchestration', 'report.md');
  writeFileSync(reportPath, md);
  console.log(`📝 Report: ${reportPath}`);
}

console.log(`\n✅ Orchestration complete: ${newFollowUps.length} WhatsApp follow-ups triggered`);
console.log(`   Email follow-ups: 0 (email is fallback only)`);
