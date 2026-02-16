import { createClient } from '@/lib/supabase/server'
import type { ContractTemplate } from '../types'

export async function getTemplate(id: string): Promise<ContractTemplate | null> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .limit(1)
    .single()

  if (!profile?.active_company_id) throw new Error('No active company')

  const { data, error } = await supabase
    .from('contract_templates')
    .select('id, company_id, name, description, category, design_theme, blocks, stage_colors, is_active, is_default, version, attachment_mode, applies_to, created_at, updated_at')
    .eq('id', id)
    .limit(1)
    .single()

  if (error) return null
  if (!data) return null
  if (data.company_id !== profile.active_company_id) throw new Error('Not authorized')

  return {
    id: data.id,
    companyId: data.company_id,
    name: data.name,
    description: data.description,
    category: data.category,
    designTheme: data.design_theme,
    blocks: data.blocks as ContractTemplate['blocks'],
    stageColors: data.stage_colors as ContractTemplate['stageColors'],
    isActive: data.is_active,
    isDefault: data.is_default,
    version: data.version,
    attachmentMode: (data.attachment_mode as 'auto' | 'manual') || 'manual',
    appliesTo: (data.applies_to as string[]) || [],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}
