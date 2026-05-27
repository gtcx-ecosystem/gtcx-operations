/**
 * Google People API client for GTCX Operations
 * Sync CRM contacts with Google Contacts
 */
import { google } from 'googleapis';
import { getPeopleClient } from './google-auth.js';
import type { GoogleAuthConfig } from './google-auth.js';
import type { CrmContact } from '../schemas/crm.js';

export class ContactsClient {
  private config: GoogleAuthConfig;

  constructor(config: GoogleAuthConfig) {
    this.config = config;
  }

  async syncContact(contact: CrmContact): Promise<{ resourceName: string; etag: string }> {
    const people = await getPeopleClient(this.config);
    
    const response = await people.people.createContact({
      requestBody: {
        names: [{
          givenName: contact.first_name,
          familyName: contact.last_name,
        }],
        emailAddresses: [{
          value: contact.email,
          type: 'work',
        }],
        organizations: contact.company_id ? [{
          name: contact.company_id, // Would resolve to actual company name
          title: contact.title,
        }] : undefined,
        phoneNumbers: contact.phone ? [{
          value: contact.phone,
          type: 'work',
        }] : undefined,
        biographies: contact.notes ? [{
          value: contact.notes,
          contentType: 'TEXT_PLAIN',
        }] : undefined,
      },
    });

    return {
      resourceName: response.data.resourceName!,
      etag: response.data.etag!,
    };
  }

  async listContacts(pageSize = 100): Promise<Array<{
    resourceName: string;
    name: string;
    email: string;
    phone?: string;
    organization?: string;
    title?: string;
  }>> {
    const people = await getPeopleClient(this.config);
    const response = await people.people.connections.list({
      resourceName: 'people/me',
      pageSize,
      personFields: 'names,emailAddresses,phoneNumbers,organizations,biographies',
    });

    return (response.data.connections || []).map((person) => ({
      resourceName: person.resourceName!,
      name: person.names?.[0]?.displayName || '(no name)',
      email: person.emailAddresses?.[0]?.value || '',
      phone: person.phoneNumbers?.[0]?.value || undefined,
      organization: person.organizations?.[0]?.name || undefined,
      title: person.organizations?.[0]?.title || undefined,
    }));
  }

  async searchContacts(query: string): Promise<Array<{
    resourceName: string;
    name: string;
    email: string;
  }>> {
    const people = await getPeopleClient(this.config);
    const response = await people.people.searchContacts({
      query,
      readMask: 'names,emailAddresses',
      pageSize: 10,
    });

    return (response.data.results || []).map((result) => ({
      resourceName: result.person?.resourceName!,
      name: result.person?.names?.[0]?.displayName || '',
      email: result.person?.emailAddresses?.[0]?.value || '',
    }));
  }
}
