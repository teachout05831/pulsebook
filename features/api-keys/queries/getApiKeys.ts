import { createClient } from '@/lib/supabase/server'

export async function getApiKeys() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .single()

  if (!profile?.active_company_id) throw new Error('No active company')

  const { data, error } = await supabase
    .from('api_keys')
    .select('id, name, key_prefix, last_used_at, expires_at, is_active, created_at')
    .eq('company_id', profile.active_company_id)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error
  return data || []
}
