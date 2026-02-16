'use server'

import { createClient } from '@/lib/supabase/server'

interface SalespersonResult {
  id: string
  name: string
  initials: string
  userId: string | null
}

export async function getCurrentSalesperson(): Promise<SalespersonResult | null> {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Find team member linked to this user
  const { data: teamMember, error } = await supabase
    .from('team_members')
    .select('id, name, user_id')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .limit(1)
    .single()

  if (error || !teamMember) return null

  const initials = teamMember.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return {
    id: teamMember.id,
    name: teamMember.name,
    initials,
    userId: teamMember.user_id,
  }
}
