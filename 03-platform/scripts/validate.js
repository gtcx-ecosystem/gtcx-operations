#!/usr/bin/env node
/**
 * Validate all YAML/JSON contracts, budgets, policies, IP assets, emails, and CRM data
 */
import { existsSync } from 'fs';
import { join } from 'path';
import { domainPath, REPO_ROOT, readYaml, readJson, readMarkdownWithFrontmatter, getFilesByExtension } from '../src/utils/files.js';
import { validateWithZod, printResults } from '../src/utils/validate.js';
import { BudgetSchema } from '../src/schemas/budget.js';
import { IpRegistrySchema } from '../src/schemas/ip-asset.js';
import { PipelineSchema } from '../src/schemas/fundraising.js';
import { ContractFrontmatterSchema, PolicyFrontmatterSchema } from '../src/schemas/contract.js';
import { EmailProviderConfigSchema, EmailTemplateSchema, EmailLogSchema } from '../src/schemas/email.js';
import { WhatsAppProviderSchema, WhatsAppTemplateSchema, WhatsAppMessageSchema } from '../src/schemas/whatsapp.js';
import { CrmContactSchema, CrmCompanySchema, CrmInteractionSchema } from '../src/schemas/crm.js';
import { AttestationRegisterSchema } from '../src/schemas/agentic-attestation.js';
const results = [];
// Validate budgets
const budgetFiles = getFilesByExtension(domainPath('finance'), '.yaml');
for (const file of budgetFiles) {
    try {
        const data = readYaml(file);
        results.push(validateWithZod(file, data, BudgetSchema));
    }
    catch (e) {
        results.push({ path: file, valid: false, errors: [`Parse error: ${e}`], warnings: [] });
    }
}
// Validate IP registry
const ipFiles = getFilesByExtension(domainPath('ip'), '.json');
for (const file of ipFiles) {
    try {
        const data = readJson(file);
        results.push(validateWithZod(file, data, IpRegistrySchema));
    }
    catch (e) {
        results.push({ path: file, valid: false, errors: [`Parse error: ${e}`], warnings: [] });
    }
}
// Validate fundraising pipeline
const pipelineFiles = getFilesByExtension(domainPath('fundraising'), '.yaml');
for (const file of pipelineFiles) {
    try {
        const data = readYaml(file);
        results.push(validateWithZod(file, data, PipelineSchema));
    }
    catch (e) {
        results.push({ path: file, valid: false, errors: [`Parse error: ${e}`], warnings: [] });
    }
}
// Validate contracts (markdown with frontmatter)
// Skip templates — they use Handlebars variables that don't pass strict validation
const contractFiles = getFilesByExtension(domainPath('legal'), '.md')
    .filter((f) => !f.includes('/templates/'));
for (const file of contractFiles) {
    try {
        const { frontmatter } = readMarkdownWithFrontmatter(file);
        results.push(validateWithZod(file, frontmatter, ContractFrontmatterSchema));
    }
    catch (e) {
        results.push({ path: file, valid: false, errors: [`Frontmatter error: ${e}`], warnings: [] });
    }
}
// Validate policies (markdown with frontmatter)
const policyFiles = getFilesByExtension(domainPath('hr'), '.md')
    .concat(getFilesByExtension(domainPath('ops'), '.md'))
    .concat(getFilesByExtension(domainPath('legal', 'policies'), '.md'));
