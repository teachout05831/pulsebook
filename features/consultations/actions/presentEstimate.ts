'use server'

import { createClient } from '@/lib/supabase/server'

export async function presentEstimate(consultationId: string, estimateId: string, companyId: string) {
  if (!consultationId || !estimateId) return { error: 'Missing required fields' }

  const supabase = await createClient()

  // Verify consultation belongs to company
  const { data: consultation } = await supabase
    .from('consultations')
    .select('id')
    .eq('id', consultationId)
    .eq('company_id', companyId)
    .limit(1)
    .single()

  if (!consultation) return { error: 'Consultation not found' }

  // Verify estimate belongs to company
  const { data: estimate } = await supabase
    .from('estimates')
    .select('id')
    .eq('id', estimateId)
    .eq('company_id', companyId)
    .limit(1)
    .single()

  if (!estimate) return { error: 'Estimate not found' }

  const { error } = await supabase
    .from('consultations')
    .update({ presented_estimate_id: estimateId })
    .eq('id', consultationId)

  if (error) return { error: 'Failed to present estimate' }
  return { success: true as const }
}
