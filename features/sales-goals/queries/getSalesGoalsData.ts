import { createClient } from '@/lib/supabase/server'

export async function getSalesGoalsData() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: userData } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .single()

  if (!userData?.active_company_id) throw new Error('No active company')

  const { data, error } = await supabase
    .from('team_members')
    .select('id, name, role')
    .eq('company_id', userData.active_company_id)
    .eq('is_active', true)
    .order('name')
    .limit(50)

  if (error) throw error
  return (data || []).map((m) => ({ id: m.id, name: m.name, role: m.role }))
}
