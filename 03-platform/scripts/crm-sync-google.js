#!/usr/bin/env node
/**
 * Sync CRM contacts to Google Contacts and Calendar
 */
import { existsSync } from 'fs';
import { join } from 'path';
import { REPO_ROOT, readJson } from '../03-platform/src/utils/files.js';
import { ContactsClient } from '../03-platform/src/utils/contacts-client.js';
const contactsPath = join(REPO_ROOT, 'crm', 'contacts.json');
const companiesPath = join(REPO_ROOT, 'crm', 'companies.json');
if (!existsSync(contactsPath)) {
    console.error('❌ CRM contacts not found');
    process.exit(1);
}
const contactsData = readJson(contactsPath);
const companiesData = existsSync(companiesPath)
    ? readJson(companiesPath)
    : { companies: [] };
console.log(`\n🔄 Syncing ${contactsData.contacts.length} contacts to Google Contacts\n`);
const config = {
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
    }
    catch (e) {
        console.error(`  ❌ ${contact.first_name} ${contact.last_name} — ${e}`);
        failed++;
    }
}
console.log(`\n📊 Sync complete: ${synced} synced, ${failed} failed`);
//# sourceMappingURL=crm-sync-google.js.map