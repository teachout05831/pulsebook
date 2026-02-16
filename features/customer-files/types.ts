export type FileCategory = 'photo' | 'document' | 'contract';

export interface CustomerFile {
  id: string;
  companyId: string;
  customerId: string | null;
  jobId: string | null;
  fileName: string;
  fileType: string;
  fileSize: number;
  storagePath: string;
  category: FileCategory;
  description: string | null;
  isSigned: boolean;
  createdBy: string | null;
  createdAt: Date;
}

export interface UploadFileInput {
  customerId: string;
  jobId?: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  category: FileCategory;
  description?: string;
  file: File;
}

export interface DeleteFileInput {
  fileId: string;
  storagePath: string;
}

// Helper to format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
