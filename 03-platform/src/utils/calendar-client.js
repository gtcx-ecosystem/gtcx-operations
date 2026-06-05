import { getCalendarClient } from './google-auth.js';
export class CalendarClient {
    config;
    calendarId;
    constructor(config, calendarId = 'primary') {
        this.config = config;
        this.calendarId = calendarId;
    }
    async createEvent(event) {
        const calendar = await getCalendarClient(this.config);
        const response = await calendar.events.insert({
            calendarId: this.calendarId,
            requestBody: {
                summary: event.summary,
                description: event.description,
                start: event.start,
                end: event.end,
                attendees: event.attendees?.map((email) => ({ email })),
                location: event.location,
                reminders: event.reminders,
                recurrence: event.recurrence,
                colorId: event.colorId,
            },
        });
        return {
            id: response.data.id,
            htmlLink: response.data.htmlLink,
        };
    }
    async listEvents(options = {}) {
        const calendar = await getCalendarClient(this.config);
        const response = await calendar.events.list({
            calendarId: this.calendarId,
            timeMin: options.timeMin,
            timeMax: options.timeMax,
            q: options.query,
            maxResults: options.maxResults || 100,
            singleEvents: true,
            orderBy: 'startTime',
        });
        return (response.data.items || []).map((event) => ({
            id: event.id,
            summary: event.summary || '(no title)',
            start: event.start?.dateTime || event.start?.date || '',
            end: event.end?.dateTime || event.end?.date || '',
            description: event.description || undefined,
            attendees: event.attendees?.map((a) => a.email).filter(Boolean) || [],
            htmlLink: event.htmlLink || '',
        }));
    }
    async deleteEvent(eventId) {
        const calendar = await getCalendarClient(this.config);
        await calendar.events.delete({
            calendarId: this.calendarId,
            eventId,
        });
    }
    async getUpcomingFollowUps(days = 7) {
        const now = new Date();
        const future = new Date();
        future.setDate(future.getDate() + days);
        return this.listEvents({
            timeMin: now.toISOString(),
            timeMax: future.toISOString(),
            query: 'follow-up',
        });
    }
}
//# sourceMappingURL=calendar-client.js.map