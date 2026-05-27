#!/usr/bin/env node
/**
 * CRM analytics and reporting
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { REPO_ROOT, readJson } from '../src/utils/files.js';
import type { CrmRegistry, CrmContact, CrmInteraction } from '../src/schemas/crm.js';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function daysSince(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - date.getTime()) / MS_PER_DAY);
}

function daysUntil(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  return Math.ceil((date.getTime() - now.getTime()) / MS_PER_DAY);
}

// Load CRM data
let registry: CrmRegistry;
try {
  const contacts = readJson(join(REPO_ROOT, 'crm', 'contacts.json'));
  const companies = readJson(join(REPO_ROOT, 'crm', 'companies.json'));
  const interactions = readJson(join(REPO_ROOT, 'crm', 'interactions.json'));
  registry = {
    version: '1.0',
    last_updated: new Date().toISOString(),
    contacts: contacts.contacts || [],
    companies: companies.companies || [],
    interactions: interactions.interactions || [],
  };
} catch (e) {
  console.error(`❌ Error loading CRM data: ${e}`);
  process.exit(1);
}

console.log(`\n🤝 CRM Report\n`);
console.log(`  Contacts: ${registry.contacts.length}`);
console.log(`  Companies: ${registry.companies.length}`);
console.log(`  Interactions: ${registry.interactions.length}\n`);

// Company breakdown by type
const companiesByType = new Map<string, number>();
for (const c of registry.companies) {
  companiesByType.set(c.type, (companiesByType.get(c.type) || 0) + 1);
}
console.log('  Companies by Type:');
for (const [type, count] of companiesByType) {
  console.log(`    ${type}: ${count}`);
}

// Contact status
const activeContacts = registry.contacts.filter((c) => c.status === 'active');
const staleContacts = registry.contacts.filter((c) => {
  if (!c.last_contact_at) return true;
  return daysSince(c.last_contact_at) > 30;
});
console.log(`\n  Contact Health:`);
console.log(`    Active: ${activeContacts.length}`);
console.log(`    Stale (>30d no contact): ${staleContacts.length}`);

// Interaction analysis
const recentInteractions = registry.interactions
  .filter((i) => daysSince(i.date) <= 30)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

console.log(`\n  Recent Interactions (last 30d): ${recentInteractions.length}`);
for (const interaction of recentInteractions.slice(0, 5)) {
  const contact = registry.contacts.find((c) => c.id === interaction.contact_id);
  const days = daysSince(interaction.date);
  console.log(`    ${interaction.type.toUpperCase()} — ${contact?.first_name || 'Unknown'} ${contact?.last_name || ''} (${days}d ago)`);
  console.log(`      ${interaction.subject}`);
  if (interaction.outcome) {
    console.log(`      Outcome: ${interaction.outcome}`);
  }
}

// Follow-ups needed
const pendingFollowUps = registry.interactions
  .filter((i) => i.follow_up_date && daysUntil(i.follow_up_date) <= 7 && !i.outcome?.includes('closed'))
  .sort((a, b) => new Date(a.follow_up_date!).getTime() - new Date(b.follow_up_date!).getTime());

if (pendingFollowUps.length > 0) {
  console.log(`\n  ⏰ Follow-ups Needed (next 7 days): ${pendingFollowUps.length}`);
  for (const interaction of pendingFollowUps) {
    const contact = registry.contacts.find((c) => c.id === interaction.contact_id);
    const days = daysUntil(interaction.follow_up_date!);
    console.log(`    ${days === 0 ? 'TODAY' : `${days}d`} — ${contact?.first_name || 'Unknown'} ${contact?.last_name || ''}`);
    console.log(`      Action: ${interaction.follow_up_action}`);
  }
}

// Generate markdown report
let md = '# CRM Report\n\n';
md += `*Generated: ${new Date().toISOString()}*\n\n`;
md += `## Summary\n\n`;
md += `- **Contacts:** ${registry.contacts.length}\n`;
md += `- **Companies:** ${registry.companies.length}\n`;
md += `- **Interactions:** ${registry.interactions.length}\n\n`;

md += `## Companies by Type\n\n`;
md += '| Type | Count |\n|------|-------|\n';
for (const [type, count] of companiesByType) {
  md += `| ${type} | ${count} |\n`;
}

md += `\n## Recent Interactions\n\n`;
for (const interaction of recentInteractions.slice(0, 10)) {
  const contact = registry.contacts.find((c) => c.id === interaction.contact_id);
  md += `**${interaction.type.toUpperCase()}** — ${contact?.first_name || 'Unknown'} ${contact?.last_name || ''}\n`;
  md += `- ${interaction.subject}\n`;
  md += `- Date: ${interaction.date}\n`;
  if (interaction.outcome) md += `- Outcome: ${interaction.outcome}\n`;
  md += '\n';
}

if (pendingFollowUps.length > 0) {
  md += `## Follow-ups Needed\n\n`;
  for (const interaction of pendingFollowUps) {
    const contact = registry.contacts.find((c) => c.id === interaction.contact_id);
    md += `**${interaction.follow_up_date}** — ${contact?.first_name || 'Unknown'} ${contact?.last_name || ''}\n`;
    md += `- ${interaction.follow_up_action}\n\n`;
  }
}

const reportPath = join(REPO_ROOT, 'crm', 'report.md');
writeFileSync(reportPath, md);
console.log(`\n📝 Report written to ${reportPath}`);
