#!/usr/bin/env node
/**
 * Validate all YAML/JSON contracts, budgets, policies, and IP assets
 */
import { join } from 'path';
import { REPO_ROOT, readYaml, readJson, readMarkdownWithFrontmatter, getFilesByExtension } from '../src/utils/files.js';
import { validateWithZod, printResults, type ValidationResult } from '../src/utils/validate.js';
import { BudgetSchema } from '../src/schemas/budget.js';
import { IpRegistrySchema } from '../src/schemas/ip-asset.js';
import { PipelineSchema } from '../src/schemas/fundraising.js';
import { ContractFrontmatterSchema, PolicyFrontmatterSchema } from '../src/schemas/contract.js';

const results: ValidationResult[] = [];

// Validate budgets
const budgetFiles = getFilesByExtension(join(REPO_ROOT, 'finance'), '.yaml');
for (const file of budgetFiles) {
  try {
    const data = readYaml(file);
    results.push(validateWithZod(file, data, BudgetSchema));
  } catch (e) {
    results.push({ path: file, valid: false, errors: [`Parse error: ${e}`], warnings: [] });
  }
}

// Validate IP registry
const ipFiles = getFilesByExtension(join(REPO_ROOT, 'ip'), '.json');
for (const file of ipFiles) {
  try {
    const data = readJson(file);
    results.push(validateWithZod(file, data, IpRegistrySchema));
  } catch (e) {
    results.push({ path: file, valid: false, errors: [`Parse error: ${e}`], warnings: [] });
  }
}

// Validate fundraising pipeline
const pipelineFiles = getFilesByExtension(join(REPO_ROOT, 'fundraising'), '.yaml');
for (const file of pipelineFiles) {
  try {
    const data = readYaml(file);
    results.push(validateWithZod(file, data, PipelineSchema));
  } catch (e) {
    results.push({ path: file, valid: false, errors: [`Parse error: ${e}`], warnings: [] });
  }
}

// Validate contracts (markdown with frontmatter)
// Skip templates — they use Handlebars variables that don't pass strict validation
const contractFiles = getFilesByExtension(join(REPO_ROOT, 'legal'), '.md')
  .filter((f) => !f.includes('/templates/'));
for (const file of contractFiles) {
  try {
    const { frontmatter } = readMarkdownWithFrontmatter(file);
    results.push(validateWithZod(file, frontmatter, ContractFrontmatterSchema));
  } catch (e) {
    results.push({ path: file, valid: false, errors: [`Frontmatter error: ${e}`], warnings: [] });
  }
}

// Validate policies (markdown with frontmatter)
const policyFiles = getFilesByExtension(join(REPO_ROOT, 'hr'), '.md')
  .concat(getFilesByExtension(join(REPO_ROOT, 'ops'), '.md'));
for (const file of policyFiles) {
  try {
    const { frontmatter } = readMarkdownWithFrontmatter(file);
    results.push(validateWithZod(file, frontmatter, PolicyFrontmatterSchema));
  } catch (e) {
    results.push({ path: file, valid: false, errors: [`Frontmatter error: ${e}`], warnings: [] });
  }
}

const success = printResults(results);
process.exit(success ? 0 : 1);
