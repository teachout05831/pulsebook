'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, Check, Circle } from 'lucide-react'
import type { ContractBlock, BlockMode } from '../../types'

interface StatusEvent { stepIndex: number; stepLabel: string; timestamp: string }

interface Props {
  block: ContractBlock
  mode: BlockMode
  onUpdate?: (content: Record<string, unknown>) => void
}

const DEFAULT_STEPS = ['Arrived', 'Loading', 'In Transit', 'Unloading', 'Complete']

function getSteps(b: ContractBlock): string[] {
  const s = b.content.steps as string[] | undefined
  return s?.length ? s : DEFAULT_STEPS
}
function getCurrentStep(b: ContractBlock): number { return (b.content.currentStep as number) ?? 0 }
function getEvents(b: ContractBlock): StatusEvent[] { return (b.content.events as StatusEvent[]) ?? [] }
function formatTime(ts: string): string { return new Date(ts).toLocaleString() }

function duration(a: string, b: string): string {
  const mins = Math.round((new Date(b).getTime() - new Date(a).getTime()) / 60000)
  return mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h ${mins % 60}m`
}

export function StatusTrackerBlock({ block, mode, onUpdate }: Props) {
  const steps = getSteps(block)
  const currentStep = getCurrentStep(block)
  const events = getEvents(block)

  // ---------- EDIT MODE ----------
  if (mode === 'edit') {
    const updateStep = (index: number, value: string) => {
      const updated = steps.map((s, i) => (i === index ? value : s))
      onUpdate?.({ ...block.content, steps: updated })
    }
    const addStep = () => {
      onUpdate?.({ ...block.content, steps: [...steps, ''] })
    }
    const removeStep = (index: number) => {
      if (steps.length <= 1) return
      onUpdate?.({ ...block.content, steps: steps.filter((_, i) => i !== index) })
    }

    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Status Tracker Steps</p>
        {steps.map((step, i) => (
          <div key={`edit-${i}`} className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-6 text-right">{i + 1}.</span>
            <Input
              value={step}
              placeholder="Step label"
              className="flex-1"
              onChange={(e) => updateStep(i, e.target.value)}
            />
            <Button variant="ghost" size="icon" onClick={() => removeStep(i)} disabled={steps.length <= 1}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addStep}>
          <Plus className="mr-1 h-4 w-4" /> Add Step
        </Button>
      </div>
    )
  }

  // ---------- VIEW MODE ----------
  if (mode === 'view') {
    return (
      <div className="space-y-3">
        {steps.map((step, i) => {
          const event = events.find((e) => e.stepIndex === i)
          const prevEvent = i > 0 ? events.find((e) => e.stepIndex === i - 1) : null
          const isCompleted = i < currentStep
          const isCurrent = i === currentStep
          return (
            <div key={`view-${step}-${i}`} className="flex items-start gap-3">
              <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${isCompleted ? 'bg-green-600 text-white' : isCurrent ? 'bg-blue-600 text-white' : 'bg-muted text-muted-foreground'}`}>
                {isCompleted ? <Check className="h-3.5 w-3.5" /> : <span className="text-xs">{i + 1}</span>}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${!isCompleted && !isCurrent ? 'text-muted-foreground' : ''}`}>{step}</p>
                {event && <p className="text-xs text-muted-foreground">{formatTime(event.timestamp)}</p>}
                {event && prevEvent && (
                  <p className="text-xs text-muted-foreground">Duration: {duration(prevEvent.timestamp, event.timestamp)}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // ---------- LIVE MODE ----------
  const allDone = currentStep >= steps.length

  const advanceStep = () => {
    if (allDone) return
    const now = new Date().toISOString()
    const newEvent: StatusEvent = { stepIndex: currentStep, stepLabel: steps[currentStep], timestamp: now }
    onUpdate?.({ ...block.content, currentStep: currentStep + 1, events: [...events, newEvent] })
  }

  return (
    <div className="space-y-3">
      {steps.map((step, i) => {
        const event = events.find((e) => e.stepIndex === i)
        const isCompleted = i < currentStep
        const isCurrent = i === currentStep && !allDone
        return (
          <div key={`live-${step}-${i}`} className="flex items-start gap-3">
            <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${isCompleted ? 'bg-green-600 text-white' : isCurrent ? 'border-2 border-blue-600' : 'bg-muted text-muted-foreground'}`}>
              {isCompleted ? <Check className="h-3.5 w-3.5" /> : isCurrent ? <Circle className="h-3 w-3 animate-pulse text-blue-600" /> : <span className="text-xs">{i + 1}</span>}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${isCurrent ? 'text-blue-600' : !isCompleted ? 'text-muted-foreground' : ''}`}>{step}</p>
              {event && <p className="text-xs text-muted-foreground">{formatTime(event.timestamp)}</p>}
            </div>
          </div>
        )
      })}

      {allDone ? (
        <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 dark:bg-green-950">
          <Check className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium text-green-700 dark:text-green-400">All steps complete</span>
        </div>
      ) : (
        <Button onClick={advanceStep} className="w-full">
          Next: {steps[currentStep]}
        </Button>
      )}
    </div>
  )
}
