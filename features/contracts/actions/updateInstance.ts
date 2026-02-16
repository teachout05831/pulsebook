'use server'

import { createClient } from '@/lib/supabase/server'
import type { ContractBlock } from '../types'

export async function updateInstance(
  id: string,
  input: { status?: string; filledBlocks?: ContractBlock[] }
) {
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
    .from('contract_instances')
    .select('company_id')
    .eq('id', id)
    .single()

  if (!existing) return { error: 'Contract not found' }
  if (existing.company_id !== profile.active_company_id) return { error: 'Not authorized' }

  const now = new Date().toISOString()
  const updates: Record<string, unknown> = { updated_at: now }

  if (input.filledBlocks !== undefined) updates.filled_blocks = input.filledBlocks
  if (input.status !== undefined) {
    updates.status = input.status
    if (input.status === 'sent') updates.sent_at = now
    if (input.status === 'viewed') updates.viewed_at = now
    if (input.status === 'signed') updates.signed_at = now
    if (input.status === 'paid') updates.paid_at = now
    if (input.status === 'completed') updates.completed_at = now
  }

  const { error } = await supabase
    .from('contract_instances')
    .update(updates)
    .eq('id', id)

  if (error) return { error: 'Failed to update contract' }
  return { success: true }
}
