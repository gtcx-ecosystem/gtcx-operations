---
title: "GTCX Operations — API Reference"
status: "current"
date: "2026-05-27"
owner: "gtcx-operations"
role: "engineering-agent"
agent_id: "agent://gtcx-operations/2026-05-27/session-backfill"
trust_score: 95
autonomy_level: "sovereign"
tier: "critical"
tags: ["documentation", "gitbook"]
review_cycle: "on-change"
---

---
title: 'GTCX Operations — API Reference'
status: 'current'
date: '2026-05-27'
owner: 'ops@gtcx.trade'
role: 'ops@gtcx.trade'
tier: 'standard'
tags: ['api', 'reference']
review_cycle: 'on-change'
---

# GTCX Operations — API Reference

## Overview

GTCX Operations exposes its capabilities through TypeScript utility modules and CLI scripts. There is no standalone HTTP server — functions are invoked as scripts, imported as modules, or consumed via the ecosystem event bus.

## Google Workspace Clients

### `03-platform/src/utils/google-auth.ts`

Service account authentication for all Google Workspace APIs.

```typescript
import { authenticate, GoogleAuthConfig } from './utils/google-auth.js';

const auth = await authenticate({
  credentialsPath: '.secrets/workspace-credentials.json',
  scopes: ['https://www.googleapis.com/auth/gmail.send'],
  userId: 'ops@gtcx.trade',  // For domain-wide delegation
});
```

**Auto-detects credential type** from JSON structure — supports both service account keys and OAuth client credentials.

### `03-platform/src/utils/gmail-client.ts`

Send and read emails via Gmail API.

```typescript
import { GmailClient } from './utils/gmail-client.js';

const gmail = new GmailClient(auth);

// Send email
await gmail.sendMessage({
  to: 'investor@example.com',
  subject: 'Q2 Update',
  body: '...',
  from: 'ops@gtcx.trade',
});

// List inbox
const messages = await gmail.listMessages({ maxResults: 10 });
```

**Audit trail:** Every sent message is logged to `email/sent/EMAIL-XXXXXX.json`.

### `03-platform/src/utils/calendar-client.ts`

Schedule and manage calendar events.

```typescript
import { CalendarClient } from './utils/calendar-client.js';

const calendar = new CalendarClient(auth);

await calendar.createEvent({
  summary: 'Follow-up: Kwame',
  start: { dateTime: '2026-05-28T10:00:00Z' },
  end: { dateTime: '2026-05-28T10:30:00Z' },
  attendees: [{ email: 'kwame@example.com' }],
});
```

### `03-platform/src/utils/contacts-client.ts`

Sync CRM contacts to Google Contacts.

```typescript
import { ContactsClient } from './utils/contacts-client.js';

const contacts = new ContactsClient(auth);

await contacts.createContact({
  names: [{ givenName: 'Kwame', familyName: 'Asante' }],
  emailAddresses: [{ value: 'kwame@example.com' }],
  phoneNumbers: [{ value: '+233123456789' }],
});
```

### `03-platform/src/utils/drive-client.ts`

Upload and manage files in Google Drive.

```typescript
import { DriveClient } from './utils/drive-client.js';

const drive = new DriveClient(auth);

await drive.uploadFile({
  name: 'NDA-ExampleCorp.pdf',
  mimeType: 'application/pdf',
  body: fileBuffer,
  folderId: 'FOLDER_ID',
});
```

### `03-platform/src/utils/sheets-client.ts`

Read and write Google Sheets.

```typescript
import { SheetsClient } from './utils/sheets-client.js';

const sheets = new SheetsClient(auth);

// Create budget spreadsheet
await sheets.createSpreadsheet('GTCX Budgets');

// Update values
await sheets.updateValues({
  spreadsheetId: 'SPREADSHEET_ID',
  range: 'Sheet1!A1:C10',
  values: [['Dept', 'Budget', 'Actual'], ...],
});
```

## WhatsApp Client

### `03-platform/src/utils/whatsapp-client.ts`

Multi-provider WhatsApp Business API client.

```typescript
import { WhatsAppClient } from './utils/whatsapp-client.js';

const wa = new WhatsAppClient({
  provider: 'twilio',  // or 'meta', 'mock'
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
});

// Send message
await wa.sendMessage({
  to: '+233123456789',
  body: 'Hello from GTCX',
});

// Send template with variables
await wa.sendTemplate({
  to: '+233123456789',
  templateName: 'follow_up',
  language: 'en',
  variables: [{ type: 'text', text: 'Kwame' }],
});
```

**Provider switching:** Change `whatsapp/config/provider.yaml`:
```yaml
provider: twilio  # twilio | meta | mock
```

**Audit trail:** Every message is logged to `whatsapp/sent/WA-XXXXXX.json`.

## Email Provider

