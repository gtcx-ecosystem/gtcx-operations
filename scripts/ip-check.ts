#!/usr/bin/env node
/**
 * IP Asset Registry — check deadlines, generate reports
 */
import { join } from 'path';
import { REPO_ROOT, readJson, getFilesByExtension } from '../src/utils/files.js';
import type { IpRegistry, IpAsset } from '../src/schemas/ip-asset.js';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / MS_PER_DAY);
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'critical': return '🚨';
    case 'high': return '🔴';
    case 'medium': return '🟡';
    case 'low': return '🟢';
    default: return '⚪';
  }
}

const ipFiles = getFilesByExtension(join(REPO_ROOT, 'ip'), '.json');
const allAssets: IpAsset[] = [];

for (const file of ipFiles) {
  try {
    const registry = readJson(file) as IpRegistry;
    allAssets.push(...registry.assets);
  } catch (e) {
    console.error(`❌ Error reading ${file}: ${e}`);
  }
}

// Sort by priority and deadline
const sorted = allAssets.sort((a, b) => {
  const daysA = daysUntil(a.next_action_date);
  const daysB = daysUntil(b.next_action_date);
  if (daysA !== daysB) return daysA - daysB;
  const prioMap = { critical: 0, high: 1, medium: 2, low: 3 };
  return prioMap[a.priority] - prioMap[b.priority];
});

console.log(`\n🔒 IP Asset Registry: ${allAssets.length} assets\n`);

const urgent = sorted.filter((a) => daysUntil(a.next_action_date) <= 30);
const upcoming = sorted.filter((a) => {
  const d = daysUntil(a.next_action_date);
  return d > 30 && d <= 90;
});

if (urgent.length > 0) {
  console.log('🚨 URGENT (≤ 30 days):\n');
  for (const asset of urgent) {
    const days = daysUntil(asset.next_action_date);
    console.log(`  ${getPriorityColor(asset.priority)} ${asset.id} — ${asset.title}`);
    console.log(`     Type: ${asset.type} | Status: ${asset.status}`);
    console.log(`     Action: ${asset.next_action}`);
    console.log(`     Due: ${asset.next_action_date} (${days} days)\n`);
  }
}

if (upcoming.length > 0) {
  console.log('📅 Upcoming (31-90 days):\n');
  for (const asset of upcoming) {
    const days = daysUntil(asset.next_action_date);
    console.log(`  ${getPriorityColor(asset.priority)} ${asset.id} — ${asset.title}`);
    console.log(`     Due: ${asset.next_action_date} (${days} days)`);
  }
  console.log('');
}

// Summary by type
const byType = new Map<string, number>();
const byStatus = new Map<string, number>();
for (const asset of allAssets) {
  byType.set(asset.type, (byType.get(asset.type) || 0) + 1);
  byStatus.set(asset.status, (byStatus.get(asset.status) || 0) + 1);
}

console.log('📊 Summary:\n');
console.log('  By Type:');
for (const [type, count] of byType) {
  console.log(`    ${type}: ${count}`);
}
console.log('');
console.log('  By Status:');
for (const [status, count] of byStatus) {
  console.log(`    ${status}: ${count}`);
}

if (urgent.length > 0) {
  console.log(`\n⚠️  ${urgent.length} urgent IP actions require attention`);
  process.exit(1);
}

console.log('\n✅ IP registry check complete');
