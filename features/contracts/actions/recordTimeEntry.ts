'use server'

import { createClient } from '@/lib/supabase/server'
import type { RecordTimeEntryInput } from '../types'

export async function recordTimeEntry(input: RecordTimeEntryInput) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .single()

  if (!profile?.active_company_id) return { error: 'No active company' }

  if (!input.contractId) return { error: 'Contract ID is required' }
  if (!input.eventType) return { error: 'Event type is required' }

  const { data: contract } = await supabase
    .from('contract_instances')
    .select('company_id')
    .eq('id', input.contractId)
    .single()

  if (!contract) return { error: 'Contract not found' }
  if (contract.company_id !== profile.active_company_id) return { error: 'Not authorized' }

  const { data, error } = await supabase
    .from('contract_time_entries')
    .insert({
      contract_id: input.contractId,
      event_type: input.eventType,
      reason: input.reason || 'work',
      is_billable: input.isBillable !== undefined ? input.isBillable : true,
      recorded_by: user.id,
      gps_latitude: input.gpsLatitude || null,
      gps_longitude: input.gpsLongitude || null,
      notes: input.notes || null,
    })
    .select('id')
    .single()

  if (error) return { error: 'Failed to record time entry' }
  return { success: true, data: { id: data.id } }
}
