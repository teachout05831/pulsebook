'use client'

import { cn } from '@/lib/utils'
import { Phone, FileText, Zap, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Props {
  revenue: { todayAchieved: number; dailyTarget: number }
  todayStats: { callsMade: number; estimatesSent: number; bookings: number }
  recentWins: { id: string; customerName: string; amount: number }[]
}

export function TodayCard({ revenue, todayStats, recentWins }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Zap className="h-5 w-5" />Today</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Revenue Today</span>
            <Badge variant="outline" className={cn(revenue.todayAchieved >= revenue.dailyTarget ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200')}>
              {revenue.dailyTarget > 0 ? Math.round((revenue.todayAchieved / revenue.dailyTarget) * 100) : 0}%
            </Badge>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold">${revenue.todayAchieved.toLocaleString()}</span>
            <span className="text-muted-foreground">/ ${Math.round(revenue.dailyTarget).toLocaleString()}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-3 bg-blue-50 rounded-lg"><Phone className="h-4 w-4 mx-auto text-blue-600 mb-1" /><div className="text-xl font-bold">{todayStats.callsMade}</div><div className="text-xs text-muted-foreground">Calls</div></div>
          <div className="text-center p-3 bg-purple-50 rounded-lg"><FileText className="h-4 w-4 mx-auto text-purple-600 mb-1" /><div className="text-xl font-bold">{todayStats.estimatesSent}</div><div className="text-xs text-muted-foreground">Estimates</div></div>
          <div className="text-center p-3 bg-green-50 rounded-lg"><Target className="h-4 w-4 mx-auto text-green-600 mb-1" /><div className="text-xl font-bold">{todayStats.bookings}</div><div className="text-xs text-muted-foreground">Bookings</div></div>
        </div>
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold mb-2">Recent Wins</h4>
          <div className="space-y-2">
            {recentWins.length > 0 ? recentWins.map((win) => (
              <div key={win.id} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground truncate">{win.customerName}</span>
                <Badge variant="outline" className="text-green-600 border-green-200">+${win.amount.toLocaleString()}</Badge>
              </div>
            )) : <p className="text-sm text-muted-foreground">No wins yet this period</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
