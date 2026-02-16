'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCustomerFiles } from '../queries/getCustomerFiles';
import { uploadFile } from '../actions/uploadFile';
import { deleteFile } from '../actions/deleteFile';
import { getFileUrl } from '../actions/getFileUrl';
import type { CustomerFile, FileCategory } from '../types';

export function useCustomerFiles(customerId: string) {
  const [files, setFiles] = useState<CustomerFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCustomerFiles(customerId);
      setFiles(data);
    } catch {
      setError('Failed to load files');
    } finally {
      setIsLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleUpload = async (file: File, category: FileCategory, description?: string) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('customerId', customerId);
    formData.append('category', category);
    if (description) formData.append('description', description);

    const result = await uploadFile(formData);
    setIsUploading(false);
    if (result.success) await refresh();
    return result;
  };

  const handleDelete = async (fileId: string) => {
    const result = await deleteFile(fileId);
    if (result.success) await refresh();
    return result;
  };

  const handleDownload = async (file: CustomerFile) => {
    const result = await getFileUrl(file.storagePath);
    if (result.url) {
      window.open(result.url, '_blank');
    }
    return result;
  };

  // Group files by category
  const photos = files.filter((f) => f.category === 'photo');
  const documents = files.filter((f) => f.category === 'document');
  const contracts = files.filter((f) => f.category === 'contract');
  const totalSize = files.reduce((sum, f) => sum + f.fileSize, 0);

  return {
    files,
    photos,
    documents,
    contracts,
    totalSize,
    isLoading,
    isUploading,
    error,
    refresh,
    handleUpload,
    handleDelete,
    handleDownload,
  };
}
