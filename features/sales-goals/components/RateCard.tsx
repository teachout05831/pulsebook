'use client'

import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface RateCardProps {
  label: string
  target: number
  actual: number
}

export function RateCard({ label, target, actual }: RateCardProps) {
  const isOnTarget = actual >= target
  const diff = actual - target

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">{label}</span>
          <Badge
            variant="outline"
            className={cn(
              isOnTarget
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-700 border-red-200'
            )}
          >
            {isOnTarget ? '+' : ''}{diff.toFixed(0)}%
          </Badge>
        </div>
        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              'text-3xl font-bold',
              isOnTarget ? 'text-green-600' : 'text-red-600'
            )}
          >
            {actual.toFixed(0)}%
          </span>
          <span className="text-muted-foreground">/ {target}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
          <div
            className={cn(
              'h-full rounded-full',
              isOnTarget ? 'bg-green-500' : 'bg-red-500'
            )}
            style={{
              width: `${Math.min((actual / target) * 100, 100)}%`,
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
