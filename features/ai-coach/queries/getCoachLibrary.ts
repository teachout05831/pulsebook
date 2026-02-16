import { createClient } from '@/lib/supabase/server'

/**
 * Get the AI Coach customization library for the active company.
 * Returns raw JSONB data (snake_case) — API route handles case conversion.
 */
export async function getCoachLibrary() {
  const supabase = await createClient()

  // SECURITY: Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Get active company
  const { data: userData } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .limit(1)
    .single()

  if (!userData?.active_company_id) throw new Error('No active company')

  // SECURITY: Filter by company_id, specific field select
  const { data, error } = await supabase
    .from('consultation_settings')
    .select('ai_coach_library')
    .eq('company_id', userData.active_company_id)
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data?.ai_coach_library || {}
}
