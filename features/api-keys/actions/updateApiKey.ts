'use server'

import { createClient } from '@/lib/supabase/server'

export async function updateApiKey(id: string, input: { name?: string }) {
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

  // Ownership check
  const { data: existing } = await supabase
    .from('api_keys')
    .select('company_id')
    .eq('id', id)
    .single()

  if (!existing) return { error: 'API key not found' }
  if (existing.company_id !== profile.active_company_id) return { error: 'Not authorized' }

  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (input.name !== undefined) {
    if (input.name.trim().length < 2) return { error: 'Name must be at least 2 characters' }
    updateData.name = input.name.trim()
  }

  const { error } = await supabase
    .from('api_keys')
    .update(updateData)
    .eq('id', id)

  if (error) return { error: 'Failed to update API key' }
  return { success: true }
}
