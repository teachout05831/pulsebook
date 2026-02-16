import { createClient } from '@/lib/supabase/server'
import type { SessionResult, AuthUser } from '../types'

export async function getSession(): Promise<SessionResult> {
  const supabase = await createClient()

  const { data: { session }, error } = await supabase.auth.getSession()

  if (error || !session) {
    return { user: null, session: null }
  }

  // Get extended user profile
  const { data: profile } = await supabase
    .from('users')
    .select('id, email, full_name, active_company_id')
    .eq('id', session.user.id)
    .limit(1)
    .single()

  const user: AuthUser | null = profile ? {
    id: profile.id,
    email: profile.email,
    fullName: profile.full_name,
    activeCompanyId: profile.active_company_id,
  } : null

  return { user, session }
}
