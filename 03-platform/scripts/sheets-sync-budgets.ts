#!/usr/bin/env node
/**
 * Sync budget data to Google Sheets
 */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { domainPath, REPO_ROOT, readYaml } from '../src/utils/files.js';
import { SheetsClient } from '../src/utils/sheets-client.js';
import type { GoogleAuthConfig } from '../src/utils/google-auth.js';
import type { Budget } from '../src/schemas/budget.js';

interface SheetsConfig {
  spreadsheet_id?: string;
  auto_create?: boolean;
}

const configPath = join(REPO_ROOT, '.secrets', 'sheets-config.json');
let sheetsConfig: SheetsConfig = {};
if (existsSync(configPath)) {
  sheetsConfig = JSON.parse(readFileSync(configPath, 'utf-8'));
}

const budgetFiles = [];
const financeDir = domainPath('finance', 'budgets');
if (existsSync(financeDir)) {
  const { readdirSync } = await import('fs');
  for (const f of readdirSync(financeDir)) {
    if (f.endsWith('.yaml')) budgetFiles.push(join(financeDir, f));
  }
}

if (budgetFiles.length === 0) {
  console.log('ℹ️  No budget files found');
  process.exit(0);
}

const sheetsAuth: GoogleAuthConfig = {
  credentialsPath: '.secrets/workspace-credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
};

const sheets = new SheetsClient(sheetsAuth);

// Create spreadsheet if needed
let spreadsheetId = sheetsConfig.spreadsheet_id;
if (!spreadsheetId || sheetsConfig.auto_create) {
  const result = await sheets.createSpreadsheet('GTCX Budgets');
  spreadsheetId = result.id;
  console.log(`📊 Created spreadsheet: ${result.url}`);
  
  // Save config
  const { writeFileSync } = await import('fs');
  writeFileSync(configPath, JSON.stringify({ spreadsheet_id: spreadsheetId }, null, 2));
}

console.log(`\n🔄 Syncing ${budgetFiles.length} budgets to Sheets\n`);

for (const file of budgetFiles) {
  try {
    const budget = readYaml(file) as Budget;
    
    const categories = Object.values(budget.categories).map((cat) => ({
      name: cat.name,
      budget: cat.budget,
      spent: cat.spent,
      forecast: cat.forecast,
      remaining: cat.budget - cat.spent,
      status: cat.spent > cat.budget ? 'over-budget' : cat.spent / cat.budget > 0.75 ? 'at-risk' : 'on-track',
    }));

    await sheets.syncBudget(spreadsheetId!, {
      quarter: budget.quarter,
      categories,
      total: {
        budget: budget.total.budget,
        spent: budget.total.spent,
        forecast: budget.total.forecast,
        remaining: budget.total.remaining,
      },
    });

    console.log(`  ✅ ${budget.quarter} synced`);
  } catch (e) {
    console.error(`  ❌ Error syncing ${file}: ${e}`);
  }
}

console.log(`\n📊 Budgets synced: https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`);