### `03-platform/src/utils/email-provider.ts`

Provider abstraction for email delivery.

```typescript
import { getEmailProvider } from './utils/email-provider.js';

const provider = getEmailProvider();

await provider.send({
  to: 'investor@example.com',
  subject: 'Investor Update',
  body: markdownBody,
  from: 'ops@gtcx.trade',
});
```

**Supported providers:** `gmail` (Gmail API), `mock` (console + file log).

## Validation

### `03-platform/src/utils/validate.ts`

Zod schema validation for all domain types.

```typescript
import { validateBudget, validateCrmContact, validateContract } from './utils/validate.js';

const result = validateBudget(budgetYaml);
if (!result.success) {
  console.error(result.error.format());
}
```

**Available validators:**
- `validateBudget(data)` — `BudgetSchema`
- `validateCrmContact(data)` — `CrmContactSchema`
- `validateContract(data)` — `ContractSchema`
- `validateFundraisingDeal(data)` — `FundraisingDealSchema`
- `validateIpAsset(data)` — `IpAssetSchema`
- `validateEmailMessage(data)` — `EmailMessageSchema`
- `validateWhatsAppMessage(data)` — `WhatsAppMessageSchema`
- `validateThread(data)` — `ThreadSchema`

## Schemas

All schemas live in `03-platform/src/schemas/` and are exported for ecosystem use:

```typescript
import {
  BudgetSchema,
  ContractSchema,
  CrmContactSchema,
  CrmCompanySchema,
  CrmInteractionSchema,
  FundraisingDealSchema,
  IpAssetSchema,
  EmailMessageSchema,
  EmailTemplateSchema,
  WhatsAppMessageSchema,
  WhatsAppTemplateSchema,
  ThreadSchema,
  ThreadMessageSchema,
  ThreadFollowUpSchema,
} from './schemas/index.js';
```

## CLI Scripts

### Script Reference

| Script | Command | Purpose |
|--------|---------|---------|
| `calendar-schedule.ts` | `pnpm calendar:schedule` | Create calendar events from pending CRM follow-ups |
| `check-budgets.ts` | `pnpm check:budgets` | Validate all budgets and report variances |
| `check-credentials.ts` | `pnpm check:credentials` | Verify Google Workspace credential files exist |
| `clickup-sync.ts` | `pnpm clickup:sync` | Sync pending follow-ups to ClickUp |
| `crm-report.ts` | `pnpm crm:report` | Generate CRM activity report |
| `crm-sync-google.ts` | `pnpm crm:sync-google` | Push CRM contacts to Google Contacts |
| `email-send.ts` | `pnpm email:send` | Send templated emails |
| `generate-contract.ts` | `pnpm generate:contract` | Generate contract from template |
| `ip-check.ts` | `pnpm ip:check` | Validate IP registry integrity |
| `lint-policies.ts` | `pnpm lint:policies` | Lint all HR/legal policies |
| `orchestrate-cross-channel.ts` | `pnpm orchestrate:cross-channel` | Run cross-channel orchestration rules |
| `pipeline-status.ts` | `pnpm pipeline:status` | Print fundraising pipeline status |
| `sheets-sync-budgets.ts` | `pnpm sheets:sync-budgets` | Sync budgets to Google Sheets |
| `sync-budgets.ts` | `pnpm sync:budgets` | Full budget sync with variance check |
| `test-integrations.ts` | `pnpm test:integrations` | Test all API integrations (dry-run) |
| `threads-build.ts` | `pnpm threads:build` | Build unified thread registry |
| `validate.ts` | `pnpm validate` | Validate all contracts, policies, budgets |
| `whatsapp-send.ts` | `pnpm whatsapp:send` | Send WhatsApp messages |

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `CLICKUP_API_TOKEN` | For ClickUp sync | — | ClickUp personal API token |
| `CLICKUP_TEAM_ID` | For ClickUp sync | — | ClickUp team ID |
| `INTERNAL_SERVICE_TOKEN` | For inter-service | — | JWT for service-to-service auth |
| `GMAIL_CREDENTIALS_PATH` | No | `.secrets/gmail-credentials.json` | Gmail service account JSON path |
| `WORKSPACE_CREDENTIALS_PATH` | No | `.secrets/workspace-credentials.json` | Workspace service account JSON path |
| `TWILIO_ACCOUNT_SID` | For Twilio | — | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | For Twilio | — | Twilio auth token |
| `WHATSAPP_PROVIDER` | No | `mock` | `twilio`, `meta`, or `mock` |

## Testing

```bash
# Run all tests
pnpm test

# Run specific test suite
pnpm test -- 03-platform/src/schemas/budget.test.ts

# Test integrations (dry-run)
pnpm test:integrations

# Validate all data
pnpm validate
```

**Test coverage:** 29 Vitest tests covering all schemas and core utilities.
