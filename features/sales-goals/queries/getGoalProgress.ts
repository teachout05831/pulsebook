'use server'

import { createClient } from '@/lib/supabase/server'
import type { GoalProgress, SalesGoal } from '../types'
import { getMonthlyActuals } from './getMonthlyActuals'

interface ProgressParams {
  teamMemberId: string
  goal: SalesGoal
}

export async function getGoalProgress(params: ProgressParams): Promise<GoalProgress | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { teamMemberId, goal } = params
  const { year, month } = goal

  const endDate = new Date(year, month, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const totalDays = endDate.getDate()
  const daysElapsed = Math.min(today.getDate(), totalDays)
  const daysRemaining = Math.max(0, totalDays - daysElapsed)

  const a = await getMonthlyActuals(teamMemberId, year, month)

  const sentEstimateRate = a.totalLeads > 0 ? (a.sentEstimatesCount / a.totalLeads) * 100 : 0
  const bookingRate = a.totalLeads > 0 ? (a.bookedJobsCount / a.totalLeads) * 100 : 0
  const closedRate = a.sentEstimatesCount > 0 ? (a.approvedEstimatesCount / a.sentEstimatesCount) * 100 : 0

  const dailyTarget = goal.revenueTarget / totalDays
  const pacePerDay = daysElapsed > 0 ? a.totalRevenue / daysElapsed : 0
  const neededPerDay = daysRemaining > 0 ? (goal.revenueTarget - a.totalRevenue) / daysRemaining : 0
  const isOnTrack = a.totalRevenue >= dailyTarget * daysElapsed * 0.9

  const pct = (achieved: number, target: number) => target > 0 ? (achieved / target) * 100 : 0

  return {
    year, month, daysElapsed, daysRemaining, totalDays,
    revenue: {
      target: goal.revenueTarget, achieved: a.totalRevenue, dailyTarget,
      todayAchieved: a.todayRevenue,
      percentComplete: pct(a.totalRevenue, goal.revenueTarget),
    },
    bookings: { target: goal.bookingsTarget, achieved: a.bookedJobsCount, percentComplete: pct(a.bookedJobsCount, goal.bookingsTarget) },
    estimates: { target: goal.estimatesTarget, achieved: a.sentEstimatesCount, percentComplete: pct(a.sentEstimatesCount, goal.estimatesTarget) },
    calls: { target: goal.callsTarget, achieved: a.callsMadeCount, percentComplete: pct(a.callsMadeCount, goal.callsTarget) },
    bookingRate: { target: goal.bookingRateTarget, actual: bookingRate },
    sentEstimateRate: { target: goal.sentEstimateRateTarget, actual: sentEstimateRate },
    closedRate: { target: goal.closedRateTarget, actual: closedRate },
    isOnTrack, pacePerDay, neededPerDay,
  }
}
