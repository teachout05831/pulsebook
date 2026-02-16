'use server'

import { createClient } from '@/lib/supabase/server'
import type { TodayStats } from '../types'

export async function getTodayStats(teamMemberId: string): Promise<TodayStats> {
  const supabase = await createClient()

  const defaultStats: TodayStats = {
    callsMade: 0,
    estimatesSent: 0,
    bookings: 0,
    revenueToday: 0,
  }

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return defaultStats

  // Validate input
  if (!teamMemberId) return defaultStats

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString()
  const tomorrowStr = new Date(today.getTime() + 86400000).toISOString()

  // Run all 4 queries in parallel
  const [followUps, estimates, jobs, invoices] = await Promise.all([
    // Count follow-ups completed today (calls made)
    supabase
      .from('follow_ups')
      .select('id', { count: 'exact', head: true })
      .eq('assigned_to', teamMemberId)
      .eq('status', 'completed')
      .gte('completed_at', todayStr)
      .lt('completed_at', tomorrowStr),

    // Count estimates sent today
    supabase
      .from('estimates')
      .select('id', { count: 'exact', head: true })
      .gte('sent_at', todayStr)
      .lt('sent_at', tomorrowStr),

    // Count jobs booked/scheduled today
    supabase
      .from('jobs')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', todayStr)
      .lt('created_at', tomorrowStr)
      .in('status', ['scheduled', 'pending']),

    // Get revenue from invoices paid today (need data for SUM)
    supabase
      .from('invoices')
      .select('total')
      .gte('paid_at', todayStr)
      .lt('paid_at', tomorrowStr)
      .in('status', ['paid', 'partial'])
      .limit(100),
  ])

  const revenueToday = invoices.data?.reduce((sum, inv) => sum + parseFloat(inv.total || '0'), 0) || 0

  return {
    callsMade: followUps.count || 0,
    estimatesSent: estimates.count || 0,
    bookings: jobs.count || 0,
    revenueToday,
  }
}
