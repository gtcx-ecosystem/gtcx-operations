#!/usr/bin/env node
/**
 * Sync budget data to machine-readable outputs
 */
import { writeFileSync } from 'fs';
import { join } from 'path';
import { domainPath, REPO_ROOT, readYaml, getFilesByExtension } from '../src/utils/files.js';
const summary = {
    generated_at: new Date().toISOString(),
    budgets: [],
};
const budgetFiles = getFilesByExtension(domainPath('finance'), '.yaml');
for (const file of budgetFiles) {
    try {
        const budget = readYaml(file);
        const cats = Object.values(budget.categories).map((cat) => {
            const remaining = cat.budget - cat.spent;
            const pct = cat.budget > 0 ? (cat.spent / cat.budget) * 100 : 0;
            let status = 'on-track';
            if (cat.spent > cat.budget)
                status = 'over-budget';
            else if (pct > 75)
                status = 'at-risk';
            return {
                name: cat.name,
                budget: cat.budget,
                spent: cat.spent,
                remaining,
                status,
            };
        });
        summary.budgets.push({
            file,
            quarter: budget.quarter,
            currency: budget.currency,
            total_budget: budget.total.budget,
            total_spent: budget.total.spent,
            total_remaining: budget.total.remaining,
            utilization_percent: budget.total.budget > 0
                ? (budget.total.spent / budget.total.budget) * 100
                : 0,
            categories: cats,
        });
    }
    catch (e) {
        console.error(`❌ Error reading ${file}: ${e}`);
    }
}
// Write summary
const outputPath = domainPath('finance', 'budget-summary.json');
writeFileSync(outputPath, JSON.stringify(summary, null, 2));
console.log(`✅ Budget summary written to ${outputPath}`);
// Also write markdown report
let md = '# Budget Summary\n\n';
md += `*Generated: ${new Date().toISOString()}*\n\n`;
for (const b of summary.budgets) {
    md += `## ${b.quarter}\n\n`;
    md += `**Total Budget:** $${b.total_budget.toLocaleString()} ${b.currency}\n`;
    md += `**Spent:** $${b.total_spent.toLocaleString()} (${b.utilization_percent.toFixed(1)}%)\n`;
    md += `**Remaining:** $${b.total_remaining.toLocaleString()}\n\n`;
    md += '| Category | Budget | Spent | Remaining | Status |\n';
    md += '|----------|--------|-------|-----------|--------|\n';
    for (const cat of b.categories) {
        const statusEmoji = cat.status === 'on-track' ? '🟢' : cat.status === 'at-risk' ? '🟡' : '🔴';
        md += `| ${cat.name} | $${cat.budget.toLocaleString()} | $${cat.spent.toLocaleString()} | $${cat.remaining.toLocaleString()} | ${statusEmoji} ${cat.status} |\n`;
    }
    md += '\n';
}
const mdPath = domainPath('finance', 'budget-summary.md');
writeFileSync(mdPath, md);
console.log(`✅ Budget report written to ${mdPath}`);
//# sourceMappingURL=sync-budgets.js.map