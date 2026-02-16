'use server'

import { createClient } from '@/lib/supabase/server'
import type { UpdateCustomFieldInput } from '../types'

export async function updateCustomField(id: string, input: UpdateCustomFieldInput) {
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
    .from('custom_field_definitions')
    .select('company_id')
    .eq('id', id)
    .single()

  if (!existing) return { error: 'Field not found' }
  if (existing.company_id !== profile.active_company_id) return { error: 'Not authorized' }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (input.label !== undefined) updates.label = input.label.trim()
  if (input.fieldType !== undefined) updates.field_type = input.fieldType
  if (input.section !== undefined) updates.section = input.section
  if (input.options !== undefined) updates.options = input.options
  if (input.isRequired !== undefined) updates.is_required = input.isRequired
  if (input.placeholder !== undefined) updates.placeholder = input.placeholder
  if (input.sortOrder !== undefined) updates.sort_order = input.sortOrder
  if (input.sectionOrder !== undefined) updates.section_order = input.sectionOrder
  if (input.isActive !== undefined) updates.is_active = input.isActive

  const { error } = await supabase
    .from('custom_field_definitions')
    .update(updates)
    .eq('id', id)

  if (error) return { error: 'Failed to update custom field' }
  return { success: true }
}
