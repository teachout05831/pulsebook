'use server';

import { createClient } from '@/lib/supabase/server';
import type { FileCategory } from '../types';

interface UploadResult {
  success?: boolean;
  error?: string;
  fileId?: string;
}

const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE;
const BUNNY_STORAGE_API_KEY = process.env.BUNNY_STORAGE_API_KEY;
const BUNNY_CDN_URL = process.env.BUNNY_CDN_URL;

export async function uploadFile(formData: FormData): Promise<UploadResult> {
  const supabase = await createClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // Get active company
  const { data: userData } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .single();

  if (!userData?.active_company_id) return { error: 'No active company' };

  // Extract form data
  const file = formData.get('file') as File;
  const customerId = formData.get('customerId') as string;
  const category = formData.get('category') as FileCategory;
  const description = formData.get('description') as string | null;

  // Validate inputs
  if (!file) return { error: 'No file provided' };
  if (!customerId) return { error: 'Customer ID is required' };
  if (!category) return { error: 'Category is required' };

  // Check Bunny.net config
  if (!BUNNY_STORAGE_ZONE || !BUNNY_STORAGE_API_KEY) {
    console.error('Bunny config missing:', {
      hasZone: !!BUNNY_STORAGE_ZONE,
      hasKey: !!BUNNY_STORAGE_API_KEY,
      keyLength: BUNNY_STORAGE_API_KEY?.length
    });
    return { error: 'Storage not configured' };
  }

  // Debug: Log full config for troubleshooting
  console.log('Bunny config:', {
    zone: BUNNY_STORAGE_ZONE,
    keyFormat: `${BUNNY_STORAGE_API_KEY.substring(0, 8)}...${BUNNY_STORAGE_API_KEY.substring(BUNNY_STORAGE_API_KEY.length - 4)}`,
    keyLength: BUNNY_STORAGE_API_KEY.length,
    keyHasSpaces: BUNNY_STORAGE_API_KEY.includes(' '),
    keyHasNewlines: BUNNY_STORAGE_API_KEY.includes('\n'),
  });

  // Generate unique storage path
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storagePath = `${userData.active_company_id}/${customerId}/${timestamp}_${safeName}`;

  // Convert file to buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload to Bunny.net Storage (LA region)
  const uploadUrl = `https://la.storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}/${storagePath}`;

  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'AccessKey': BUNNY_STORAGE_API_KEY,
      'Content-Type': file.type || 'application/octet-stream',
    },
    body: buffer,
  });

  if (!uploadResponse.ok) {
    console.error('Bunny upload error:', await uploadResponse.text());
    return { error: 'Failed to upload file' };
  }

  // Create database record with CDN URL as storage path
  const cdnUrl = `${BUNNY_CDN_URL}/${storagePath}`;

  const { data, error: dbError } = await supabase
    .from('file_uploads')
    .insert({
      company_id: userData.active_company_id,
      customer_id: customerId,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      storage_path: cdnUrl,
      category,
      description: description || null,
      created_by: user.id,
    })
    .select('id')
    .single();

  if (dbError) {
    // Rollback: delete from Bunny (use same LA region endpoint)
    await fetch(uploadUrl, {
      method: 'DELETE',
      headers: { 'AccessKey': BUNNY_STORAGE_API_KEY },
    });
    console.error('Database insert error:', dbError);
    return { error: 'Failed to save file record' };
  }

  return { success: true, fileId: data.id };
}
