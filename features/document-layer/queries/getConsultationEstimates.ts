import { createClient } from '@/lib/supabase/server';

const FIELDS = 'id, title, customer_name, host_name, status, pipeline_status, pipeline_error, estimate_id, duration_seconds, created_at';

export async function getConsultationEstimates(companyId: string, page: number, limit: number) {
  const supabase = await createClient();
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabase
    .from('consultations')
    .select(FIELDS, { count: 'exact' })
    .eq('company_id', companyId)
    .neq('pipeline_status', 'idle')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  return {
    data: data || [],
    total: count || 0,
  };
}
