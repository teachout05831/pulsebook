'use server'

import { createClient } from '@/lib/supabase/server'

export interface WeekActuals {
  bookings: number
  estimates: number
  calls: number
  revenue: number
}

export async function getWeekStats(teamMemberId: string, weekStart: string): Promise<WeekActuals> {
  const defaults: WeekActuals = { bookings: 0, estimates: 0, calls: 0, revenue: 0 }
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !teamMemberId) return defaults

  // Get this salesperson's customer IDs
  const { data: customers } = await supabase
    .from('customers')
    .select('id')
    .eq('assigned_to', teamMemberId)
    .limit(500)

  const custIds = customers?.map(c => c.id) || []

  const start = new Date(weekStart + 'T00:00:00')
  const end = new Date(start)
  end.setDate(end.getDate() + 7)
  const startStr = start.toISOString()
  const endStr = end.toISOString()

  // Calls don't depend on customer IDs
  if (custIds.length === 0) {
    const callsRes = await supabase.from('follow_ups')
      .select('id', { count: 'exact', head: true })
      .eq('assigned_to', teamMemberId).eq('status', 'completed')
      .gte('completed_at', startStr).lt('completed_at', endStr)
    return { ...defaults, calls: callsRes.count || 0 }
  }

  const [callsRes, estimatesRes, bookingsRes, revenueRes] = await Promise.all([
    supabase.from('follow_ups').select('id', { count: 'exact', head: true })
      .eq('assigned_to', teamMemberId).eq('status', 'completed')
      .gte('completed_at', startStr).lt('completed_at', endStr),
    supabase.from('estimates').select('id', { count: 'exact', head: true })
      .in('customer_id', custIds).not('sent_at', 'is', null)
      .gte('sent_at', startStr).lt('sent_at', endStr),
    supabase.from('jobs').select('id', { count: 'exact', head: true })
      .in('customer_id', custIds)
      .in('status', ['scheduled', 'pending', 'in_progress', 'completed'])
      .gte('created_at', startStr).lt('created_at', endStr),
    supabase.from('invoices').select('total')
      .in('customer_id', custIds).in('status', ['paid', 'partial'])
      .gte('paid_at', startStr).lt('paid_at', endStr).limit(200),
  ])

  return {
    calls: callsRes.count || 0,
    estimates: estimatesRes.count || 0,
    bookings: bookingsRes.count || 0,
    revenue: revenueRes.data?.reduce((sum, inv) => sum + parseFloat(inv.total || '0'), 0) || 0,
  }
}
