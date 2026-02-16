'use server'

import { createClient } from '@/lib/supabase/server'
import type { SalesGoal } from '../types'

export async function getSalespersonGoal(
  teamMemberId: string,
  year: number,
  month: number
): Promise<SalesGoal | null> {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Validate inputs
  if (!teamMemberId) return null
  if (year < 2020 || year > 2100) return null
  if (month < 1 || month > 12) return null

  const { data, error } = await supabase
    .from('sales_goals')
    .select(`
      id,
      company_id,
      team_member_id,
      year,
      month,
      revenue_target,
      bookings_target,
      estimates_target,
      calls_target,
      booking_rate_target,
      sent_estimate_rate_target,
      closed_rate_target,
      is_active,
      created_by,
      created_at,
      updated_at
    `)
    .eq('team_member_id', teamMemberId)
    .eq('year', year)
    .eq('month', month)
    .eq('is_active', true)
    .limit(1)
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    companyId: data.company_id,
    teamMemberId: data.team_member_id,
    year: data.year,
    month: data.month,
    revenueTarget: parseFloat(data.revenue_target),
    bookingsTarget: data.bookings_target ?? 0,
    estimatesTarget: data.estimates_target ?? 0,
    callsTarget: data.calls_target ?? 0,
    bookingRateTarget: parseFloat(data.booking_rate_target || '0'),
    sentEstimateRateTarget: parseFloat(data.sent_estimate_rate_target || '0'),
    closedRateTarget: parseFloat(data.closed_rate_target || '0'),
    isActive: data.is_active,
    createdBy: data.created_by,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  }
}
