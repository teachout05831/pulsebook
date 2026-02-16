// Hooks
export { useCustomerFiles } from './hooks/useCustomerFiles';

// Actions
export { uploadFile } from './actions/uploadFile';
export { deleteFile } from './actions/deleteFile';
export { getFileUrl } from './actions/getFileUrl';

// Queries (server-only — import directly from ./queries/getCustomerFiles)

// Types
export type { CustomerFile, FileCategory, UploadFileInput } from './types';
export { formatFileSize } from './types';
