'use server';

import { createClient } from '@/lib/supabase/server';

interface UrlResult {
  url?: string;
  error?: string;
}

export async function getFileUrl(storagePath: string): Promise<UrlResult> {
  const supabase = await createClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // Validate input
  if (!storagePath) return { error: 'Storage path is required' };

  // The storage_path now contains the full CDN URL
  // Just return it directly
  return { url: storagePath };
}
