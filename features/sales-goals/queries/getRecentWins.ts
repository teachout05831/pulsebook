'use server'

import { createClient } from '@/lib/supabase/server'
import type { RecentWin } from '../types'

export async function getRecentWins(teamMemberId: string, limit = 5): Promise<RecentWin[]> {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Validate input
  if (!teamMemberId) return []

  // Get leads assigned to this salesperson
  const { data: leads } = await supabase
    .from('customers')
    .select('id, name')
    .eq('assigned_to', teamMemberId)
    .limit(100)

  if (!leads?.length) return []

  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString()
  const { data: invoices } = await supabase
    .from('invoices')
    .select('id, total, paid_at, customer_id')
    .in('customer_id', leads.map(l => l.id))
    .in('status', ['paid', 'partial'])
    .not('paid_at', 'is', null)
    .gte('paid_at', thirtyDaysAgo)
    .order('paid_at', { ascending: false })
    .limit(limit)

  if (!invoices?.length) return []

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today.getTime() - 86400000)

  return invoices.map(inv => {
    const customer = leads.find(l => l.id === inv.customer_id)
    const paidDate = new Date(inv.paid_at)
    paidDate.setHours(0, 0, 0, 0)

    let dateLabel: string
    if (paidDate.getTime() === today.getTime()) {
      dateLabel = 'Today'
    } else if (paidDate.getTime() === yesterday.getTime()) {
      dateLabel = 'Yesterday'
    } else {
      dateLabel = paidDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    return {
      id: inv.id,
      customerName: customer?.name || 'Unknown',
      amount: parseFloat(inv.total || '0'),
      date: dateLabel,
    }
  })
}
