'use server'

import { createClient } from '@/lib/supabase/server'
import type { CreateCustomFieldInput } from '../types'

function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
}

export async function createCustomField(input: CreateCustomFieldInput) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .single()

  if (!profile?.active_company_id) return { error: 'No active company' }

  if (!input.label || input.label.trim().length < 1) {
    return { error: 'Label is required' }
  }
  if (!input.fieldType) {
    return { error: 'Field type is required' }
  }
  if (!input.entityType) {
    return { error: 'Entity type is required' }
  }

  const fieldKey = slugify(input.label)
  if (!fieldKey) return { error: 'Invalid label' }

  const { data: maxOrder } = await supabase
    .from('custom_field_definitions')
    .select('sort_order')
    .eq('company_id', profile.active_company_id)
    .eq('entity_type', input.entityType)
    .eq('section', input.section || 'General')
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()

  const nextOrder = (maxOrder?.sort_order ?? -1) + 1

  const { data, error } = await supabase
    .from('custom_field_definitions')
    .insert({
      company_id: profile.active_company_id,
      entity_type: input.entityType,
      section: input.section || 'General',
      field_key: fieldKey,
      label: input.label.trim(),
      field_type: input.fieldType,
      options: input.options || null,
      is_required: input.isRequired || false,
      placeholder: input.placeholder || null,
      sort_order: nextOrder,
    })
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') return { error: 'A field with this name already exists' }
    return { error: 'Failed to create custom field' }
  }

  return { success: true, data }
}
