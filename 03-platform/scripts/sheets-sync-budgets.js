#!/usr/bin/env node
/**
 * Sync budget data to Google Sheets
 */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { REPO_ROOT, readYaml } from '../03-platform/src/utils/files.js';
import { SheetsClient } from '../03-platform/src/utils/sheets-client.js';
const configPath = join(REPO_ROOT, '.secrets', 'sheets-config.json');
let sheetsConfig = {};
if (existsSync(configPath)) {
    sheetsConfig = JSON.parse(readFileSync(configPath, 'utf-8'));
}
const budgetFiles = [];
const financeDir = join(REPO_ROOT, 'finance', 'budgets');
if (existsSync(financeDir)) {
    const { readdirSync } = await import('fs');
    for (const f of readdirSync(financeDir)) {
        if (f.endsWith('.yaml'))
            budgetFiles.push(join(financeDir, f));
    }
}
if (budgetFiles.length === 0) {
    console.log('ℹ️  No budget files found');
    process.exit(0);
}
const sheetsAuth = {
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
        const budget = readYaml(file);
        const categories = Object.values(budget.categories).map((cat) => ({
            name: cat.name,
            budget: cat.budget,
            spent: cat.spent,
            forecast: cat.forecast,
            remaining: cat.budget - cat.spent,
            status: cat.spent > cat.budget ? 'over-budget' : cat.spent / cat.budget > 0.75 ? 'at-risk' : 'on-track',
        }));
        await sheets.syncBudget(spreadsheetId, {
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
    }
    catch (e) {
        console.error(`  ❌ Error syncing ${file}: ${e}`);
    }
}
console.log(`\n📊 Budgets synced: https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`);
//# sourceMappingURL=sheets-sync-budgets.js.map