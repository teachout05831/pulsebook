'use client'

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarHeader } from "./CalendarHeader"
import { CalendarGrid } from "./CalendarGrid"

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

function getCalendarDays(year: number, month: number, jobs: CalendarJob[]): CalendarDay[] {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())

  const days: CalendarDay[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const current = new Date(startDate)
  while (current <= lastDay || days.length % 7 !== 0) {
    const dateStr = current.toISOString().split("T")[0]
    const dayJobs = jobs.filter(j => j.scheduledDate === dateStr)
    days.push({
      date: new Date(current),
      isCurrentMonth: current.getMonth() === month,
      isToday: current.getTime() === today.getTime(),
      jobs: dayJobs,
    })
    current.setDate(current.getDate() + 1)
    if (days.length > 42) break
  }
  return days
}

function CalendarSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    </div>
  )
}

export function CalendarView() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [jobs, setJobs] = useState<CalendarJob[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true)
      try {
        const startOfRange = new Date(year, month, 1)
        startOfRange.setDate(startOfRange.getDate() - 7)
        const endOfRange = new Date(year, month + 1, 7)
        const params = new URLSearchParams({
          startDate: startOfRange.toISOString().split("T")[0],
          endDate: endOfRange.toISOString().split("T")[0],
        })
        const response = await fetch(`/api/jobs/calendar?${params}`)
        const data = await response.json()
        setJobs(data.jobs || [])
      } catch {
        setJobs([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchJobs()
  }, [year, month])

  const calendarDays = useMemo(() => getCalendarDays(year, month, jobs), [year, month, jobs])

  return (
    <div className="space-y-6">
      <CalendarHeader
        year={year}
        month={month}
        onPreviousMonth={() => setCurrentDate(new Date(year, month - 1, 1))}
        onNextMonth={() => setCurrentDate(new Date(year, month + 1, 1))}
        onToday={() => setCurrentDate(new Date())}
        onListView={() => router.push("/jobs")}
      />
      <Card>
        <CardHeader />
        <CardContent>
          {isLoading ? (
            <CalendarSkeleton />
          ) : (
            <CalendarGrid
              days={calendarDays}
              onJobClick={(jobId) => router.push(`/jobs/${jobId}`)}
              onDayClick={(date) => router.push(`/jobs/new?date=${date.toISOString().split("T")[0]}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
