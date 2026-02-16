'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Save AI Coach customization library for the active company.
 * Receives raw JSONB data (snake_case) — API route handles case conversion.
 */
export async function updateCoachLibrary(library: Record<string, unknown>) {
  const supabase = await createClient()

  // SECURITY: Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Get active company
  const { data: userData } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .limit(1)
    .single()

  if (!userData?.active_company_id) return { error: 'No active company' }

  // VALIDATION
  const ctx = library.company_context
  if (ctx && typeof ctx === 'string' && ctx.length > 2000) {
    return { error: 'Company context must be under 2000 characters' }
  }

  const customObjs = library.custom_objections
  if (Array.isArray(customObjs) && customObjs.length > 20) {
    return { error: 'Maximum 20 custom objections' }
  }

  // Save (upsert pattern)
  const { error } = await supabase
    .from('consultation_settings')
    .upsert(
      {
        company_id: userData.active_company_id,
        ai_coach_library: library,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'company_id' }
    )
    .select('id')
    .single()

  if (error) return { error: 'Failed to save' }
  return { success: true }
}
