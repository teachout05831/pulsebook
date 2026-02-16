import { createClient } from '@/lib/supabase/server'
import type { TimeEntry } from '../types'

export async function getTimeEntries(contractId: string): Promise<TimeEntry[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .single()

  if (!profile?.active_company_id) throw new Error('No active company')

  // Verify the contract belongs to this company
  const { data: contract } = await supabase
    .from('contract_instances')
    .select('company_id')
    .eq('id', contractId)
    .single()

  if (!contract) throw new Error('Contract not found')
  if (contract.company_id !== profile.active_company_id) throw new Error('Not authorized')

  const { data, error } = await supabase
    .from('contract_time_entries')
    .select('id, contract_id, event_type, reason, is_billable, recorded_at, recorded_by, gps_latitude, gps_longitude, notes, original_recorded_at, edited_at, edited_by, edit_reason')
    .eq('contract_id', contractId)
    .order('recorded_at', { ascending: true })
    .limit(200)

  if (error) throw error

  return (data || []).map((row) => ({
    id: row.id,
    contractId: row.contract_id,
    eventType: row.event_type as TimeEntry['eventType'],
    reason: row.reason as TimeEntry['reason'],
    isBillable: row.is_billable,
    recordedAt: row.recorded_at,
    recordedBy: row.recorded_by,
    gpsLatitude: row.gps_latitude,
    gpsLongitude: row.gps_longitude,
    notes: row.notes,
    originalRecordedAt: row.original_recorded_at,
    editedAt: row.edited_at,
    editedBy: row.edited_by,
    editReason: row.edit_reason,
  }))
}
