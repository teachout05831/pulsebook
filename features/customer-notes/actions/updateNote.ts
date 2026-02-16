'use server'

import { createClient } from '@/lib/supabase/server'
import type { UpdateNoteInput, NoteActionResult } from '../types'

export async function updateNote(
  noteId: string,
  input: UpdateNoteInput
): Promise<NoteActionResult> {
  const supabase = await createClient()

  // 1. Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // 2. Validate input
  if (!noteId) {
    return { error: 'Note ID is required' }
  }
  if (input.content !== undefined && !input.content.trim()) {
    return { error: 'Note content cannot be empty' }
  }
  if (input.content && input.content.length > 10000) {
    return { error: 'Note content is too long (max 10000 characters)' }
  }

  // 3. Build update object
  const updateData: Record<string, unknown> = {}
  if (input.content !== undefined) {
    updateData.content = input.content.trim()
  }
  if (input.isPinned !== undefined) {
    updateData.is_pinned = input.isPinned
  }

  if (Object.keys(updateData).length === 0) {
    return { error: 'No updates provided' }
  }

  // 4. Update note (RLS will verify ownership)
  const { data, error } = await supabase
    .from('customer_notes')
    .update(updateData)
    .eq('id', noteId)
    .select()
    .single()

  if (error) {
    console.error('Failed to update note:', error)
    return { error: 'Failed to update note' }
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