for (const file of policyFiles) {
    try {
        const { frontmatter } = readMarkdownWithFrontmatter(file);
        results.push(validateWithZod(file, frontmatter, PolicyFrontmatterSchema));
    }
    catch (e) {
        results.push({ path: file, valid: false, errors: [`Frontmatter error: ${e}`], warnings: [] });
    }
}
// Validate email config
const emailConfigFiles = getFilesByExtension(domainPath('email', 'config'), '.yaml');
for (const file of emailConfigFiles) {
    try {
        const data = readYaml(file);
        results.push(validateWithZod(file, data, EmailProviderConfigSchema));
    }
    catch (e) {
        results.push({ path: file, valid: false, errors: [`Parse error: ${e}`], warnings: [] });
    }
}
// Validate email templates
const emailTemplateFiles = getFilesByExtension(domainPath('email', 'templates'), '.yaml');
for (const file of emailTemplateFiles) {
    try {
        const data = readYaml(file);
        results.push(validateWithZod(file, data, EmailTemplateSchema));
    }
    catch (e) {
        results.push({ path: file, valid: false, errors: [`Parse error: ${e}`], warnings: [] });
    }
}
// Validate email logs
const emailLogFiles = getFilesByExtension(domainPath('email', 'sent'), '.json');
for (const file of emailLogFiles) {
    try {
        const data = readJson(file);
        results.push(validateWithZod(file, data, EmailLogSchema));
    }
    catch (e) {
        results.push({ path: file, valid: false, errors: [`Parse error: ${e}`], warnings: [] });
    }
}
// Validate WhatsApp config
const whatsappConfigFiles = getFilesByExtension(domainPath('whatsapp', 'config'), '.yaml');
for (const file of whatsappConfigFiles) {
    try {
        const data = readYaml(file);
        results.push(validateWithZod(file, data, WhatsAppProviderSchema));
    }
    catch (e) {
        results.push({ path: file, valid: false, errors: [`Parse error: ${e}`], warnings: [] });
    }
}
// Validate WhatsApp templates
const whatsappTemplateFiles = getFilesByExtension(domainPath('whatsapp', 'templates'), '.yaml');
for (const file of whatsappTemplateFiles) {
    try {
        const data = readYaml(file);
        results.push(validateWithZod(file, data, WhatsAppTemplateSchema));
    }
    catch (e) {
        results.push({ path: file, valid: false, errors: [`Parse error: ${e}`], warnings: [] });
    }
}
// Validate WhatsApp logs
const whatsappLogFiles = getFilesByExtension(domainPath('whatsapp', 'sent'), '.json');
for (const file of whatsappLogFiles) {
    try {
        const data = readJson(file);
        results.push(validateWithZod(file, data, WhatsAppMessageSchema));
    }
    catch (e) {
        results.push({ path: file, valid: false, errors: [`Parse error: ${e}`], warnings: [] });
    }
}
// Validate agentic attestation compliance register
const attestationRegisterPath = join(REPO_ROOT, '01-docs/04-ops/compliance/attestation-register.yaml');
if (existsSync(attestationRegisterPath)) {
    try {
        const data = readYaml(attestationRegisterPath);
        results.push(validateWithZod(attestationRegisterPath, data, AttestationRegisterSchema));
    }
    catch (e) {
        results.push({
            path: attestationRegisterPath,
            valid: false,
            errors: [`Parse error: ${e}`],
            warnings: [],
        });
    }
}
// Validate CRM data
const crmContactFiles = getFilesByExtension(domainPath('crm'), '.json');
for (const file of crmContactFiles) {
    try {
        const data = readJson(file);
        if (data.contacts) {
            for (let i = 0; i < data.contacts.length; i++) {
                const r = validateWithZod(`${file}#contacts[${i}]`, data.contacts[i], CrmContactSchema);
                if (!r.valid)
                    results.push(r);
            }
        }
        if (data.companies) {
            for (let i = 0; i < data.companies.length; i++) {
                const r = validateWithZod(`${file}#companies[${i}]`, data.companies[i], CrmCompanySchema);
                if (!r.valid)
                    results.push(r);
            }
        }
        if (data.interactions) {
            for (let i = 0; i < data.interactions.length; i++) {
                const r = validateWithZod(`${file}#interactions[${i}]`, data.interactions[i], CrmInteractionSchema);
                if (!r.valid)
                    results.push(r);
            }
        }
    }
    catch (e) {
        results.push({ path: file, valid: false, errors: [`Parse error: ${e}`], warnings: [] });
    }
}
const success = printResults(results);
process.exit(success ? 0 : 1);
//# sourceMappingURL=validate.js.map