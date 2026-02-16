'use client'

import { Target } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface NoGoalStateProps {
  salespersonName: string
}

export function NoGoalState({ salespersonName }: NoGoalStateProps) {
  const currentMonth = new Date().toLocaleString('default', { month: 'long' })

  return (
    <Card>
      <CardContent className="py-12 text-center">
        <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          No goals set for {currentMonth}
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Hey {salespersonName.split(' ')[0]}, your manager hasn't set goals for this month yet.
          Contact your sales manager to get your targets configured.
        </p>
      </CardContent>
    </Card>
  )
}
