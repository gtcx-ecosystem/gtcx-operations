#!/usr/bin/env node
/**
 * Lint policy and runbook markdown files for completeness
 */
import { join } from 'path';
import { REPO_ROOT, readMarkdownWithFrontmatter, getFilesByExtension } from '../03-platform/src/utils/files.js';

interface PolicyIssue {
  file: string;
  type: 'missing' | 'outdated' | 'error';
  field: string;
  message: string;
}

const issues: PolicyIssue[] = [];

const requiredPolicyFields = ['title', 'version', 'effective_date'];
const recommendedPolicyFields = ['owner', 'review_date', 'status'];

const policyFiles = getFilesByExtension(join(REPO_ROOT, 'hr'), '.md')
  .concat(getFilesByExtension(join(REPO_ROOT, 'ops'), '.md'))
  .concat(getFilesByExtension(join(REPO_ROOT, 'legal/policies'), '.md'));

for (const file of policyFiles) {
  try {
    const { frontmatter, body } = readMarkdownWithFrontmatter(file);
    
    // Check required fields
    for (const field of requiredPolicyFields) {
      if (!frontmatter[field]) {
        issues.push({
          file,
          type: 'missing',
          field,
          message: `Missing required field: ${field}`,
        });
      }
    }

    // Check recommended fields
    for (const field of recommendedPolicyFields) {
      if (!frontmatter[field]) {
        issues.push({
          file,
          type: 'missing',
          field,
          message: `Missing recommended field: ${field}`,
        });
      }
    }

    // Check if review date is past
    if (frontmatter.review_date) {
      const reviewDate = new Date(frontmatter.review_date);
      if (reviewDate < new Date()) {
        issues.push({
          file,
          type: 'outdated',
          field: 'review_date',
          message: `Review date ${frontmatter.review_date} has passed`,
        });
      }
    }

    // Check body content
    if (body.trim().length < 100) {
      issues.push({
        file,
        type: 'error',
        field: 'body',
        message: 'Policy body is too short (< 100 chars)',
      });
    }

    // Check for template variables that weren't filled in
    const unfilled = body.match(/\{\{\w+\}\}/g);
    if (unfilled) {
      issues.push({
        file,
        type: 'error',
        field: 'body',
        message: `Unfilled template variables: ${unfilled.join(', ')}`,
      });
    }
  } catch (e) {
    issues.push({
      file,
      type: 'error',
      field: 'frontmatter',
      message: `Failed to parse frontmatter: ${e}`,
    });
  }
}

const errors = issues.filter((i) => i.type === 'error');
const missing = issues.filter((i) => i.type === 'missing');
const outdated = issues.filter((i) => i.type === 'outdated');

console.log(`\n📜 Policy Lint: ${policyFiles.length} files checked`);
console.log(`   ❌ Errors: ${errors.length}`);
console.log(`   ⚠️  Missing fields: ${missing.length}`);
console.log(`   📅 Outdated: ${outdated.length}\n`);

for (const issue of errors) {
  console.log(`❌ ${issue.file}: ${issue.message}`);
}
for (const issue of missing) {
  console.log(`⚠️  ${issue.file}: ${issue.message}`);
}
for (const issue of outdated) {
  console.log(`📅 ${issue.file}: ${issue.message}`);
}

if (errors.length > 0) {
  console.log(`\n❌ ${errors.length} policy errors found`);
  process.exit(1);
}

console.log('\n✅ Policy lint complete');
