'use server'

import { createClient } from '@/lib/supabase/server'
import type { CreateTagInput } from '../types'

export async function createTag(input: CreateTagInput) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .single()

  if (!profile?.active_company_id) return { error: 'No active company' }

  if (!input.name || input.name.trim().length < 1) {
    return { error: 'Tag name is required' }
  }

  const { data, error } = await supabase
    .from('tags')
    .insert({
      company_id: profile.active_company_id,
      name: input.name.trim(),
      color: input.color || '#6B7280',
      source: 'local',
      entity_type: input.entityType || 'customer',
    })
    .select('id, company_id, name, color, source, external_id, entity_type, created_at')
    .single()

  if (error) {
    if (error.code === '23505') return { error: 'A tag with this name already exists' }
    return { error: 'Failed to create tag' }
  }

  return { success: true, data }
}
