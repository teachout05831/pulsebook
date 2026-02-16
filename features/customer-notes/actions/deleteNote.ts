'use server'

import { createClient } from '@/lib/supabase/server'
import type { NoteActionResult } from '../types'

export async function deleteNote(noteId: string): Promise<NoteActionResult> {
  const supabase = await createClient()

  // 1. Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // 2. Validate input
  if (!noteId) {
    return { error: 'Note ID is required' }
  }

  // 3. Delete note (RLS will verify ownership)
  const { error } = await supabase
    .from('customer_notes')
    .delete()
    .eq('id', noteId)

  if (error) {
    console.error('Failed to delete note:', error)
    return { error: 'Failed to delete note' }
  }

  return { success: true }
}
