'use server'

import { createClient } from '@/lib/supabase/server'
import type { UpdateTagInput } from '../types'

export async function updateTag(id: string, input: UpdateTagInput) {
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

  const updates: Record<string, unknown> = {}
  if (input.name !== undefined) updates.name = input.name.trim()
  if (input.color !== undefined) updates.color = input.color

  const { error } = await supabase
    .from('tags')
    .update(updates)
    .eq('id', id)

  if (error) {
    if (error.code === '23505') return { error: 'A tag with this name already exists' }
    return { error: 'Failed to update tag' }
  }

  return { success: true }
}
