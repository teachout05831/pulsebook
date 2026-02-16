import { createClient } from '@/lib/supabase/server'
import type { ContractTemplate } from '../types'

export async function getTemplates(): Promise<ContractTemplate[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .single()

  if (!profile?.active_company_id) throw new Error('No active company')

  const { data, error } = await supabase
    .from('contract_templates')
    .select('id, company_id, name, description, category, design_theme, blocks, stage_colors, is_active, is_default, version, attachment_mode, applies_to, created_at, updated_at')
    .eq('company_id', profile.active_company_id)
    .order('name', { ascending: true })
    .limit(50)

  if (error) throw error

  return (data || []).map((row) => ({
    id: row.id,
    companyId: row.company_id,
    name: row.name,
    description: row.description,
    category: row.category,
    designTheme: row.design_theme,
    blocks: row.blocks as ContractTemplate['blocks'],
    stageColors: row.stage_colors as ContractTemplate['stageColors'],
    isActive: row.is_active,
    isDefault: row.is_default,
    version: row.version,
    attachmentMode: (row.attachment_mode as 'auto' | 'manual') || 'manual',
    appliesTo: (row.applies_to as string[]) || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))
}
