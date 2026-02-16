'use client'

import { cn } from '@/lib/utils'
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CircularProgress } from './CircularProgress'
import type { GoalProgress } from '../types'

interface Props {
  progress: GoalProgress
}

export function RevenueProgress({ progress }: Props) {
  const timeProgress = (progress.daysElapsed / progress.totalDays) * 100
  const revenueProgress = progress.revenue.percentComplete

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <DollarSign className="h-5 w-5" />Monthly Revenue
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <CircularProgress
            value={progress.revenue.achieved}
            max={progress.revenue.target}
            size={160}
            strokeWidth={14}
            color={revenueProgress >= timeProgress ? 'stroke-green-500' : 'stroke-amber-500'}
            label={`${Math.round(revenueProgress)}%`}
            sublabel="of goal"
          />
          <div className="flex-1 space-y-4 w-full">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-sm text-muted-foreground">Achieved</div>
                <div className="text-3xl font-bold text-green-600">${progress.revenue.achieved.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Target</div>
                <div className="text-xl font-semibold">${progress.revenue.target.toLocaleString()}</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all', revenueProgress >= timeProgress ? 'bg-green-500' : 'bg-amber-500')}
                  style={{ width: `${Math.min(revenueProgress, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Day {progress.daysElapsed} of {progress.totalDays}</span>
                <span>${(progress.revenue.target - progress.revenue.achieved).toLocaleString()} to go</span>
              </div>
            </div>
            <div className={cn('flex items-center gap-2 p-3 rounded-lg', progress.isOnTrack ? 'bg-green-50' : 'bg-amber-50')}>
              {progress.isOnTrack ? (
                <>
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <div>
                    <span className="font-medium text-green-800">On track!</span>
                    <span className="text-green-700 text-sm ml-2">Averaging ${Math.round(progress.pacePerDay).toLocaleString()}/day</span>
                  </div>
                </>
              ) : (
                <>
                  <TrendingDown className="h-5 w-5 text-amber-600" />
                  <div>
                    <span className="font-medium text-amber-800">Slightly behind</span>
                    <span className="text-amber-700 text-sm ml-2">Need ${Math.round(progress.neededPerDay).toLocaleString()}/day</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
