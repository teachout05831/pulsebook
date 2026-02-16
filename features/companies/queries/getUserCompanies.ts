import { createClient } from '@/lib/supabase/server'
import type { UserCompany } from '../types'

export async function getUserCompanies(): Promise<UserCompany[]> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return []
  }

  const { data, error } = await supabase
    .from('user_companies')
    .select(`
      id,
      user_id,
      company_id,
      role,
      created_at,
      companies (
        id,
        name,
        slug,
        settings,
        created_at,
        updated_at
      )
    `)
    .eq('user_id', user.id)
    .limit(50)

  if (error || !data) {
    return []
  }

  return data.map((uc) => ({
    id: uc.id,
    userId: uc.user_id,
    companyId: uc.company_id,
    role: uc.role as 'owner' | 'admin' | 'member',
    createdAt: uc.created_at,
    company: {
      id: (uc.companies as any).id,
      name: (uc.companies as any).name,
      slug: (uc.companies as any).slug,
      settings: (uc.companies as any).settings || {},
      createdAt: (uc.companies as any).created_at,
      updatedAt: (uc.companies as any).updated_at,
    },
  }))
}
