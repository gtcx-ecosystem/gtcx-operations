#!/usr/bin/env node
/**
 * format:check — key docs have YAML frontmatter and required fields.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { repoRootFromMeta } from '../lib/repo-root.mjs';

const ROOT = repoRootFromMeta(import.meta.url);
const failures = [];

const FILES = [
  '01-docs/operations/agent-work-selection.md',
  '01-docs/strategy/execution-roadmap.md',
  '03-platform/DOMAINS.md',
  '05-audit/AGENT-START.md',
];

const REQUIRED = ['title', 'owner'];

for (const rel of FILES) {
  const abs = join(ROOT, rel);
  if (!existsSync(abs)) {
    failures.push(`missing ${rel}`);
    continue;
  }
  const text = readFileSync(abs, 'utf8');
  if (!text.startsWith('---\n')) {
    failures.push(`${rel}: missing YAML frontmatter`);
    continue;
  }
  const end = text.indexOf('\n---\n', 4);
  if (end < 0) {
    failures.push(`${rel}: unclosed frontmatter`);
    continue;
  }
  const fm = text.slice(4, end);
  for (const key of REQUIRED) {
    if (!new RegExp(`^${key}:`, 'm').test(fm)) failures.push(`${rel}: frontmatter missing ${key}`);
  }
}

if (failures.length) {
  console.error('format:check FAILED');
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log('format:check OK');
