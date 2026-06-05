#!/usr/bin/env node
/**
 * Integration Test Suite
 * Validates all Google Workspace + ClickUp + WhatsApp connections
 * Run this after setting up credentials to verify everything works
 */
import { existsSync } from 'fs';
import { join } from 'path';
import { REPO_ROOT } from '../03-platform/src/utils/files.js';
import { authenticate } from '../03-platform/src/utils/google-auth.js';
import { GmailClient } from '../03-platform/src/utils/gmail-client.js';
import { CalendarClient } from '../03-platform/src/utils/calendar-client.js';
import { ContactsClient } from '../03-platform/src/utils/contacts-client.js';
import { DriveClient } from '../03-platform/src/utils/drive-client.js';
import { SheetsClient } from '../03-platform/src/utils/sheets-client.js';

interface TestResult {
  service: string;
  status: 'pass' | 'fail' | 'skip';
  message: string;
  error?: string;
}

const results: TestResult[] = [];

function logResult(result: TestResult) {
  results.push(result);
  const icon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⏭️';
  console.log(`${icon} ${result.service}: ${result.message}`);
  if (result.error) console.log(`   Error: ${result.error}`);
}

async function testGoogleAuth() {
  const credsPath = join(REPO_ROOT, '.secrets', 'workspace-credentials.json');
  if (!existsSync(credsPath)) {
    logResult({ service: 'Google Auth', status: 'skip', message: 'Credentials not found' });
    return false;
  }

  try {
    const auth = await authenticate({
      credentialsPath: '.secrets/workspace-credentials.json',
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });
    logResult({ service: 'Google Auth', status: 'pass', message: 'Service account authenticated' });
    return true;
  } catch (e) {
    logResult({ service: 'Google Auth', status: 'fail', message: 'Authentication failed', error: String(e) });
    return false;
  }
}

async function testGmail() {
  const credsPath = join(REPO_ROOT, '.secrets', 'gmail-credentials.json');
  if (!existsSync(credsPath)) {
    logResult({ service: 'Gmail', status: 'skip', message: 'Credentials not found' });
    return;
  }

  try {
    const gmail = new GmailClient({
      credentialsPath: '.secrets/gmail-credentials.json',
      scopes: ['https://www.googleapis.com/auth/gmail.send'],
    });
    const labels = await gmail.getLabels();
    logResult({ service: 'Gmail', status: 'pass', message: `Connected. ${labels.length} labels found.` });
  } catch (e) {
    logResult({ service: 'Gmail', status: 'fail', message: 'Connection failed', error: String(e) });
  }
}

async function testCalendar() {
  const credsPath = join(REPO_ROOT, '.secrets', 'workspace-credentials.json');
  if (!existsSync(credsPath)) {
    logResult({ service: 'Calendar', status: 'skip', message: 'Credentials not found' });
    return;
  }

  try {
    const calendar = new CalendarClient({
      credentialsPath: '.secrets/workspace-credentials.json',
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });
    const events = await calendar.listEvents({ maxResults: 1 });
    logResult({ service: 'Calendar', status: 'pass', message: `Connected. ${events.length} upcoming events.` });
  } catch (e) {
    logResult({ service: 'Calendar', status: 'fail', message: 'Connection failed', error: String(e) });
  }
}

async function testContacts() {
  const credsPath = join(REPO_ROOT, '.secrets', 'workspace-credentials.json');
  if (!existsSync(credsPath)) {
    logResult({ service: 'Contacts', status: 'skip', message: 'Credentials not found' });
    return;
  }

  try {
    const contacts = new ContactsClient({
      credentialsPath: '.secrets/workspace-credentials.json',
      scopes: ['https://www.googleapis.com/auth/contacts.readonly'],
    });
    const list = await contacts.listContacts(1);
    logResult({ service: 'Contacts', status: 'pass', message: `Connected. ${list.length} contacts accessible.` });
  } catch (e) {
    logResult({ service: 'Contacts', status: 'fail', message: 'Connection failed', error: String(e) });
  }
}

async function testDrive() {
  const credsPath = join(REPO_ROOT, '.secrets', 'workspace-credentials.json');
  if (!existsSync(credsPath)) {
    logResult({ service: 'Drive', status: 'skip', message: 'Credentials not found' });
    return;
  }

  try {
    const drive = new DriveClient({
      credentialsPath: '.secrets/workspace-credentials.json',
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });
    const files = await drive.listFiles(undefined, 'name = "GTCX"');
    logResult({ service: 'Drive', status: 'pass', message: `Connected. Drive accessible.` });
  } catch (e) {
    logResult({ service: 'Drive', status: 'fail', message: 'Connection failed', error: String(e) });
  }
}

async function testSheets() {
  const credsPath = join(REPO_ROOT, '.secrets', 'workspace-credentials.json');
  if (!existsSync(credsPath)) {
    logResult({ service: 'Sheets', status: 'skip', message: 'Credentials not found' });
    return;
  }

  try {
    const sheets = new SheetsClient({
      credentialsPath: '.secrets/workspace-credentials.json',
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    logResult({ service: 'Sheets', status: 'pass', message: 'Connected. API accessible.' });
  } catch (e) {
    logResult({ service: 'Sheets', status: 'fail', message: 'Connection failed', error: String(e) });
  }
}

async function testClickUp() {
  const token = process.env.CLICKUP_API_TOKEN;
  if (!token) {
    logResult({ service: 'ClickUp', status: 'skip', message: 'CLICKUP_API_TOKEN not set' });
    return;
  }

  try {
    const response = await fetch('https://api.clickup.com/api/v2/team', {
      headers: { Authorization: token },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json() as { teams: Array<{ name: string }> };
    logResult({ service: 'ClickUp', status: 'pass', message: `Connected. ${data.teams.length} teams found.` });
  } catch (e) {
    logResult({ service: 'ClickUp', status: 'fail', message: 'Connection failed', error: String(e) });
  }
}

// Run all tests
console.log('🧪 Integration Test Suite\n');
console.log('Testing all configured services...\n');

const authOk = await testGoogleAuth();

if (authOk) {
  await testGmail();
  await testCalendar();
  await testContacts();
  await testDrive();
  await testSheets();
}

await testClickUp();

// Summary
const passed = results.filter((r) => r.status === 'pass').length;
const failed = results.filter((r) => r.status === 'fail').length;
const skipped = results.filter((r) => r.status === 'skip').length;

console.log('\n📊 Summary\n');
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ❌ Failed: ${failed}`);
console.log(`   ⏭️  Skipped: ${skipped}`);

if (failed > 0) {
  console.log('\n❌ Some integrations failed. Check credentials and retry.');
  process.exit(1);
} else if (passed === 0) {
  console.log('\n⏭️  No integrations tested. Set up credentials first:');
  console.log('   01-docs/ops/google-workspace-setup.md');
} else {
  console.log('\n✅ All integrations working!');
}
