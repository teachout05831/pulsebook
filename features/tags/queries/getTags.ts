import { createClient } from '@/lib/supabase/server'
import type { TagEntityType } from '../types'

export async function getTags(entityType: TagEntityType = 'customer', from = 0, to = 49) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .single()

  if (!profile?.active_company_id) throw new Error('No active company')

  const { data, error } = await supabase
    .from('tags')
    .select('id, company_id, name, color, source, external_id, entity_type, created_at')
    .eq('company_id', profile.active_company_id)
    .eq('entity_type', entityType)
    .order('name', { ascending: true })
    .range(from, to)

  if (error) throw error

  return data || []
}
