'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export async function approveEstimate(consultationId: string) {
  if (!consultationId) return { error: 'Missing consultationId' }

  const admin = createAdminClient()

  // Get consultation's presented estimate
  const { data: consultation } = await admin
    .from('consultations')
    .select('presented_estimate_id')
    .eq('id', consultationId)
    .limit(1)
    .single()

  if (!consultation?.presented_estimate_id) {
    return { error: 'No estimate presented' }
  }

  // Update estimate status to approved
  const { error } = await admin
    .from('estimates')
    .update({ status: 'approved' })
    .eq('id', consultation.presented_estimate_id)

  if (error) return { error: 'Failed to approve estimate' }
  return { success: true as const }
}
