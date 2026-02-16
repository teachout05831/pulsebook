'use server'

import { createClient } from '@/lib/supabase/server'

export async function deleteTag(id: string) {
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
    .from('tags')
    .select('company_id, source')
    .eq('id', id)
    .single()

  if (!existing) return { error: 'Tag not found' }
  if (existing.company_id !== profile.active_company_id) return { error: 'Not authorized' }
  if (existing.source === 'external') return { error: 'Cannot delete external tags' }

  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', id)

  if (error) return { error: 'Failed to delete tag' }
  return { success: true }
}
