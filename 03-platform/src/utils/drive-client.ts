/**
 * Google Drive API client for GTCX Operations
 * Store contracts, reports, and documents
 */
import { google } from 'googleapis';
import { getDriveClient } from './google-auth.js';
import type { GoogleAuthConfig } from './google-auth.js';

export class DriveClient {
  private config: GoogleAuthConfig;

  constructor(config: GoogleAuthConfig) {
    this.config = config;
  }

  async uploadFile(options: {
    name: string;
    mimeType: string;
    body: Buffer | string;
    folderId?: string;
    description?: string;
  }): Promise<{ id: string; webViewLink: string }> {
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
      id: response.data.id!,
      webViewLink: response.data.webViewLink!,
    };
  }

  async createFolder(name: string, parentId?: string): Promise<string> {
    const drive = await getDriveClient(this.config);
    const response = await drive.files.create({
      requestBody: {
        name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentId ? [parentId] : undefined,
      },
      fields: 'id',
    });
    return response.data.id!;
  }

  async listFiles(folderId?: string, query?: string): Promise<Array<{
    id: string;
    name: string;
    mimeType: string;
    modifiedTime: string;
    webViewLink: string;
  }>> {
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
      id: file.id!,
      name: file.name!,
      mimeType: file.mimeType!,
      modifiedTime: file.modifiedTime!,
      webViewLink: file.webViewLink!,
    }));
  }

  async shareFile(fileId: string, email: string, role: 'reader' | 'commenter' | 'writer' = 'reader'): Promise<void> {
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
