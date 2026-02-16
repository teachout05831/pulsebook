import { getAuthCompany } from '@/lib/auth/getAuthCompany';

const INTERACTION_FIELDS = 'id, company_id, customer_id, type, direction, subject, details, outcome, duration_seconds, performed_by, performed_by_name, created_at';

export async function getInteractions(customerId: string) {
  const { supabase, companyId } = await getAuthCompany();

  const { data, error } = await supabase
    .from('interactions')
    .select(INTERACTION_FIELDS)
    .eq('company_id', companyId)
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;

  return (data || []).map((item) => ({
    id: item.id,
    companyId: item.company_id,
    customerId: item.customer_id,
    type: item.type,
    direction: item.direction,
    subject: item.subject,
    details: item.details,
    outcome: item.outcome,
    durationSeconds: item.duration_seconds,
    performedBy: item.performed_by,
    performedByName: item.performed_by_name,
    createdAt: item.created_at,
  }));
}
