#!/usr/bin/env node
/**
 * Cross-Channel Orchestration Engine
 * If no WhatsApp reply in X hours → send email
 * If no email reply in X days → schedule call
 * Auto-routes communications to the best channel
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { REPO_ROOT, readJson } from '../src/utils/files.js';
import type { Thread, ThreadMessage, ThreadFollowUp } from '../src/schemas/thread.js';
import type { EmailLog } from '../src/schemas/email.js';
import type { WhatsAppMessage } from '../src/schemas/whatsapp.js';

const MS_PER_HOUR = 1000 * 60 * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;

interface OrchestrationRule {
  name: string;
  condition: (thread: Thread) => boolean;
  action: (thread: Thread) => ThreadFollowUp | null;
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
      
      // No reply after 24h
      const hoursSince = (Date.now() - new Date(lastOutbound.timestamp).getTime()) / MS_PER_HOUR;
      if (hoursSince < 24) return false;
      
      // Check if there's been any inbound since outbound
      if (lastInbound && new Date(lastInbound.timestamp) > new Date(lastOutbound.timestamp)) {
        return false;
      }
      
      // Don't duplicate follow-ups
      const alreadyScheduled = thread.follow_ups.some(
        (f) => f.type === 'email' && f.triggered_by === lastOutbound.id && f.status === 'pending'
      );
      
      return !alreadyScheduled;
    },
    action: (thread) => {
      const lastOutbound = thread.messages
        .filter((m) => m.channel === 'whatsapp' && m.direction === 'outbound')
        .pop();
      
      return {
        id: `FU-${lastOutbound!.id}`,
        type: 'email',
        scheduled_at: new Date().toISOString(),
        action: `Follow up via email: WhatsApp message "${lastOutbound!.subject || lastOutbound!.body.substring(0, 50)}" not replied to after 24h`,
        status: 'pending',
        triggered_by: lastOutbound!.id,
        auto_trigger: true,
      };
    },
  },
  {
    name: 'email-no-reply-3d',
    condition: (thread) => {
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
      
      const alreadyScheduled = thread.follow_ups.some(
        (f) => f.type === 'call' && f.triggered_by === lastOutbound.id && f.status === 'pending'
      );
      
      return !alreadyScheduled;
    },
    action: (thread) => {
      const lastOutbound = thread.messages
        .filter((m) => m.channel === 'email' && m.direction === 'outbound')
        .pop();
      
      const scheduled = new Date();
      scheduled.setDate(scheduled.getDate() + 1);
      
      return {
        id: `FU-${lastOutbound!.id}`,
        type: 'call',
        scheduled_at: scheduled.toISOString(),
        action: `Call ${thread.contact_name}: Email "${lastOutbound!.subject || lastOutbound!.body.substring(0, 50)}" not replied to after 3 days`,
        status: 'pending',
        triggered_by: lastOutbound!.id,
        auto_trigger: true,
      };
    },
  },
  {
    name: 'stale-thread-14d',
    condition: (thread) => {
      if (thread.status !== 'stale') return false;
      const daysSince = (Date.now() - new Date(thread.last_activity).getTime()) / MS_PER_DAY;
      return daysSince > 14 && daysSince < 15; // Window to avoid duplicates
    },
    action: (thread) => {
      const scheduled = new Date();
      scheduled.setDate(scheduled.getDate() + 2);
      
      return {
        id: `FU-${thread.id}-STALE`,
        type: thread.contact_whatsapp ? 'whatsapp' : 'email',
        scheduled_at: scheduled.toISOString(),
        action: `Re-engage ${thread.contact_name}: Thread has been stale for 14+ days`,
        status: 'pending',
        triggered_by: thread.id,
        auto_trigger: true,
      };
    },
  },
];

// Load threads
const registryPath = join(REPO_ROOT, 'threads', 'registry.json');
if (!existsSync(registryPath)) {
  console.error('❌ Thread registry not found. Run: pnpm threads:build');
  process.exit(1);
}

const registry = readJson(registryPath) as { threads: Thread[] };
const newFollowUps: Array<{ thread: Thread; followUp: ThreadFollowUp }> = [];

console.log(`\n🎛️ Cross-Channel Orchestrator`);
console.log(`   Threads: ${registry.threads.length}`);
console.log(`   Rules: ${rules.length}\n`);

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
writeFileSync(registryPath, JSON.stringify({ ...registry, version: '1.1' }, null, 2));

// Generate orchestration report
if (newFollowUps.length > 0) {
  let md = '# Cross-Channel Orchestration Report\n\n';
  md += `*Generated: ${new Date().toISOString()}*\n\n`;
  md += `**New follow-ups triggered:** ${newFollowUps.length}\n\n`;
  
  for (const { thread, followUp } of newFollowUps) {
    md += `## ${thread.contact_name}\n\n`;
    md += `- **Channel:** ${followUp.type}\n`;
    md += `- **Action:** ${followUp.action}\n`;
    md += `- **Scheduled:** ${new Date(followUp.scheduled_at).toLocaleDateString()}\n`;
    md += `- **Auto-trigger:** ${followUp.auto_trigger ? 'Yes' : 'No'}\n\n`;
  }
  
  const reportPath = join(REPO_ROOT, 'orchestration', 'report.md');
  writeFileSync(reportPath, md);
  console.log(`📝 Report: ${reportPath}`);
}

console.log(`\n✅ Orchestration complete: ${newFollowUps.length} follow-ups triggered`);
