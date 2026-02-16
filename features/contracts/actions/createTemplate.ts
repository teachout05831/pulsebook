'use server'

import { createClient } from '@/lib/supabase/server'
import type { CreateTemplateInput } from '../types'

export async function createTemplate(input: CreateTemplateInput) {
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
    return { error: 'Template name is required' }
  }

  const { data, error } = await supabase
    .from('contract_templates')
    .insert({
      company_id: profile.active_company_id,
      name: input.name.trim(),
      description: input.description || null,
      category: input.category || 'general',
      design_theme: input.designTheme || 'default',
      blocks: input.blocks || [],
    })
    .select('id, name')
    .single()

  if (error) {
    if (error.code === '23505') return { error: 'A template with this name already exists' }
    return { error: 'Failed to create template' }
  }

  return { success: true, data }
}
