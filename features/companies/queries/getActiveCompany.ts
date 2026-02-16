import { createClient } from '@/lib/supabase/server'
import type { Company } from '../types'

export async function getActiveCompany(): Promise<Company | null> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return null
  }

  // Get user's active company id
  const { data: profile } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .limit(1)
    .single()

  if (!profile?.active_company_id) {
    return null
  }

  // Get company details
  const { data: company, error } = await supabase
    .from('companies')
    .select('id, name, slug, settings, created_at, updated_at')
    .eq('id', profile.active_company_id)
    .limit(1)
    .single()

  if (error || !company) {
    return null
  }

  return {
    id: company.id,
    name: company.name,
    slug: company.slug,
    settings: company.settings || {},
    createdAt: company.created_at,
    updatedAt: company.updated_at,
  }
}
