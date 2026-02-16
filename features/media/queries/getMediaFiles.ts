import { createClient } from '@/lib/supabase/server';
import type { MediaFilters } from '../types';

export async function getMediaFiles(
  companyId: string,
  filters?: MediaFilters,
) {
  const supabase = await createClient();

  let query = supabase
    .from('file_uploads')
    .select('id, company_id, customer_id, job_id, file_name, file_type, file_size, storage_path, category, description, created_by, created_at')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  if (filters?.customerId) {
    query = query.eq('customer_id', filters.customerId);
  }
  if (filters?.jobId) {
    query = query.eq('job_id', filters.jobId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}
