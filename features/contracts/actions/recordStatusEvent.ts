'use server'

import { createClient } from '@/lib/supabase/server'

interface RecordStatusEventInput {
  contractId: string
  stepLabel: string
  stepIndex: number
  gpsLatitude?: number | null
  gpsLongitude?: number | null
  notes?: string | null
}

export async function recordStatusEvent(input: RecordStatusEventInput) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: userData } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .single()

  if (!userData?.active_company_id) return { error: 'No active company' }

  if (!input.contractId || !input.stepLabel) return { error: 'Missing required fields' }

  // Ownership check
  const { data: contract } = await supabase
    .from('contract_instances')
    .select('company_id')
    .eq('id', input.contractId)
    .single()

  if (!contract) return { error: 'Contract not found' }
  if (contract.company_id !== userData.active_company_id) return { error: 'Not authorized' }

  const { data, error } = await supabase
    .from('contract_status_events')
    .insert({
      contract_id: input.contractId,
      step_label: input.stepLabel,
      step_index: input.stepIndex,
      recorded_by: user.id,
      gps_latitude: input.gpsLatitude ?? null,
      gps_longitude: input.gpsLongitude ?? null,
      notes: input.notes ?? null,
    })
    .select('id, contract_id, step_label, step_index, recorded_at, recorded_by, gps_latitude, gps_longitude, notes')
    .single()

  if (error) return { error: 'Failed to record status event' }
  return { success: true as const, data }
}
