import { createClient } from '@/lib/supabase/server'

export async function getStatusEvents(contractId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: userData } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .single()

  if (!userData?.active_company_id) throw new Error('No active company')

  // Verify contract belongs to company
  const { data: contract } = await supabase
    .from('contract_instances')
    .select('id')
    .eq('id', contractId)
    .eq('company_id', userData.active_company_id)
    .single()

  if (!contract) throw new Error('Contract not found')

  const { data, error } = await supabase
    .from('contract_status_events')
    .select('id, contract_id, step_label, step_index, recorded_at, recorded_by, gps_latitude, gps_longitude, notes, created_at')
    .eq('contract_id', contractId)
    .order('recorded_at', { ascending: true })
    .limit(100)

  if (error) throw error
  return data || []
}
