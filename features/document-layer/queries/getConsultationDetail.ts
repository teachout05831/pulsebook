import { createClient } from '@/lib/supabase/server';

const FIELDS = 'id, company_id, customer_id, estimate_id, title, purpose, daily_room_name, daily_room_url, status, pipeline_status, pipeline_error, host_name, customer_name, started_at, ended_at, duration_seconds, created_at';

export async function getConsultationDetail(id: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: profile } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .single();

  if (!profile?.active_company_id) throw new Error('No company');

  const { data, error } = await supabase
    .from('consultations')
    .select(FIELDS)
    .eq('id', id)
    .eq('company_id', profile.active_company_id)
    .limit(1)
    .single();

  if (error || !data) throw new Error('Consultation not found');

  return {
    id: data.id,
    companyId: data.company_id,
    customerId: data.customer_id,
    estimateId: data.estimate_id,
    title: data.title,
    purpose: data.purpose,
    dailyRoomName: data.daily_room_name,
    dailyRoomUrl: data.daily_room_url,
    status: data.status,
    pipelineStatus: data.pipeline_status || 'idle',
    pipelineError: data.pipeline_error || null,
    hostName: data.host_name,
    customerName: data.customer_name,
    startedAt: data.started_at,
    endedAt: data.ended_at,
    durationSeconds: data.duration_seconds,
    createdAt: data.created_at,
  };
}
