#!/usr/bin/env node
/**
 * Generate contract from template using Handlebars
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import Handlebars from 'handlebars';
import { domainPath, REPO_ROOT } from '../src/utils/files.js';
function parseArgs() {
    const args = {};
    for (let i = 2; i < process.argv.length; i++) {
        const arg = process.argv[i];
        if (arg.startsWith('--template='))
            args.template = arg.split('=')[1];
        if (arg.startsWith('--party='))
            args.party = arg.split('=')[1];
        if (arg.startsWith('--output='))
            args.output = arg.split('=')[1];
        if (arg.startsWith('--effective-date='))
            args.effective_date = arg.split('=')[1];
        if (arg.startsWith('--jurisdiction='))
            args.jurisdiction = arg.split('=')[1];
        if (arg.startsWith('--term-months='))
            args.term_months = arg.split('=')[1];
    }
    return args;
}
const args = parseArgs();
if (!args.template || !args.party) {
    console.log('Usage: pnpm generate:contract --template=nda --party="Example Corp" [options]');
    console.log('');
    console.log('Options:');
    console.log('  --template=<type>        Contract type (nda, msa, employment, consulting, vendor)');
    console.log('  --party=<name>           Counterparty name');
    console.log('  --output=<path>          Output file path');
    console.log('  --effective-date=<date>  Effective date (YYYY-MM-DD, defaults to today)');
    console.log('  --jurisdiction=<name>    Governing jurisdiction (defaults to "Delaware, USA")');
    console.log('  --term-months=<n>        Contract term in months (defaults to 36)');
    console.log('');
    console.log('Available templates:');
    process.exit(1);
}
const templatePath = domainPath('legal', 'templates', `${args.template}.md`);
if (!existsSync(templatePath)) {
    console.error(`❌ Template not found: ${templatePath}`);
    console.error('Available templates in legal/templates/:');
    process.exit(1);
}
const templateContent = readFileSync(templatePath, 'utf-8');
const template = Handlebars.compile(templateContent);
const data = {
    template: args.template,
    party_a: 'GTCX Protocol',
    party_b: args.party,
    effective_date: args.effective_date || new Date().toISOString().split('T')[0],
    jurisdiction: args.jurisdiction || 'Delaware, USA',
    term_months: parseInt(args.term_months || '36', 10),
    generated_at: new Date().toISOString(),
};
const output = template(data);
if (args.output) {
    writeFileSync(args.output, output);
    console.log(`✅ Contract generated: ${args.output}`);
}
else {
    console.log(output);
}
//# sourceMappingURL=generate-contract.js.map