'use client'

import { useContractProgress } from '../hooks/useContractProgress'
import { Check, Circle, Loader2 } from 'lucide-react'

interface Props {
  contractId: string
  steps?: string[]
}

function fmtDuration(ms: number): string {
  const mins = Math.floor(ms / 60000)
  if (mins < 60) return `${mins}m`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h}h ${m}m`
}

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export function LiveProgressTimeline({ contractId, steps = [] }: Props) {
  const { statusEvents, currentStatus, isLoading } = useContractProgress(contractId)

  if (isLoading && statusEvents.length === 0) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (steps.length === 0 && statusEvents.length === 0) {
    return <p className="text-xs text-muted-foreground py-2">No status updates yet.</p>
  }

  const displaySteps = steps.length > 0 ? steps : Array.from(new Set(statusEvents.map(e => e.stepLabel)))
  const eventByStep = new Map(statusEvents.map(e => [e.stepLabel, e]))

  const completedIdx = statusEvents.length > 0
    ? Math.max(...statusEvents.map(e => e.stepIndex))
    : -1

  return (
    <div className="space-y-1 py-2">
      {displaySteps.map((step, idx) => {
        const event = eventByStep.get(step)
        const isCompleted = idx <= completedIdx && !!event
        const isCurrent = idx === completedIdx + 1
        const prevEvent = idx > 0 ? eventByStep.get(displaySteps[idx - 1]) : null
        const duration = event && prevEvent
          ? new Date(event.recordedAt).getTime() - new Date(prevEvent.recordedAt).getTime()
          : null

        return (
          <div key={`step-${step}-${idx}`} className="flex items-start gap-3">
            <div className="flex flex-col items-center pt-0.5">
              {isCompleted ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
                  <Check className="h-3 w-3" />
                </span>
              ) : isCurrent ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 animate-pulse">
                  <Circle className="h-2.5 w-2.5 text-white fill-white" />
                </span>
              ) : (
                <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-gray-300">
                  <Circle className="h-2 w-2 text-gray-300" />
                </span>
              )}
              {idx < displaySteps.length - 1 && (
                <div className={`w-0.5 h-6 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
            <div className="flex-1 min-w-0 pb-2">
              <p className={`text-sm ${isCompleted ? 'font-medium' : isCurrent ? 'font-medium text-blue-600' : 'text-muted-foreground'}`}>
                {step}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {event && <span>{fmtTime(event.recordedAt)}</span>}
                {duration !== null && duration > 0 && (
                  <span className="text-[10px] bg-gray-100 rounded px-1.5 py-0.5">
                    {fmtDuration(duration)}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}

      {statusEvents.length > 0 && (
        <div className="pt-2 border-t mt-2 text-xs text-muted-foreground">
          <span>Started: {fmtTime(statusEvents[0].recordedAt)}</span>
          {statusEvents.length > 1 && (
            <span className="ml-3">
              Elapsed: {fmtDuration(
                new Date(statusEvents[statusEvents.length - 1].recordedAt).getTime() -
                new Date(statusEvents[0].recordedAt).getTime()
              )}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
