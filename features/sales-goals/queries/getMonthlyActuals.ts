import { createClient } from '@/lib/supabase/server'

export interface MonthlyActuals {
  totalLeads: number
  sentEstimatesCount: number
  approvedEstimatesCount: number
  bookedJobsCount: number
  totalRevenue: number
  todayRevenue: number
  callsMadeCount: number
}

export async function getMonthlyActuals(
  teamMemberId: string,
  year: number,
  month: number
): Promise<MonthlyActuals> {
  const supabase = await createClient()
  const defaults: MonthlyActuals = { totalLeads: 0, sentEstimatesCount: 0, approvedEstimatesCount: 0, bookedJobsCount: 0, totalRevenue: 0, todayRevenue: 0, callsMadeCount: 0 }

  const startDate = new Date(year, month - 1, 1).toISOString()
  const nextMonthStart = new Date(year, month, 1).toISOString()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().split('T')[0]
  const tomorrowStr = new Date(today.getTime() + 86400000).toISOString().split('T')[0]

  // All customers assigned to this salesperson (not just leads, not just this month)
  const { data: allCust } = await supabase
    .from('customers')
    .select('id')
    .eq('assigned_to', teamMemberId)
    .limit(200)

  const custIds = allCust?.map(c => c.id) || []
  if (custIds.length === 0) return defaults

  const [monthLeads, sentEst, approvedEst, bookedJobs, allInv, todayInv, calls] = await Promise.all([
    // Leads created this month (for rate calculations)
    supabase.from('customers').select('id', { count: 'exact', head: true })
      .eq('assigned_to', teamMemberId)
      .gte('created_at', startDate).lt('created_at', nextMonthStart),
    // Estimates sent this month
    supabase.from('estimates').select('id', { count: 'exact', head: true })
      .in('customer_id', custIds).not('sent_at', 'is', null)
      .gte('sent_at', startDate).lt('sent_at', nextMonthStart),
    // Approved estimates (all time for these customers)
    supabase.from('estimates').select('id', { count: 'exact', head: true })
      .in('customer_id', custIds).eq('status', 'approved')
      .gte('updated_at', startDate).lt('updated_at', nextMonthStart),
    // Jobs booked this month
    supabase.from('jobs').select('id', { count: 'exact', head: true })
      .in('customer_id', custIds)
      .in('status', ['scheduled', 'pending', 'in_progress', 'completed'])
      .gte('created_at', startDate).lt('created_at', nextMonthStart),
    // Revenue this month (paid invoices)
    supabase.from('invoices').select('total')
      .in('customer_id', custIds).in('status', ['paid', 'partial'])
      .gte('paid_at', startDate).lt('paid_at', nextMonthStart).limit(100),
    // Today's revenue
    supabase.from('invoices').select('total')
      .in('customer_id', custIds).in('status', ['paid', 'partial'])
      .gte('paid_at', todayStr).lt('paid_at', tomorrowStr).limit(50),
    // Calls made this month
    supabase.from('follow_ups').select('id', { count: 'exact', head: true })
      .eq('assigned_to', teamMemberId).eq('status', 'completed')
      .gte('completed_at', startDate).lt('completed_at', nextMonthStart),
  ])

  return {
    totalLeads: monthLeads.count || 0,
    sentEstimatesCount: sentEst.count || 0,
    approvedEstimatesCount: approvedEst.count || 0,
    bookedJobsCount: bookedJobs.count || 0,
    totalRevenue: allInv.data?.reduce((sum, inv) => sum + parseFloat(inv.total || '0'), 0) || 0,
    todayRevenue: todayInv.data?.reduce((sum, inv) => sum + parseFloat(inv.total || '0'), 0) || 0,
    callsMadeCount: calls.count || 0,
  }
}
