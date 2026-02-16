'use client'

import { ChevronLeft, ChevronRight, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardTitle } from "@/components/ui/card"

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

interface CalendarHeaderProps {
  year: number
  month: number
  onPreviousMonth: () => void
  onNextMonth: () => void
  onToday: () => void
  onListView: () => void
}

export function CalendarHeader({ year, month, onPreviousMonth, onNextMonth, onToday, onListView }: CalendarHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">View and manage jobs by date.</p>
        </div>
        <Button variant="outline" onClick={onListView}>
          <List className="mr-2 h-4 w-4" />
          List View
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-xl min-w-[200px] text-center">
            {MONTHS[month]} {year}
          </CardTitle>
          <Button variant="outline" size="icon" onClick={onNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" onClick={onToday}>Today</Button>
      </div>
    </>
  )
}
