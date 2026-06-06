#!/usr/bin/env node
/**
 * Budget variance analysis and alerts
 */
import { join } from 'path';
import { domainPath, REPO_ROOT, readYaml, getFilesByExtension } from '../../src/utils/files.js';
import type { Budget, BudgetCategory } from '../../src/schemas/budget.js';

interface VarianceAlert {
  file: string;
  category: string;
  type: 'overspend' | 'underspend' | 'forecast-risk' | 'discrepancy';
  message: string;
  severity: 'critical' | 'warning' | 'info';
  variance_percent: number;
}

const alerts: VarianceAlert[] = [];

function checkCategory(file: string, key: string, cat: BudgetCategory): void {
  // Check overspend
  if (cat.spent > cat.budget) {
    const pct = ((cat.spent - cat.budget) / cat.budget) * 100;
    alerts.push({
      file,
      category: key,
      type: 'overspend',
      message: `${cat.name}: spent $${cat.spent.toLocaleString()} vs budget $${cat.budget.toLocaleString()} (${pct.toFixed(1)}% over)`,
      severity: pct > 20 ? 'critical' : 'warning',
      variance_percent: pct,
    });
  }

  // Check forecast risk
  if (cat.forecast > cat.budget) {
    const pct = ((cat.forecast - cat.budget) / cat.budget) * 100;
    alerts.push({
      file,
      category: key,
      type: 'forecast-risk',
      message: `${cat.name}: forecast $${cat.forecast.toLocaleString()} exceeds budget by ${pct.toFixed(1)}%`,
      severity: pct > 15 ? 'critical' : 'warning',
      variance_percent: pct,
    });
  }

  // Check line item discrepancies
  if (cat.line_items) {
    const lineBudget = cat.line_items.reduce((sum, li) => sum + li.budget, 0);
    const lineSpent = cat.line_items.reduce((sum, li) => sum + li.spent, 0);
    if (Math.abs(lineBudget - cat.budget) > 1) {
      alerts.push({
        file,
        category: key,
        type: 'discrepancy',
        message: `${cat.name}: line item budgets sum to $${lineBudget.toLocaleString()} but category budget is $${cat.budget.toLocaleString()}`,
        severity: 'warning',
        variance_percent: 0,
      });
    }
    if (Math.abs(lineSpent - cat.spent) > 1) {
      alerts.push({
        file,
        category: key,
        type: 'discrepancy',
        message: `${cat.name}: line item spent sums to $${lineSpent.toLocaleString()} but category spent is $${cat.spent.toLocaleString()}`,
        severity: 'warning',
        variance_percent: 0,
      });
    }
  }
}

const budgetFiles = getFilesByExtension(domainPath('finance'), '.yaml');

for (const file of budgetFiles) {
  try {
    const budget = readYaml(file) as Budget;
    
    // Check total consistency
    const catBudget = Object.values(budget.categories).reduce((sum, c) => sum + c.budget, 0);
    const catSpent = Object.values(budget.categories).reduce((sum, c) => sum + c.spent, 0);
    
    if (Math.abs(catBudget - budget.total.budget) > 1) {
      alerts.push({
        file,
        category: 'total',
        type: 'discrepancy',
        message: `Total budget $${budget.total.budget.toLocaleString()} does not match category sum $${catBudget.toLocaleString()}`,
        severity: 'critical',
        variance_percent: 0,
      });
    }
    if (Math.abs(catSpent - budget.total.spent) > 1) {
      alerts.push({
        file,
        category: 'total',
        type: 'discrepancy',
        message: `Total spent $${budget.total.spent.toLocaleString()} does not match category sum $${catSpent.toLocaleString()}`,
        severity: 'critical',
        variance_percent: 0,
      });
    }

    for (const [key, cat] of Object.entries(budget.categories)) {
      checkCategory(file, key, cat);
    }
  } catch (e) {
    console.error(`❌ Error reading ${file}: ${e}`);
  }
}

// Print results
const critical = alerts.filter((a) => a.severity === 'critical');
const warnings = alerts.filter((a) => a.severity === 'warning');
const info = alerts.filter((a) => a.severity === 'info');

console.log(`\n💰 Budget Analysis: ${budgetFiles.length} files checked`);
console.log(`   🚨 Critical: ${critical.length}`);
console.log(`   ⚠️  Warnings: ${warnings.length}`);
console.log(`   ℹ️  Info: ${info.length}\n`);

for (const alert of critical) {
  console.log(`🚨 [${alert.type}] ${alert.message}`);
}
for (const alert of warnings) {
  console.log(`⚠️  [${alert.type}] ${alert.message}`);
}
for (const alert of info) {
  console.log(`ℹ️  [${alert.type}] ${alert.message}`);
}

if (critical.length > 0) {
  console.log(`\n❌ ${critical.length} critical budget issues found`);
  process.exit(1);
}

console.log('\n✅ Budget check complete');
