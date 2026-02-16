import { createClient } from '@/lib/supabase/server'
import type { AuthUser } from '../types'

export async function getUser(): Promise<AuthUser | null> {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  // Get extended user profile
  const { data: profile } = await supabase
    .from('users')
    .select('id, email, full_name, active_company_id')
    .eq('id', user.id)
    .limit(1)
    .single()

  if (!profile) {
    return null
  }

  return {
    id: profile.id,
    email: profile.email,
    fullName: profile.full_name,
    activeCompanyId: profile.active_company_id,
  }
}
