'use server'

import { createClient } from '@/lib/supabase/server'
import type { CreateNoteInput, NoteActionResult } from '../types'

export async function createNote(input: CreateNoteInput): Promise<NoteActionResult> {
  const supabase = await createClient()

  // 1. Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // 2. Get active company
  const { data: userData } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .single()

  if (!userData?.active_company_id) {
    return { error: 'No active company selected' }
  }

  // 3. Validate input
  if (!input.customerId) {
    return { error: 'Customer ID is required' }
  }
  if (!input.content?.trim()) {
    return { error: 'Note content is required' }
  }
  if (input.content.length > 10000) {
    return { error: 'Note content is too long (max 10000 characters)' }
  }

  // 4. Insert note
  const { data, error } = await supabase
    .from('customer_notes')
    .insert({
      company_id: userData.active_company_id,
      customer_id: input.customerId,
      content: input.content.trim(),
      is_pinned: input.isPinned || false,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create note:', error)
    return { error: 'Failed to create note' }
  }

  return {
    success: true,
    data: {
      id: data.id,
      companyId: data.company_id,
      customerId: data.customer_id,
      content: data.content,
      isPinned: data.is_pinned,
      createdBy: data.created_by,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    },
  }
}
