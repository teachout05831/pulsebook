'use server';

import { createClient } from '@/lib/supabase/server';
import type { DeleteResult } from '../types';

const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE;
const BUNNY_STORAGE_API_KEY = process.env.BUNNY_STORAGE_API_KEY;
const BUNNY_CDN_URL = process.env.BUNNY_CDN_URL;

export async function deleteMedia(
  fileId: string,
  companyId: string,
): Promise<DeleteResult> {
  if (!fileId) return { error: 'File ID is required' };

  const supabase = await createClient();

  const { data: file } = await supabase
    .from('file_uploads')
    .select('id, company_id, storage_path')
    .eq('id', fileId)
    .single();

  if (!file) return { error: 'File not found' };
  if (file.company_id !== companyId) return { error: 'Not authorized' };

  if (BUNNY_STORAGE_ZONE && BUNNY_STORAGE_API_KEY && BUNNY_CDN_URL) {
    const storagePath = file.storage_path.replace(`${BUNNY_CDN_URL}/`, '');
    const deleteUrl = `https://la.storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}/${storagePath}`;
    try {
      await fetch(deleteUrl, {
        method: 'DELETE',
        headers: { 'AccessKey': BUNNY_STORAGE_API_KEY },
      });
    } catch {
      // Continue to delete DB record
    }
  }

  const { error: dbError } = await supabase
    .from('file_uploads')
    .delete()
    .eq('id', fileId);

  if (dbError) return { error: 'Failed to delete file' };

  return { success: true };
}
