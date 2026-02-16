'use server';

import { createClient } from '@/lib/supabase/server';

const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE;
const BUNNY_STORAGE_API_KEY = process.env.BUNNY_STORAGE_API_KEY;
const BUNNY_CDN_URL = process.env.BUNNY_CDN_URL;

interface DeleteResult {
  success?: boolean;
  error?: string;
}

export async function deleteFile(fileId: string): Promise<DeleteResult> {
  const supabase = await createClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // Validate input
  if (!fileId) return { error: 'File ID is required' };

  // Get file record to get storage path
  const { data: file, error: fetchError } = await supabase
    .from('file_uploads')
    .select('storage_path')
    .eq('id', fileId)
    .single();

  if (fetchError || !file) {
    return { error: 'File not found' };
  }

  // Delete from Bunny.net storage
  if (BUNNY_STORAGE_ZONE && BUNNY_STORAGE_API_KEY && BUNNY_CDN_URL) {
    // Extract path from CDN URL
    const storagePath = file.storage_path.replace(`${BUNNY_CDN_URL}/`, '');
    const deleteUrl = `https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}/${storagePath}`;

    try {
      await fetch(deleteUrl, {
        method: 'DELETE',
        headers: { 'AccessKey': BUNNY_STORAGE_API_KEY },
      });
    } catch (e) {
      console.error('Bunny delete error:', e);
      // Continue to delete DB record anyway
    }
  }

  // Delete database record
  const { error: dbError } = await supabase
    .from('file_uploads')
    .delete()
    .eq('id', fileId);

  if (dbError) {
    console.error('Database delete error:', dbError);
    return { error: 'Failed to delete file' };
  }

  return { success: true };
}
