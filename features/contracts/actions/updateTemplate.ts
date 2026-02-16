'use server'

import { createClient } from '@/lib/supabase/server'
import type { UpdateTemplateInput } from '../types'

export async function updateTemplate(id: string, input: UpdateTemplateInput) {
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
    .from('contract_templates')
    .select('company_id')
    .eq('id', id)
    .single()

  if (!existing) return { error: 'Template not found' }
  if (existing.company_id !== profile.active_company_id) return { error: 'Not authorized' }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (input.name !== undefined) updates.name = input.name.trim()
  if (input.description !== undefined) updates.description = input.description
  if (input.category !== undefined) updates.category = input.category
  if (input.designTheme !== undefined) updates.design_theme = input.designTheme
  if (input.blocks !== undefined) updates.blocks = input.blocks
  if (input.stageColors !== undefined) updates.stage_colors = input.stageColors
  if (input.isActive !== undefined) updates.is_active = input.isActive
  if (input.isDefault !== undefined) updates.is_default = input.isDefault

  const { error } = await supabase
    .from('contract_templates')
    .update(updates)
    .eq('id', id)

  if (error) return { error: 'Failed to update template' }
  return { success: true }
}
