'use client'

import { cn } from '@/lib/utils'
import { Target, FileText, Phone } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { NumberProgress as NumberProgressType } from '../types'

interface Props {
  bookings: NumberProgressType
  estimates: NumberProgressType
  calls: NumberProgressType
}

function ProgressCard({ label, icon: Icon, data, color }: { label: string; icon: typeof Target; data: NumberProgressType; color: string }) {
  const pct = Math.min(data.percentComplete, 100)
  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <Icon className={cn('h-4 w-4', color)} />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-bold">{data.achieved}</span>
          <span className="text-muted-foreground text-sm">/ {data.target}</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className={cn('h-full rounded-full transition-all', pct >= 100 ? 'bg-green-500' : pct >= 50 ? 'bg-blue-500' : 'bg-amber-500')} style={{ width: `${pct}%` }} />
        </div>
        <div className="text-xs text-muted-foreground mt-1">{Math.round(pct)}% complete</div>
      </CardContent>
    </Card>
  )
}

export function NumberProgressCards({ bookings, estimates, calls }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <ProgressCard label="Bookings" icon={Target} data={bookings} color="text-green-600" />
      <ProgressCard label="Estimates Sent" icon={FileText} data={estimates} color="text-purple-600" />
      <ProgressCard label="Calls Made" icon={Phone} data={calls} color="text-blue-600" />
    </div>
  )
}
