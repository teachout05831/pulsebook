'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tag, Plus } from 'lucide-react'

const mockTags = [
  { name: 'Residential', color: '#3B82F6' },
  { name: 'Long Distance', color: '#8B5CF6' },
  { name: 'Priority', color: '#EF4444' },
]

export function TagsCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Tags</CardTitle>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1.5">
          {mockTags.map((tag) => (
            <Badge
              key={tag.name}
              variant="outline"
              className="text-xs gap-1.5 cursor-pointer"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: tag.color }}
              />
              {tag.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
