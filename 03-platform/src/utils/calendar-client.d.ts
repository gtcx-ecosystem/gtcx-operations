import type { GoogleAuthConfig } from './google-auth.js';
export interface CalendarEvent {
    summary: string;
    description?: string;
    start: {
        dateTime: string;
        timeZone?: string;
    };
    end: {
        dateTime: string;
        timeZone?: string;
    };
    attendees?: string[];
    location?: string;
    reminders?: {
        useDefault?: boolean;
        overrides?: Array<{
            method: 'email' | 'popup';
            minutes: number;
        }>;
    };
    recurrence?: string[];
    colorId?: string;
}
export declare class CalendarClient {
    private config;
    private calendarId;
    constructor(config: GoogleAuthConfig, calendarId?: string);
    createEvent(event: CalendarEvent): Promise<{
        id: string;
        htmlLink: string;
    }>;
    listEvents(options?: {
        timeMin?: string;
        timeMax?: string;
        query?: string;
        maxResults?: number;
    }): Promise<Array<{
        id: string;
        summary: string;
        start: string;
        end: string;
        description?: string;
        attendees?: string[];
        htmlLink: string;
    }>>;
    deleteEvent(eventId: string): Promise<void>;
    getUpcomingFollowUps(days?: number): Promise<Array<{
        id: string;
        summary: string;
        start: string;
        htmlLink: string;
    }>>;
}
//# sourceMappingURL=calendar-client.d.ts.map