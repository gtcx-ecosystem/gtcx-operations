import type { GoogleAuthConfig } from './google-auth.js';
export declare class SheetsClient {
    private config;
    constructor(config: GoogleAuthConfig);
    createSpreadsheet(title: string): Promise<{
        id: string;
        url: string;
    }>;
    updateValues(spreadsheetId: string, range: string, values: unknown[][]): Promise<void>;
    appendValues(spreadsheetId: string, range: string, values: unknown[][]): Promise<void>;
    getValues(spreadsheetId: string, range: string): Promise<unknown[][]>;
    syncBudget(spreadsheetId: string, budget: {
        quarter: string;
        categories: Array<{
            name: string;
            budget: number;
            spent: number;
            forecast: number;
            remaining: number;
            status: string;
        }>;
        total: {
            budget: number;
            spent: number;
            forecast: number;
            remaining: number;
        };
    }): Promise<void>;
}
//# sourceMappingURL=sheets-client.d.ts.map