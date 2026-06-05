import { getDriveClient } from './google-auth.js';
export class DriveClient {
    config;
    constructor(config) {
        this.config = config;
    }
    async uploadFile(options) {
        const drive = await getDriveClient(this.config);
        const metadata = {
            name: options.name,
            mimeType: options.mimeType,
            parents: options.folderId ? [options.folderId] : undefined,
            description: options.description,
        };
        const media = {
            mimeType: options.mimeType,
            body: typeof options.body === 'string' ? Buffer.from(options.body) : options.body,
        };
        const response = await drive.files.create({
            requestBody: metadata,
            media,
            fields: 'id, webViewLink',
        });
        return {
            id: response.data.id,
            webViewLink: response.data.webViewLink,
        };
    }
    async createFolder(name, parentId) {
        const drive = await getDriveClient(this.config);
        const response = await drive.files.create({
            requestBody: {
                name,
                mimeType: 'application/vnd.google-apps.folder',
                parents: parentId ? [parentId] : undefined,
            },
            fields: 'id',
        });
        return response.data.id;
    }
    async listFiles(folderId, query) {
        const drive = await getDriveClient(this.config);
        let q = query || '';
        if (folderId) {
            q = q ? `${q} and '${folderId}' in parents` : `'${folderId}' in parents`;
        }
        const response = await drive.files.list({
            q: q || undefined,
            fields: 'files(id, name, mimeType, modifiedTime, webViewLink)',
            pageSize: 100,
        });
        return (response.data.files || []).map((file) => ({
            id: file.id,
            name: file.name,
            mimeType: file.mimeType,
            modifiedTime: file.modifiedTime,
            webViewLink: file.webViewLink,
        }));
    }
    async shareFile(fileId, email, role = 'reader') {
        const drive = await getDriveClient(this.config);
        await drive.permissions.create({
            fileId,
            requestBody: {
                type: 'user',
                role,
                emailAddress: email,
            },
        });
    }
}
//# sourceMappingURL=drive-client.js.map