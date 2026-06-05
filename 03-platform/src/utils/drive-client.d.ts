import type { GoogleAuthConfig } from './google-auth.js';
export declare class DriveClient {
    private config;
    constructor(config: GoogleAuthConfig);
    uploadFile(options: {
        name: string;
        mimeType: string;
        body: Buffer | string;
        folderId?: string;
        description?: string;
    }): Promise<{
        id: string;
        webViewLink: string;
    }>;
    createFolder(name: string, parentId?: string): Promise<string>;
    listFiles(folderId?: string, query?: string): Promise<Array<{
        id: string;
        name: string;
        mimeType: string;
        modifiedTime: string;
        webViewLink: string;
    }>>;
    shareFile(fileId: string, email: string, role?: 'reader' | 'commenter' | 'writer'): Promise<void>;
}
//# sourceMappingURL=drive-client.d.ts.map