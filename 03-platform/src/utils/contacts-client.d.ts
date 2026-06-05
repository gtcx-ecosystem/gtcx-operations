import type { GoogleAuthConfig } from './google-auth.js';
import type { CrmContact } from '../schemas/crm.js';
export declare class ContactsClient {
    private config;
    constructor(config: GoogleAuthConfig);
    syncContact(contact: CrmContact): Promise<{
        resourceName: string;
        etag: string;
    }>;
    listContacts(pageSize?: number): Promise<Array<{
        resourceName: string;
        name: string;
        email: string;
        phone?: string;
        organization?: string;
        title?: string;
    }>>;
    searchContacts(query: string): Promise<Array<{
        resourceName: string;
        name: string;
        email: string;
    }>>;
}
//# sourceMappingURL=contacts-client.d.ts.map