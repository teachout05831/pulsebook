'use server'

import { createClient } from '@/lib/supabase/server'
import type { UpdateTimeEntryInput } from '../types'

export async function updateTimeEntry(id: string, input: UpdateTimeEntryInput) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .single()

  if (!profile?.active_company_id) return { error: 'No active company' }
  if (!id) return { error: 'ID is required' }

  const { data: entry } = await supabase
    .from('contract_time_entries')
    .select('contract_id, recorded_at, original_recorded_at')
    .eq('id', id)
    .single()

  if (!entry) return { error: 'Time entry not found' }

  const { data: contract } = await supabase
    .from('contract_instances')
    .select('company_id')
    .eq('id', entry.contract_id)
    .single()

  if (!contract) return { error: 'Contract not found' }
  if (contract.company_id !== profile.active_company_id) return { error: 'Not authorized' }

  const now = new Date().toISOString()
  const updates: Record<string, unknown> = {
    edited_at: now,
    edited_by: user.id,
    edit_reason: input.editReason,
  }

  if (!entry.original_recorded_at) {
    updates.original_recorded_at = entry.recorded_at
  }

  if (input.recordedAt !== undefined) updates.recorded_at = input.recordedAt
  if (input.reason !== undefined) updates.reason = input.reason
  if (input.isBillable !== undefined) updates.is_billable = input.isBillable
  if (input.notes !== undefined) updates.notes = input.notes

  const { error } = await supabase
    .from('contract_time_entries')
    .update(updates)
    .eq('id', id)

  if (error) return { error: 'Failed to update time entry' }
  return { success: true }
}
