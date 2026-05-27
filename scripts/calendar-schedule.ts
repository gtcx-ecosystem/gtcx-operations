#!/usr/bin/env node
/**
 * Schedule calendar events from CRM follow-ups
 */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { REPO_ROOT, readJson } from '../src/utils/files.js';
import { CalendarClient } from '../src/utils/calendar-client.js';
import type { GoogleAuthConfig } from '../src/utils/google-auth.js';
import type { CrmInteraction, CrmContact } from '../src/schemas/crm.js';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function daysUntil(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  return Math.ceil((date.getTime() - now.getTime()) / MS_PER_DAY);
}

// Load CRM data
const interactionsPath = join(REPO_ROOT, 'crm', 'interactions.json');
const contactsPath = join(REPO_ROOT, 'crm', 'contacts.json');

if (!existsSync(interactionsPath) || !existsSync(contactsPath)) {
  console.error('❌ CRM data not found');
  process.exit(1);
}

const interactionsData = readJson(interactionsPath) as { interactions: CrmInteraction[] };
const contactsData = readJson(contactsPath) as { contacts: CrmContact[] };

// Find pending follow-ups
const pendingFollowUps = interactionsData.interactions
  .filter((i) => i.follow_up_date && daysUntil(i.follow_up_date) <= 14 && !i.outcome?.includes('closed'))
  .sort((a, b) => new Date(a.follow_up_date!).getTime() - new Date(b.follow_up_date!).getTime());

if (pendingFollowUps.length === 0) {
  console.log('✅ No pending follow-ups to schedule');
  process.exit(0);
}

console.log(`\n📅 Scheduling ${pendingFollowUps.length} follow-ups\n`);

const calendarConfig: GoogleAuthConfig = {
  credentialsPath: '.secrets/workspace-credentials.json',
  scopes: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'],
};

const calendar = new CalendarClient(calendarConfig);

for (const interaction of pendingFollowUps) {
  const contact = contactsData.contacts.find((c) => c.id === interaction.contact_id);
  if (!contact) continue;

  const followUpDate = new Date(interaction.follow_up_date!);
  const startTime = new Date(followUpDate);
  startTime.setHours(10, 0, 0, 0); // 10 AM
  const endTime = new Date(startTime);
  endTime.setHours(10, 30, 0, 0); // 30 min meeting

  const summary = `Follow-up: ${contact.first_name} ${contact.last_name} — ${interaction.subject}`;
  const description = `
Original interaction: ${interaction.type} — ${interaction.subject}
Date: ${interaction.date}
Outcome: ${interaction.outcome || 'N/A'}

Action needed: ${interaction.follow_up_action}

Contact: ${contact.email}
Company: ${contact.company_id || 'N/A'}
  `.trim();

  console.log(`  📌 ${summary}`);
  console.log(`     Date: ${followUpDate.toDateString()} 10:00 AM`);
  console.log(`     Contact: ${contact.email}`);

  try {
    const event = await calendar.createEvent({
      summary,
      description,
      start: { dateTime: startTime.toISOString(), timeZone: 'UTC' },
      end: { dateTime: endTime.toISOString(), timeZone: 'UTC' },
      attendees: [contact.email],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 1440 }, // 1 day before
          { method: 'popup', minutes: 30 },
        ],
      },
      colorId: '6', // Orange for follow-ups
    });
    console.log(`     ✅ Scheduled: ${event.htmlLink}\n`);
  } catch (e) {
    console.log(`     ⚠️  Could not schedule: ${e}\n`);
  }
}
