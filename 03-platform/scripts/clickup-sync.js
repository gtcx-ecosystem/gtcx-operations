#!/usr/bin/env node
/**
 * Sync WhatsApp conversations and follow-ups to ClickUp
 * Creates tasks for pending follow-ups, links to thread context
 */
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { REPO_ROOT, readJson } from '../03-platform/src/utils/files.js';
const CLICKUP_API_BASE = 'https://api.clickup.com/api/v2';
const API_TOKEN = process.env.CLICKUP_API_TOKEN;
const TEAM_ID = process.env.CLICKUP_TEAM_ID;
async function createClickUpTask(listId, task) {
    if (!API_TOKEN) {
        console.error('❌ CLICKUP_API_TOKEN not set');
        return null;
    }
    try {
        const response = await fetch(`${CLICKUP_API_BASE}/list/${listId}/task`, {
            method: 'POST',
            headers: {
                'Authorization': API_TOKEN,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });
        if (!response.ok) {
            const error = await response.text();
            console.error(`❌ ClickUp error: ${error}`);
            return null;
        }
        const data = await response.json();
        return data;
    }
    catch (e) {
        console.error(`❌ Failed to create task: ${e}`);
        return null;
    }
}
// Load threads
const registryPath = join(REPO_ROOT, 'threads', 'registry.json');
if (!existsSync(registryPath)) {
    console.error('❌ Thread registry not found. Run: pnpm threads:build');
    process.exit(1);
}
const registry = readJson(registryPath);
// Load ClickUp mapping
const mappingPath = join(REPO_ROOT, '..', 'baseline-os', 'workstream', 'coordination', 'clickup-mapping.json');
let listId;
if (existsSync(mappingPath)) {
    try {
        const mapping = readJson(mappingPath);
        listId = mapping.spaces?.['GTCX Engineering']?.lists?.['gtcx-operations'];
    }
    catch { /* ignore */ }
}
console.log(`\n🔗 ClickUp Sync: ${registry.threads.length} threads`);
console.log(`   List ID: ${listId || 'TBD (manual push mode)'}\n`);
let created = 0;
let skipped = 0;
for (const thread of registry.threads) {
    const pendingFollowUps = thread.follow_ups.filter((f) => f.status === 'pending');
    for (const followUp of pendingFollowUps) {
        const taskName = `[${thread.contact_name}] ${followUp.type.toUpperCase()}: ${followUp.action.substring(0, 50)}`;
        // Skip if already linked
        if (followUp.metadata?.clickup_task_id) {
            console.log(`  ⏭️  Already synced: ${taskName}`);
            skipped++;
            continue;
        }
        const description = `
# Follow-up from Unified Thread

**Contact:** ${thread.contact_name}  
**Company:** ${thread.company_name || 'N/A'}  
**Channel:** ${followUp.type}  
**Action:** ${followUp.action}  
**Scheduled:** ${new Date(followUp.scheduled_at).toLocaleDateString()}  
**Auto-trigger:** ${followUp.auto_trigger ? 'Yes' : 'No'}  

## Thread Context

- **Thread ID:** ${thread.id}
- **Last Activity:** ${new Date(thread.last_activity).toLocaleDateString()}
- **Status:** ${thread.status}
- **Messages:** ${thread.messages.length}

## Recent Messages

${thread.messages.slice(-3).map((m) => `- ${new Date(m.timestamp).toLocaleDateString()} ${m.channel} ${m.direction}: ${m.subject || m.body.substring(0, 60)}`).join('\n')}

---
*Synced from gtcx-operations threads registry*
    `.trim();
        const dueDate = followUp.scheduled_at
            ? new Date(followUp.scheduled_at).getTime()
            : undefined;
        const clickUpTask = {
            name: taskName,
            description,
            status: 'to do',
            priority: followUp.type === 'call' ? 2 : 3,
            due_date: dueDate,
            tags: ['cross-channel', followUp.type, 'auto-sync'],
        };
        if (listId) {
            const result = await createClickUpTask(listId, clickUpTask);
            if (result) {
                // Update follow-up with ClickUp task ID
                followUp.metadata = { ...followUp.metadata, clickup_task_id: result.id };
                thread.clickup_task_id = result.id;
                console.log(`  ✅ Created: ${taskName}`);
                console.log(`     URL: ${result.url}`);
                created++;
            }
            else {
                console.log(`  ❌ Failed: ${taskName}`);
            }
        }
        else {
            // Dry run mode - print what would be created
            console.log(`  [DRY] Would create: ${taskName}`);
            console.log(`        Due: ${new Date(dueDate || Date.now()).toLocaleDateString()}`);
            console.log(`        Priority: ${clickUpTask.priority}`);
            created++;
        }
    }
}
// Save updated registry
writeFileSync(registryPath, JSON.stringify(registry, null, 2));
console.log(`\n📊 Sync complete: ${created} tasks created, ${skipped} skipped`);
if (!listId) {
    console.log(`\n⚠️  No ClickUp list ID found for gtcx-operations.`);
    console.log(`   Add it to workstream/coordination/clickup-mapping.json`);
    console.log(`   Or set CLICKUP_API_TOKEN and CLICKUP_TEAM_ID env vars.`);
}
//# sourceMappingURL=clickup-sync.js.map