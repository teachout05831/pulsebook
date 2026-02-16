'use server'

import { createClient } from '@/lib/supabase/server'
import type { ReorderItem } from '../types'

export async function reorderCustomFields(items: ReorderItem[]) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .single()

  if (!profile?.active_company_id) return { error: 'No active company' }
  if (!items || items.length === 0) return { error: 'No items to reorder' }

  for (const item of items) {
    const { error } = await supabase
      .from('custom_field_definitions')
      .update({
        sort_order: item.sortOrder,
        section_order: item.sectionOrder,
        updated_at: new Date().toISOString(),
      })
      .eq('id', item.id)
      .eq('company_id', profile.active_company_id)

    if (error) return { error: 'Failed to reorder fields' }
  }

  return { success: true }
}
