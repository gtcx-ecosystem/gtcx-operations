---
title: 'Google Workspace API Setup'
status: 'current'
date: '2026-05-27'
owner: 'ops@gtcx.io'
role: 'ops@gtcx.io'
tier: 'standard'
tags: ['engineering', 'guides', 'google']
review_cycle: 'on-change'
---

# Google Workspace API Setup Runbook

> **Goal:** Enable gtcx-agent to send Gmail, schedule Calendar events, sync Contacts, upload to Drive, and update Sheets.
> **Time:** 15 minutes for Phase 1 (Gmail). 10 minutes per additional service.
> **Prerequisites:** Google Workspace admin access for gtcx.io

## Phase 1: Gmail API (15 minutes)

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click project selector → **New Project**
3. Name: `gtcx-operations`
4. Organization: your gtcx.io domain
5. Click **Create**

### Step 2: Enable Gmail API

1. In the project, go to **APIs & Services → Library**
2. Search "Gmail API" → Click **Enable**
3. Repeat for these APIs (enable all now, save time later):
   - Google Calendar API
   - Google People API (Contacts)
   - Google Drive API
   - Google Sheets API

### Step 3: Create Service Account

1. Go to **APIs & Services → Credentials**
2. Click **Create Credentials → Service Account**
3. Name: `gtcx-operations-agent`
4. Description: `Agentic operations service account`
5. Click **Create and Continue**
6. Role: **Basic → Editor** (or custom role with minimal permissions)
7. Click **Continue → Done**

### Step 4: Create and Download Key

1. Click on the service account you just created
2. Go to **Keys** tab
3. Click **Add Key → Create New Key**
4. Select **JSON**
5. Click **Create** — file downloads automatically
6. **Rename the downloaded file to `gmail-credentials.json`**

### Step 5: Configure Domain-Wide Delegation (Critical)

> Without this, the service account cannot send email as ops@gtcx.io

1. In the service account details, click **Advanced Settings → View Google Workspace Admin Console**
2. Or go directly to [admin.google.com](https://admin.google.com) → **Security → Access and Data Control → API Controls**
3. Click **Manage Domain-Wide Delegation**
4. Click **Add New**
5. Client ID: paste the `client_id` from your downloaded JSON file
6. OAuth Scopes (one per line):
   ```
   https://www.googleapis.com/auth/gmail.send
   https://www.googleapis.com/auth/gmail.readonly
   https://www.googleapis.com/auth/gmail.labels
   https://www.googleapis.com/auth/gmail.modify
   https://www.googleapis.com/auth/calendar
   https://www.googleapis.com/auth/calendar.events
   https://www.googleapis.com/auth/contacts
   https://www.googleapis.com/auth/drive
   https://www.googleapis.com/auth/drive.file
   https://www.googleapis.com/auth/spreadsheets
   ```
7. Click **Authorize**

### Step 6: Place Credentials in Repo

```bash
cd ~/Sites/gtcx-ecosystem/gtcx-operations
mkdir -p .secrets
cp ~/Downloads/gmail-credentials.json .secrets/gmail-credentials.json
```

### Step 7: Test Gmail Send

```bash
pnpm email:send --dry-run --template=investor-update --to="your-email@gtcx.io"
```

If dry-run works, test live:
```bash
pnpm email:send --template=investor-update --to="your-email@gtcx.io"
```

Check your inbox. The email should arrive from `ops@gtcx.io`.

---

## Phase 2: Calendar API (10 minutes)

Already enabled in Step 2. Just test:

```bash
pnpm calendar:schedule
```

This reads `crm/interactions.json` and creates calendar events for pending follow-ups.

---

## Phase 3: Sheets API (10 minutes)

Already enabled in Step 2. Just test:

```bash
pnpm sheets:sync-budgets
```

This creates a `GTCX Budgets` spreadsheet and populates it with your budget data.

---

## Phase 4: Drive API (10 minutes)

Already enabled in Step 2. Test with:

```bash
# Upload a contract to Drive
pnpm generate:contract --template=nda --party="Test Corp" --output=/tmp/test-nda.md
# Then use Drive API (script coming in next iteration)
```

---

## Phase 5: Contacts API (10 minutes)

Already enabled in Step 2. Test with:

```bash
pnpm crm:sync-google
```

This pushes your CRM contacts to Google Contacts.

---

## Troubleshooting

### "Invalid grant" error
- Domain-wide delegation not configured correctly. Recheck Step 5.
- Client ID must match exactly (including dashes).

### "Insufficient permissions" error
- The service account needs the correct OAuth scopes in domain-wide delegation.
- Re-add scopes in Admin Console.

### "User does not exist" error
- The `ops@gtcx.io` account must exist in your Google Workspace.
- Create it if it doesn't exist.

### Emails not arriving
- Check Gmail spam folder.
- Verify `from_address` in `email/config/provider.yaml` matches a Workspace user.

---

## Security Notes

- **Never commit `.secrets/` to git** — it's already in `.gitignore`
- **Rotate keys every 90 days** — set a calendar reminder
- **Use least-privilege roles** — Editor is convenient but consider custom roles
- **Store credentials in 1Password/Vault** — not just on disk

---

## Next Steps After Setup

1. Create Gmail labels: `Investors`, `Legal`, `Vendors`, `Follow-up`
2. Set up a dedicated `ops@gtcx.io` inbox
3. Configure email templates with real copy
4. Schedule `pnpm calendar:schedule` as a daily cron job
5. Add `GTCX_AGENT_TOKEN` to GitHub secrets for CI email sending
