'use server'

import { createClient } from '@/lib/supabase/server'
import type { CreateInstanceInput } from '../types'

export async function createInstance(input: CreateInstanceInput) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .single()

  if (!profile?.active_company_id) return { error: 'No active company' }

  if (!input.templateId) return { error: 'Template ID is required' }
  if (!input.jobId) return { error: 'Job ID is required' }
  if (!input.customerId) return { error: 'Customer ID is required' }

  const { data: template } = await supabase
    .from('contract_templates')
    .select('id, company_id, name, description, category, design_theme, blocks, stage_colors, is_active, version')
    .eq('id', input.templateId)
    .single()

  if (!template) return { error: 'Template not found' }
  if (template.company_id !== profile.active_company_id) return { error: 'Not authorized' }
  if (!template.is_active) return { error: 'Template is not active' }

  const signingToken = crypto.randomUUID()

  // Snapshot brand data into company_header blocks
  let blocks = (template.blocks || []) as Record<string, unknown>[]
  const hasCompanyHeader = blocks.some((b) => b.type === 'company_header')

  if (hasCompanyHeader) {
    const { data: brandKit } = await supabase
      .from('company_brand_kits')
      .select('logo_url, primary_color, tagline')
      .eq('company_id', profile.active_company_id)
      .limit(1)
      .single()

    const { data: company } = await supabase
      .from('companies')
      .select('name, phone, email, address, city, state, zip_code')
      .eq('id', profile.active_company_id)
      .single()

    const addr = company ? [company.address, company.city, company.state, company.zip_code].filter(Boolean).join(', ') : null

    blocks = blocks.map((b) => {
      if (b.type !== 'company_header') return b
      const content = (b.content || {}) as Record<string, unknown>
      return { ...b, content: { ...content, logoUrl: brandKit?.logo_url || null, companyName: company?.name || null, tagline: brandKit?.tagline || null, phone: company?.phone || null, email: company?.email || null, address: addr, primaryColor: brandKit?.primary_color || '#2563eb' } }
    })
  }

  const { data, error } = await supabase
    .from('contract_instances')
    .insert({
      company_id: profile.active_company_id,
      template_id: input.templateId,
      job_id: input.jobId,
      customer_id: input.customerId,
      filled_blocks: blocks,
      template_snapshot: template,
      signing_token: signingToken,
      created_by: user.id,
    })
    .select('id, signing_token')
    .single()

  if (error) return { error: 'Failed to create contract instance' }
  return { success: true, data }
}
