'use client'

import { useState } from 'react'
import { Award, Flame, ChevronRight, Target } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useSalespersonGoals } from '../hooks/useSalespersonGoals'
import { useWeeklyGoals } from '../hooks/useWeeklyGoals'
import { RevenueProgress } from './RevenueProgress'
import { NumberProgressCards } from './NumberProgress'
import { TodayCard } from './TodayCard'
import { WeeklyProgressCard } from './WeeklyProgress'
import { WeeklyGoalSetter } from './WeeklyGoalSetter'
import { RateCard } from './RateCard'
import { NoGoalState } from './NoGoalState'

export function SalespersonGoalsView() {
  const { data, isLoading, error } = useSalespersonGoals()
  const weekly = useWeeklyGoals(data?.salesperson?.id ?? null)
  const [showWeeklySetter, setShowWeeklySetter] = useState(false)

  if (isLoading) return <SalespersonGoalsViewSkeleton />

  if (error || !data) {
    return (
      <Card><CardContent className="py-12 text-center">
        <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">{error || 'Failed to load sales goals'}</p>
      </CardContent></Card>
    )
  }

  const { salesperson, goal, progress, todayStats, recentWins } = data
  if (!goal || !progress) return <NoGoalState salespersonName={salesperson.name} />

  const monthName = new Date(progress.year, progress.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })
  const showSetterAuto = weekly.needsGoal && !showWeeklySetter

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">{salesperson.avatar}</div>
          <div>
            <h2 className="text-2xl font-bold">Hey {salesperson.name.split(' ')[0]}!</h2>
            <p className="text-muted-foreground">{monthName} &bull; {progress.daysRemaining} days to hit your goals</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {salesperson.streak > 0 && <Badge className="gap-1 bg-orange-100 text-orange-700 border-orange-200"><Flame className="h-3 w-3" />{salesperson.streak} day streak</Badge>}
          <Badge variant="outline" className="gap-1"><Award className="h-3 w-3" />#{salesperson.rank} of {salesperson.totalSalespeople}</Badge>
        </div>
      </div>

      {/* Weekly goal prompt */}
      {showSetterAuto && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="py-4 flex items-center justify-between">
            <span className="text-sm font-medium">Set your goals for this week to stay on track!</span>
            <Button size="sm" onClick={() => setShowWeeklySetter(true)}>Set Weekly Goals</Button>
          </CardContent>
        </Card>
      )}

      {/* Revenue + Today */}
      <div className="grid lg:grid-cols-3 gap-6">
        <RevenueProgress progress={progress} />
        <TodayCard revenue={progress.revenue} todayStats={todayStats} recentWins={recentWins} />
      </div>

      {/* Monthly Number Progress */}
      <NumberProgressCards bookings={progress.bookings} estimates={progress.estimates} calls={progress.calls} />

      {/* Weekly Progress */}
      {weekly.weeklyGoal && (
        <WeeklyProgressCard weeklyGoal={weekly.weeklyGoal} weekStart={weekly.currentMonday} weekEnd={weekly.currentSunday} actuals={weekly.weekActuals} onEdit={() => setShowWeeklySetter(true)} />
      )}

      {/* Derived Rates (FYI) */}
      <div>
        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Conversion Rates</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <RateCard label="Booking Rate" target={progress.bookingRate.target} actual={progress.bookingRate.actual} />
          <RateCard label="Estimate Sent Rate" target={progress.sentEstimateRate.target} actual={progress.sentEstimateRate.actual} />
          <RateCard label="Close Rate" target={progress.closedRate.target} actual={progress.closedRate.actual} />
        </div>
      </div>

      {/* Quick Actions */}
      <Card><CardContent className="py-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">View and manage your assigned leads</span>
          <Button className="gap-2">View My Leads<ChevronRight className="h-4 w-4" /></Button>
        </div>
      </CardContent></Card>

      {/* Weekly Goal Setter Dialog */}
      <WeeklyGoalSetter
        open={showWeeklySetter || showSetterAuto}
        onOpenChange={setShowWeeklySetter}
        weekStart={weekly.currentMonday}
        weekEnd={weekly.currentSunday}
        existingGoal={weekly.weeklyGoal}
        monthlyGoal={goal}
        isSaving={weekly.isSaving}
        onSave={weekly.saveWeeklyGoal}
      />
    </div>
  )
}

function SalespersonGoalsViewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4"><Skeleton className="h-14 w-14 rounded-full" /><div className="space-y-2"><Skeleton className="h-8 w-48" /><Skeleton className="h-4 w-64" /></div></div>
      <div className="grid lg:grid-cols-3 gap-6"><Skeleton className="lg:col-span-2 h-80" /><Skeleton className="h-80" /></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" /></div>
    </div>
  )
}
