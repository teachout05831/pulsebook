import { createAdminClient } from '@/lib/supabase/admin';

export async function getPresentedEstimate(consultationId: string) {
  const admin = createAdminClient();

  // Get consultation's presented estimate
  const { data: consultation, error: cErr } = await admin
    .from('consultations')
    .select('presented_estimate_id, company_id')
    .eq('id', consultationId)
    .limit(1)
    .single();

  if (cErr || !consultation) throw new Error('Consultation not found');
  if (!consultation.presented_estimate_id) throw new Error('No estimate presented');

  // Get estimate details
  const { data: estimate, error: eErr } = await admin
    .from('estimates')
    .select('line_items, subtotal, tax_rate, tax_amount, total, notes')
    .eq('id', consultation.presented_estimate_id)
    .eq('company_id', consultation.company_id)
    .limit(1)
    .single();

  if (eErr || !estimate) throw new Error('Estimate not found');

  // Get company name for branding
  const { data: company } = await admin
    .from('companies')
    .select('name')
    .eq('id', consultation.company_id)
    .limit(1)
    .single();

  return {
    line_items: estimate.line_items,
    subtotal: estimate.subtotal,
    tax_rate: estimate.tax_rate,
    tax_amount: estimate.tax_amount,
    total: estimate.total,
    notes: estimate.notes,
    company_name: company?.name || 'Company',
  };
}
