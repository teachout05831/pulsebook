'use server';

import { createClient } from '@/lib/supabase/server';
import type { CustomerFile } from '../types';

export async function getCustomerFiles(customerId: string): Promise<CustomerFile[]> {
  const supabase = await createClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('file_uploads')
    .select('id, company_id, customer_id, job_id, file_name, file_type, file_size, storage_path, category, description, is_signed, created_by, created_at')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching files:', error);
    return [];
  }

  return (data || []).map((file) => ({
    id: file.id,
    companyId: file.company_id,
    customerId: file.customer_id,
    jobId: file.job_id,
    fileName: file.file_name,
    fileType: file.file_type,
    fileSize: file.file_size,
    storagePath: file.storage_path,
    category: file.category,
    description: file.description,
    isSigned: file.is_signed,
    createdBy: file.created_by,
    createdAt: new Date(file.created_at),
  }));
}
