/**
 * Google Calendar API client for GTCX Operations
 * Schedule follow-ups, meetings, and deadlines
 */
import { google } from 'googleapis';
import { getCalendarClient } from './google-auth.js';
import type { GoogleAuthConfig } from './google-auth.js';

export interface CalendarEvent {
  summary: string;
  description?: string;
  start: { dateTime: string; timeZone?: string };
  end: { dateTime: string; timeZone?: string };
  attendees?: string[];
  location?: string;
  reminders?: {
    useDefault?: boolean;
    overrides?: Array<{ method: 'email' | 'popup'; minutes: number }>;
  };
  recurrence?: string[];
  colorId?: string;
}

export class CalendarClient {
  private config: GoogleAuthConfig;
  private calendarId: string;

  constructor(config: GoogleAuthConfig, calendarId = 'primary') {
    this.config = config;
    this.calendarId = calendarId;
  }

  async createEvent(event: CalendarEvent): Promise<{ id: string; htmlLink: string }> {
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
      id: response.data.id!,
      htmlLink: response.data.htmlLink!,
    };
  }

  async listEvents(options: {
    timeMin?: string;
    timeMax?: string;
    query?: string;
    maxResults?: number;
  } = {}): Promise<Array<{
    id: string;
    summary: string;
    start: string;
    end: string;
    description?: string;
    attendees?: string[];
    htmlLink: string;
  }>> {
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
      id: event.id!,
      summary: event.summary || '(no title)',
      start: event.start?.dateTime || event.start?.date || '',
      end: event.end?.dateTime || event.end?.date || '',
      description: event.description || undefined,
      attendees: event.attendees?.map((a) => a.email!).filter(Boolean) || [],
      htmlLink: event.htmlLink || '',
    }));
  }

  async deleteEvent(eventId: string): Promise<void> {
    const calendar = await getCalendarClient(this.config);
    await calendar.events.delete({
      calendarId: this.calendarId,
      eventId,
    });
  }

  async getUpcomingFollowUps(days = 7): Promise<Array<{
    id: string;
    summary: string;
    start: string;
    htmlLink: string;
  }>> {
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
