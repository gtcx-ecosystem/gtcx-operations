#!/usr/bin/env node
/**
 * Sync CRM contacts to Google Contacts and Calendar
 */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { domainPath, REPO_ROOT, readJson } from '../src/utils/files.js';
import { ContactsClient } from '../src/utils/contacts-client.js';
import type { GoogleAuthConfig } from '../src/utils/google-auth.js';
import type { CrmContact, CrmCompany } from '../src/schemas/crm.js';

const contactsPath = domainPath('crm', 'contacts.json');
const companiesPath = domainPath('crm', 'companies.json');

if (!existsSync(contactsPath)) {
  console.error('❌ CRM contacts not found');
  process.exit(1);
}

const contactsData = readJson(contactsPath) as { contacts: CrmContact[] };
const companiesData = existsSync(companiesPath) 
  ? readJson(companiesPath) as { companies: CrmCompany[] }
  : { companies: [] };

console.log(`\n🔄 Syncing ${contactsData.contacts.length} contacts to Google Contacts\n`);

const config: GoogleAuthConfig = {
  credentialsPath: '.secrets/workspace-credentials.json',
  scopes: ['https://www.googleapis.com/auth/contacts'],
};

const googleContacts = new ContactsClient(config);

let synced = 0;
let failed = 0;

for (const contact of contactsData.contacts) {
  if (contact.status !== 'active') {
    console.log(`  ⏭️  Skipping inactive: ${contact.first_name} ${contact.last_name}`);
    continue;
  }

  try {
    const result = await googleContacts.syncContact(contact);
    console.log(`  ✅ ${contact.first_name} ${contact.last_name} — ${result.resourceName}`);
    synced++;
  } catch (e) {
    console.error(`  ❌ ${contact.first_name} ${contact.last_name} — ${e}`);
    failed++;
  }
}

console.log(`\n📊 Sync complete: ${synced} synced, ${failed} failed`);
