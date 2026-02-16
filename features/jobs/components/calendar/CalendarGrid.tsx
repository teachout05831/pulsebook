'use client'

import { memo } from "react"
import { Badge } from "@/components/ui/badge"

interface CalendarJob {
  id: string
  title: string
  status: "unassigned" | "scheduled" | "in_progress" | "completed" | "cancelled"
  scheduledDate: string
  scheduledTime: string | null
  customerName: string
  assignedTechnicianName: string | null
  address: string
}

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  jobs: CalendarJob[]
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const STATUS_COLORS: Record<CalendarJob["status"], string> = {
  unassigned: "bg-red-100 text-red-800",
  scheduled: "bg-blue-100 text-blue-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
}

const JobBadge = memo(function JobBadge({ job, onClick }: { job: CalendarJob; onClick: () => void }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick() }}
      className={`w-full text-left px-1.5 py-0.5 rounded text-xs truncate ${STATUS_COLORS[job.status]} hover:opacity-80 transition-opacity`}
    >
      {job.scheduledTime ? `${job.scheduledTime.slice(0, 5)} ` : ""}{job.title}
    </button>
  )
})

interface CalendarGridProps {
  days: CalendarDay[]
  onJobClick: (jobId: string) => void
  onDayClick: (date: Date) => void
}

export function CalendarGrid({ days, onJobClick, onDayClick }: CalendarGridProps) {
  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 bg-muted">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium border-b">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, index) => (
            <div
              key={day.date.toISOString()}
              onClick={() => onDayClick(day.date)}
              className={`
                min-h-[100px] p-1 border-b border-r cursor-pointer
                hover:bg-muted/50 transition-colors
                ${!day.isCurrentMonth ? "bg-muted/30 text-muted-foreground" : ""}
                ${day.isToday ? "bg-blue-50 dark:bg-blue-950/20" : ""}
                ${index % 7 === 6 ? "border-r-0" : ""}
              `}
            >
              <div className={`text-sm font-medium mb-1 ${day.isToday ? "text-blue-600 dark:text-blue-400" : ""}`}>
                {day.date.getDate()}
              </div>
              <div className="space-y-0.5">
                {day.jobs.slice(0, 3).map((job) => (
                  <JobBadge key={job.id} job={job} onClick={() => onJobClick(job.id)} />
                ))}
                {day.jobs.length > 3 && (
                  <div className="text-xs text-muted-foreground px-1">+{day.jobs.length - 3} more</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4 mt-4 text-sm">
        <span className="text-muted-foreground">Status:</span>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="bg-red-100 text-red-800">Unassigned</Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">Scheduled</Badge>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">In Progress</Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">Cancelled</Badge>
        </div>
      </div>
    </>
  )
}
