import { createClient } from '@/lib/supabase/server'
import type { CustomerNote } from '../types'

export async function getCustomerNotes(customerId: string): Promise<CustomerNote[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('customer_notes')
    .select('id, company_id, customer_id, content, is_pinned, created_by, created_at, updated_at, users:created_by(full_name, email)')
    .eq('customer_id', customerId)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) throw new Error(`Failed to fetch notes: ${error.message}`)

  return (data || []).map((note) => {
    const author = note.users as { full_name?: string; email?: string } | null
    const authorName = author?.full_name || author?.email || 'Unknown'
    return {
      id: note.id,
      companyId: note.company_id,
      customerId: note.customer_id,
      content: note.content,
      isPinned: note.is_pinned,
      createdBy: note.created_by,
      createdAt: new Date(note.created_at),
      updatedAt: new Date(note.updated_at),
      authorName,
      authorInitials: authorName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
    }
  })
}
