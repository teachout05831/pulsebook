'use server'

import { createClient } from '@/lib/supabase/server'

export async function deleteCustomField(id: string) {
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

  const { data: existing } = await supabase
    .from('custom_field_definitions')
    .select('company_id')
    .eq('id', id)
    .single()

  if (!existing) return { error: 'Field not found' }
  if (existing.company_id !== profile.active_company_id) return { error: 'Not authorized' }

  const { error } = await supabase
    .from('custom_field_definitions')
    .delete()
    .eq('id', id)

  if (error) return { error: 'Failed to delete custom field' }
  return { success: true }
}
