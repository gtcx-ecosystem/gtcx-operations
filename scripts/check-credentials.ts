#!/usr/bin/env node
/**
 * Credential validation script
 * Checks if Google Workspace credentials are properly configured
 */
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { REPO_ROOT } from '../src/utils/files.js';

interface CredentialCheck {
  name: string;
  path: string;
  exists: boolean;
  valid: boolean;
  errors: string[];
}

const checks: CredentialCheck[] = [];

function checkFile(name: string, filename: string): CredentialCheck {
  const path = join(REPO_ROOT, '.secrets', filename);
  const exists = existsSync(path);
  const errors: string[] = [];
  let valid = false;

  if (!exists) {
    errors.push('File not found');
  } else {
    try {
      const content = JSON.parse(readFileSync(path, 'utf-8'));
      
      // Check required fields for service account
      if (!content.type) errors.push('Missing "type" field');
      if (!content.client_email) errors.push('Missing "client_email" field');
      if (!content.private_key) errors.push('Missing "private_key" field');
      if (!content.project_id) errors.push('Missing "project_id" field');
      
      if (content.type === 'service_account') {
        valid = true;
      } else if (content.type === 'oauth2' || content.installed) {
        valid = true;
      } else {
        errors.push(`Unknown credential type: ${content.type}`);
      }
      
      if (errors.length === 0) valid = true;
    } catch (e) {
      errors.push(`Invalid JSON: ${e}`);
    }
  }

  return { name, path, exists, valid, errors };
}

// Check credentials
checks.push(checkFile('Gmail API Credentials', 'gmail-credentials.json'));
checks.push(checkFile('Workspace Credentials', 'workspace-credentials.json'));

// Check environment variables
const envChecks = [
  { name: 'CLICKUP_API_TOKEN', required: false },
  { name: 'CLICKUP_TEAM_ID', required: false },
  { name: 'EMAIL_API_KEY', required: false },
  { name: 'WHATSAPP_API_KEY', required: false },
];

console.log('🔐 Credential Check\n');

let allValid = true;

for (const check of checks) {
  const status = check.valid ? '✅' : check.exists ? '⚠️' : '❌';
  console.log(`${status} ${check.name}`);
  console.log(`   Path: ${check.path}`);
  
  if (!check.exists) {
    console.log(`   Status: MISSING`);
    allValid = false;
  } else if (!check.valid) {
    console.log(`   Status: INVALID`);
    for (const error of check.errors) {
      console.log(`   Error: ${error}`);
    }
    allValid = false;
  } else {
    console.log(`   Status: VALID`);
  }
  console.log('');
}

console.log('🌍 Environment Variables\n');
for (const env of envChecks) {
  const value = process.env[env.name];
  const status = value ? '✅' : env.required ? '❌' : '⏭️';
  console.log(`${status} ${env.name}: ${value ? 'Set' : env.required ? 'Required but missing' : 'Optional (not set)'}`);
}

console.log('');

if (allValid) {
  console.log('✅ All credentials are valid. You can now run:');
  console.log('   pnpm email:send --template=investor-update --to="your-email@gtcx.io"');
  console.log('   pnpm calendar:schedule');
  console.log('   pnpm sheets:sync-budgets');
} else {
  console.log('❌ Some credentials are missing or invalid.');
  console.log('   Follow the setup guide: docs/ops/google-workspace-setup.md');
}
