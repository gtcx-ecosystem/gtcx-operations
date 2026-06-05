import { type Auth } from 'googleapis';
export interface GoogleAuthConfig {
    credentialsPath: string;
    tokenPath?: string;
    scopes: string[];
    userId?: string;
}
/**
 * Authenticate with Google using service account or OAuth2
 */
export declare function authenticate(config: GoogleAuthConfig): Promise<Auth.OAuth2Client>;
/**
 * Get authenticated Gmail API client
 */
export declare function getGmailClient(config: GoogleAuthConfig): Promise<import("googleapis").gmail_v1.Gmail>;
/**
 * Get authenticated Calendar API client
 */
export declare function getCalendarClient(config: GoogleAuthConfig): Promise<import("googleapis").calendar_v3.Calendar>;
/**
 * Get authenticated Contacts API client
 */
export declare function getPeopleClient(config: GoogleAuthConfig): Promise<import("googleapis").people_v1.People>;
/**
 * Get authenticated Drive API client
 */
export declare function getDriveClient(config: GoogleAuthConfig): Promise<import("googleapis").drive_v3.Drive>;
/**
 * Get authenticated Sheets API client
 */
export declare function getSheetsClient(config: GoogleAuthConfig): Promise<import("googleapis").sheets_v4.Sheets>;
//# sourceMappingURL=google-auth.d.ts.map