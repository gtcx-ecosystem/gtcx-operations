import { getSheetsClient } from './google-auth.js';
export class SheetsClient {
    config;
    constructor(config) {
        this.config = config;
    }
    async createSpreadsheet(title) {
        const sheets = await getSheetsClient(this.config);
        const response = await sheets.spreadsheets.create({
            requestBody: {
                properties: {
                    title,
                },
            },
        });
        return {
            id: response.data.spreadsheetId,
            url: `https://docs.google.com/spreadsheets/d/${response.data.spreadsheetId}/edit`,
        };
    }
    async updateValues(spreadsheetId, range, values) {
        const sheets = await getSheetsClient(this.config);
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values,
            },
        });
    }
    async appendValues(spreadsheetId, range, values) {
        const sheets = await getSheetsClient(this.config);
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: {
                values,
            },
        });
    }
    async getValues(spreadsheetId, range) {
        const sheets = await getSheetsClient(this.config);
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });
        return response.data.values || [];
    }
    async syncBudget(spreadsheetId, budget) {
        // Header row
        const header = ['Category', 'Budget', 'Spent', 'Forecast', 'Remaining', 'Status', 'Utilization %'];
        // Data rows
        const rows = budget.categories.map((cat) => [
            cat.name,
            cat.budget,
            cat.spent,
            cat.forecast,
            cat.remaining,
            cat.status,
            cat.budget > 0 ? `${((cat.spent / cat.budget) * 100).toFixed(1)}%` : '0%',
        ]);
        // Total row
        rows.push([
            'TOTAL',
            budget.total.budget,
            budget.total.spent,
            budget.total.forecast,
            budget.total.remaining,
            '',
            budget.total.budget > 0 ? `${((budget.total.spent / budget.total.budget) * 100).toFixed(1)}%` : '0%',
        ]);
        await this.updateValues(spreadsheetId, `${budget.quarter}!A1`, [header, ...rows]);
    }
}
//# sourceMappingURL=sheets-client.js.map