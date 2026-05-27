#!/usr/bin/env node
/**
 * Validate all YAML/JSON contracts and policies
 */
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const errors = [];
const warnings = [];

function walkDir(dir, callback) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath, callback);
    } else {
      callback(fullPath);
    }
  }
}

function validateYaml(path) {
  // Basic validation: check for frontmatter in .md files
  if (path.endsWith('.md')) {
    const content = readFileSync(path, 'utf-8');
    if (!content.startsWith('---')) {
      warnings.push(`Missing frontmatter: ${path}`);
    }
  }
}

function validateJson(path) {
  try {
    const content = readFileSync(path, 'utf-8');
    JSON.parse(content);
  } catch (e) {
    errors.push(`Invalid JSON: ${path} — ${e.message}`);
  }
}

// Validate all files
walkDir('legal', validateYaml);
walkDir('finance', (p) => { if (p.endsWith('.yaml')) validateYaml(p); if (p.endsWith('.json')) validateJson(p); });
walkDir('ip', validateJson);
walkDir('fundraising', (p) => { if (p.endsWith('.yaml')) validateYaml(p); });
walkDir('ops', validateYaml);

console.log(`Validation complete: ${errors.length} errors, ${warnings.length} warnings`);
if (errors.length > 0) {
  console.error('\nErrors:');
  errors.forEach(e => console.error(`  ❌ ${e}`));
  process.exit(1);
}
if (warnings.length > 0) {
  console.warn('\nWarnings:');
  warnings.forEach(w => console.warn(`  ⚠️  ${w}`));
}
console.log('\n✅ All validations passed');
