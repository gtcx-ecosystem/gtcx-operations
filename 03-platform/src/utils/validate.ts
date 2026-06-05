import { z } from 'zod';

export interface ValidationResult {
  path: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateWithZod<T>(
  path: string,
  data: unknown,
  schema: z.ZodSchema<T>
): ValidationResult {
  const result = schema.safeParse(data);
  if (result.success) {
    return { path, valid: true, errors: [], warnings: [] };
  }
  const errors = result.error.errors.map(
    (e) => `${e.path.join('.')}: ${e.message}`
  );
  return { path, valid: false, errors, warnings: [] };
}

export function printResults(results: ValidationResult[]): boolean {
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
  const failed = results.filter((r) => !r.valid);

  console.log(`\n📋 Validation Results: ${results.length} files checked`);
  console.log(`   ✅ Passed: ${results.length - failed.length}`);
  console.log(`   ❌ Failed: ${failed.length}`);
  console.log(`   ⚠️  Warnings: ${totalWarnings}`);
  console.log(`   🚨 Errors: ${totalErrors}\n`);

  for (const result of failed) {
    console.log(`❌ ${result.path}`);
    for (const error of result.errors) {
      console.log(`   - ${error}`);
    }
  }

  for (const result of results) {
    for (const warning of result.warnings) {
      console.log(`⚠️  ${result.path}: ${warning}`);
    }
  }

  return failed.length === 0 && totalErrors === 0;
}
