export type MediaContext = 'customer' | 'job' | 'brand-kit' | 'estimate-page';

export type FileCategory = 'photo' | 'document' | 'contract';

export interface MediaFile {
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
  createdBy: string | null;
  createdAt: string;
}

export interface UploadResult {
  success?: boolean;
  error?: string;
  data?: { url: string; fileId: string };
}

export interface DeleteResult {
  success?: boolean;
  error?: string;
}

export interface MediaFilters {
  category?: FileCategory;
  customerId?: string;
  jobId?: string;
}

export interface SalesAsset {
  id: string;
  companyId: string;
  title: string;
  description: string | null;
  category: string;
  bunnyCdnUrl: string;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  isReusable: boolean;
  estimateId: string | null;
  totalPlays: number;
  createdAt: string;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
