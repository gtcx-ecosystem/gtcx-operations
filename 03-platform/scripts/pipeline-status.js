#!/usr/bin/env node
/**
 * Fundraising pipeline status report
 */
import { join } from 'path';
import { REPO_ROOT, readYaml, getFilesByExtension } from '../03-platform/src/utils/files.js';
const pipelineFiles = getFilesByExtension(join(REPO_ROOT, 'fundraising'), '.yaml');
for (const file of pipelineFiles) {
    try {
        const data = readYaml(file);
        const p = data.pipeline;
        const m = data.metrics;
        console.log(`\n💰 ${p.name} Fundraising Pipeline\n`);
        console.log(`  Target: $${p.target_raise.toLocaleString()} ${p.currency}`);
        console.log(`  Target Close: ${p.target_close}`);
        console.log(`  Owner: ${p.owner}`);
        console.log(`  Days Active: ${m.days_since_start}\n`);
        // Stage breakdown
        console.log('  Pipeline Stages:\n');
        for (const stage of data.stages) {
            const count = stage.investors.length;
            const committed = stage.investors
                .filter((i) => i.committed_amount)
                .reduce((sum, i) => sum + (i.committed_amount || 0), 0);
            console.log(`    ${stage.name}: ${count} investors${committed > 0 ? ` ($${committed.toLocaleString()} committed)` : ''}`);
            for (const investor of stage.investors) {
                console.log(`      • ${investor.name} — ${investor.status}`);
                if (investor.next_action) {
                    console.log(`        Next: ${investor.next_action} (${investor.next_action_date})`);
                }
            }
        }
        // Metrics
        const pctCommitted = p.target_raise > 0 ? (m.amount_committed / p.target_raise) * 100 : 0;
        console.log('\n  Metrics:');
        console.log(`    Total Contacts: ${m.total_contacts}`);
        console.log(`    Active Conversations: ${m.active_conversations}`);
        console.log(`    Term Sheets: ${m.term_sheets_received}`);
        console.log(`    Amount Committed: $${m.amount_committed.toLocaleString()} (${pctCommitted.toFixed(1)}% of target)`);
        // Progress bar
        const barWidth = 30;
        const filled = Math.round((pctCommitted / 100) * barWidth);
        const bar = '█'.repeat(filled) + '░'.repeat(barWidth - filled);
        console.log(`    Progress: [${bar}] ${pctCommitted.toFixed(1)}%`);
    }
    catch (e) {
        console.error(`❌ Error reading ${file}: ${e}`);
    }
}
console.log('');
//# sourceMappingURL=pipeline-status.js.map