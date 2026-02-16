'use server';

import { createClient } from '@/lib/supabase/server';
import { ALLOWED_MIMES, MIME_TO_EXTENSIONS } from '../constants';
import type { MediaContext, FileCategory, UploadResult } from '../types';

const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE;
const BUNNY_STORAGE_API_KEY = process.env.BUNNY_STORAGE_API_KEY;
const BUNNY_CDN_URL = process.env.BUNNY_CDN_URL;

interface UploadInput {
  buffer: Buffer; fileName: string; fileType: string; fileSize: number;
  companyId: string; userId: string; context: MediaContext; category: FileCategory;
  customerId?: string; jobId?: string; description?: string;
}

export async function uploadMedia(input: UploadInput): Promise<UploadResult> {
  const { buffer, fileName, fileType, fileSize, companyId, userId, context, category, customerId, jobId, description } = input;

  if (!BUNNY_STORAGE_ZONE || !BUNNY_STORAGE_API_KEY || !BUNNY_CDN_URL) return { error: 'Storage not configured' };
  if (!fileName || fileSize <= 0) return { error: 'Invalid file' };
  if (!ALLOWED_MIMES.includes(fileType)) return { error: 'File type not allowed' };

  const ext = '.' + fileName.split('.').pop()?.toLowerCase();
  const allowedExts = MIME_TO_EXTENSIONS[fileType];
  if (!allowedExts || !allowedExts.includes(ext)) return { error: 'File extension does not match MIME type' };

  const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storagePath = `${companyId}/${context}/${Date.now()}_${safeName}`;
  const uploadUrl = `https://la.storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}/${storagePath}`;

  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'AccessKey': BUNNY_STORAGE_API_KEY, 'Content-Type': fileType || 'application/octet-stream' },
    body: buffer as unknown as BodyInit,
  });
  if (!uploadResponse.ok) return { error: 'Failed to upload file' };

  const cdnUrl = `${BUNNY_CDN_URL}/${storagePath}`;
  const supabase = await createClient();
  const { data, error: dbError } = await supabase
    .from('file_uploads')
    .insert({
      company_id: companyId, customer_id: customerId || null, job_id: jobId || null,
      file_name: fileName, file_type: fileType, file_size: fileSize,
      storage_path: cdnUrl, category, description: description || null, created_by: userId,
    })
    .select('id')
    .single();

  if (dbError) {
    await fetch(uploadUrl, { method: 'DELETE', headers: { 'AccessKey': BUNNY_STORAGE_API_KEY } });
    return { error: 'Failed to save file record' };
  }

  return { success: true, data: { url: cdnUrl, fileId: data.id } };
}
