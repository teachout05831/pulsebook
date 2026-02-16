import { createClient } from '@/lib/supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { User } from '@supabase/supabase-js'

export class AuthError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message)
    this.name = 'AuthError'
  }
}

interface AuthCompanyResult {
  user: User
  companyId: string
  supabase: SupabaseClient
}

/**
 * Shared auth helper for API routes.
 * Consolidates the repeated pattern of:
 * 1. Create Supabase client
 * 2. Get authenticated user
 * 3. Look up active_company_id from users table
 *
 * Throws AuthError (401/403) if auth fails.
 * Use with try/catch in API route handlers.
 */
export async function getAuthCompany(): Promise<AuthCompanyResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new AuthError('Not authenticated', 401)

  const { data: userData } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .single()

  if (!userData?.active_company_id) throw new AuthError('No active company', 403)

  return { user, companyId: userData.active_company_id, supabase }
}
