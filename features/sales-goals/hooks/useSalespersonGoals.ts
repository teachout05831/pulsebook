'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  getSalespersonGoal,
  getGoalProgress,
  getTodayStats,
  getRecentWins,
  getCurrentSalesperson,
} from '../queries'
import type { SalespersonGoalView } from '../types'

export function useSalespersonGoals() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<SalespersonGoalView | null>(null)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Get current salesperson
      const salesperson = await getCurrentSalesperson()
      if (!salesperson) {
        setError('No salesperson profile found')
        setIsLoading(false)
        return
      }

      // Get current month/year
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() + 1

      // Fetch all data in parallel
      const [goal, todayStats, recentWins] = await Promise.all([
        getSalespersonGoal(salesperson.id, year, month),
        getTodayStats(salesperson.id),
        getRecentWins(salesperson.id),
      ])

      // Get progress if goal exists
      let progress = null
      if (goal) {
        progress = await getGoalProgress({ teamMemberId: salesperson.id, goal })
      }

      setData({
        salesperson: {
          id: salesperson.id,
          name: salesperson.name,
          avatar: salesperson.initials,
          rank: 1,
          totalSalespeople: 1,
          streak: 0,
        },
        goal,
        progress,
        todayStats,
        recentWins,
      })
    } catch (err) {
      console.error('Failed to load salesperson goals:', err)
      setError('Failed to load sales goals')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return {
    data,
    isLoading,
    error,
    refresh,
  }
}
