import { z } from 'zod';
export interface ValidationResult {
    path: string;
    valid: boolean;
    errors: string[];
    warnings: string[];
}
export declare function validateWithZod<T>(path: string, data: unknown, schema: z.ZodSchema<T>): ValidationResult;
export declare function printResults(results: ValidationResult[]): boolean;
//# sourceMappingURL=validate.d.ts.map