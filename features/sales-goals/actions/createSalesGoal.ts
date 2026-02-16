'use server'

import { createClient } from '@/lib/supabase/server'
import type { CreateSalesGoalInput, SalesGoalActionResult } from '../types'

export async function createSalesGoal(input: CreateSalesGoalInput): Promise<SalesGoalActionResult> {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Get active company
  const { data: userData } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .single()

  if (!userData?.active_company_id) {
    return { error: 'No active company selected' }
  }

  // Validate input
  if (!input.teamMemberId) return { error: 'Team member is required' }
  if (!input.year || input.year < 2020 || input.year > 2100) return { error: 'Invalid year' }
  if (!input.month || input.month < 1 || input.month > 12) return { error: 'Invalid month' }
  if (input.revenueTarget < 0) return { error: 'Revenue target must be positive' }

  // Check for existing goal
  const { data: existing } = await supabase
    .from('sales_goals')
    .select('id')
    .eq('team_member_id', input.teamMemberId)
    .eq('year', input.year)
    .eq('month', input.month)
    .single()

  if (existing) {
    return { error: 'A goal already exists for this period' }
  }

  // Insert
  const { data, error } = await supabase
    .from('sales_goals')
    .insert({
      company_id: userData.active_company_id,
      team_member_id: input.teamMemberId,
      year: input.year,
      month: input.month,
      revenue_target: input.revenueTarget,
      bookings_target: input.bookingsTarget ?? 0,
      estimates_target: input.estimatesTarget ?? 0,
      calls_target: input.callsTarget ?? 0,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create sales goal:', error)
    return { error: 'Failed to create sales goal' }
  }

  return {
    success: true,
    data: {
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
    },
  }
}
