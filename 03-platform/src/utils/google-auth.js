/**
 * Google Workspace API authentication helper
 * Uses service account or OAuth2 depending on configuration
 */
import { readFileSync, existsSync } from 'fs';
import { google } from 'googleapis';
import { join } from 'path';
import { REPO_ROOT } from './files.js';
/**
 * Authenticate with Google using service account or OAuth2
 */
export async function authenticate(config) {
    const credentialsPath = join(REPO_ROOT, config.credentialsPath);
    if (!existsSync(credentialsPath)) {
        throw new Error(`Google credentials not found at ${credentialsPath}\n` +
            `Download from Google Cloud Console → APIs & Services → Credentials → Service Account`);
    }
    const credentials = JSON.parse(readFileSync(credentialsPath, 'utf-8'));
    // Service account (preferred for server-to-server)
    if (credentials.type === 'service_account') {
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: config.scopes,
        });
        const client = await auth.getClient();
        return client;
    }
    // OAuth2 (for user-delegated access)
    if (credentials.installed || credentials.web) {
        const oauth2Client = new google.auth.OAuth2(credentials.installed?.client_id || credentials.web?.client_id, credentials.installed?.client_secret || credentials.web?.client_secret, 'http://localhost:3000/oauth2callback');
        // Load existing token if available
        if (config.tokenPath && existsSync(join(REPO_ROOT, config.tokenPath))) {
            const token = JSON.parse(readFileSync(join(REPO_ROOT, config.tokenPath), 'utf-8'));
            oauth2Client.setCredentials(token);
            return oauth2Client;
        }
        throw new Error(`OAuth2 token not found. Run the auth flow first:\n` +
            `pnpm google:auth --scopes="${config.scopes.join(',')}"`);
    }
    throw new Error('Unknown credential type. Expected service_account or OAuth2.');
}
/**
 * Get authenticated Gmail API client
 */
export async function getGmailClient(config) {
    const auth = await authenticate(config);
    return google.gmail({ version: 'v1', auth });
}
/**
 * Get authenticated Calendar API client
 */
export async function getCalendarClient(config) {
    const auth = await authenticate(config);
    return google.calendar({ version: 'v3', auth });
}
/**
 * Get authenticated Contacts API client
 */
export async function getPeopleClient(config) {
    const auth = await authenticate(config);
    return google.people({ version: 'v1', auth });
}
/**
 * Get authenticated Drive API client
 */
export async function getDriveClient(config) {
    const auth = await authenticate(config);
    return google.drive({ version: 'v3', auth });
}
/**
 * Get authenticated Sheets API client
 */
export async function getSheetsClient(config) {
    const auth = await authenticate(config);
    return google.sheets({ version: 'v4', auth });
}
//# sourceMappingURL=google-auth.js.map