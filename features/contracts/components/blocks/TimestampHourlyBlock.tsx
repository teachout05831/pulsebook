'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Clock, Play, RotateCcw } from 'lucide-react'
import { useLiveTimer } from '../../hooks/useLiveTimer'
import { useCompanyTimeSettings } from '../../hooks/useCompanyTimeSettings'
import { StopReasonPopover } from '../StopReasonPopover'
import { formatTime, calculateHours } from '../../utils/timeUtils'
import type { ContractBlock, BlockMode } from '../../types'

interface Props {
  block: ContractBlock
  mode: BlockMode
  onUpdate?: (content: Record<string, unknown>) => void
}

export function TimestampHourlyBlock({ block, mode, onUpdate }: Props) {
  const hourlyRate = (block.content.hourlyRate as number) ?? 0
  const startTime = block.content.startTime as string | undefined
  const endTime = block.content.endTime as string | undefined
  const breakMinutes = (block.content.breakMinutes as number) ?? 0
  const calc = calculateHours(startTime, endTime, breakMinutes)
  const { settings } = useCompanyTimeSettings()
  const maxHours = settings.autoStopEnabled ? settings.autoStopHours : undefined
  const timer = useLiveTimer({ maxHours })

  if (mode === 'live') {
    const billH = timer.billableSeconds / 3600
    const nonBillH = timer.nonBillableSeconds / 3600
    return (
      <div className="space-y-3 rounded border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Clock className="h-4 w-4" /> <span>Time Tracking</span>
          </div>
          <span className="font-mono text-2xl tabular-nums">{timer.formattedTotal}</span>
        </div>
        <div className="flex gap-2">
          {!timer.isRunning && (
            <Button size="sm" onClick={timer.start}>
              <Play className="h-4 w-4 mr-1" /> {timer.entries.length > 0 ? 'Resume' : 'Start'}
            </Button>
          )}
          {timer.isRunning && (
            <StopReasonPopover reasons={settings.stopReasons}
              onSelect={(reason, billable) => timer.stop(reason, billable)} />
          )}
          {timer.entries.length > 0 && !timer.isRunning && (
            <Button size="sm" variant="ghost" onClick={timer.reset}>
              <RotateCcw className="h-4 w-4 mr-1" /> Reset
            </Button>
          )}
        </div>
        {timer.entries.length > 0 && (
          <div className="space-y-1 text-xs">
            {timer.entries.map((entry, i) => (
              <div key={`entry-${entry.start}`} className="flex items-center justify-between text-muted-foreground">
                <span>#{i + 1}: {formatTime(entry.start)} – {entry.end ? formatTime(entry.end) : 'running...'}</span>
                <span className="flex items-center gap-2">
                  {entry.reason && (
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                      entry.billable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>{entry.reason}</span>
                  )}
                  <span className="font-mono">{timer.fmtDuration(timer.entrySeconds(entry))}</span>
                </span>
              </div>
            ))}
            <div className="border-t pt-1 space-y-0.5">
              <div className="flex justify-between text-sm font-medium">
                <span>Billable: {billH.toFixed(2)} hrs @ ${hourlyRate.toFixed(2)}/hr</span>
                <span>${(billH * hourlyRate).toFixed(2)}</span>
              </div>
              {nonBillH > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Non-billable: {nonBillH.toFixed(2)} hrs</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (mode === 'view') {
    return (
      <div className="space-y-3 rounded border p-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Clock className="h-4 w-4" /> <span>Time & Hourly Billing</span>
        </div>
        {!startTime ? (
          <p className="text-sm text-muted-foreground">Not started</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div><span className="text-muted-foreground">Start:</span> {formatTime(startTime)}</div>
            <div><span className="text-muted-foreground">End:</span> {formatTime(endTime)}</div>
            <div><span className="text-muted-foreground">Break:</span> {breakMinutes} min</div>
            <div><span className="text-muted-foreground">Rate:</span> ${hourlyRate.toFixed(2)}/hr</div>
            {calc && (
              <>
                <div><span className="text-muted-foreground">Billable:</span> {calc.billableHours.toFixed(2)}</div>
                <div className="font-semibold"><span className="text-muted-foreground">Total:</span> ${(calc.billableHours * hourlyRate).toFixed(2)}</div>
              </>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3 rounded border p-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Clock className="h-4 w-4" /> <span>Time & Hourly Billing</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Hourly Rate ($)</label>
          <Input type="number" min={0} step={0.01} value={hourlyRate}
            onChange={(e) => onUpdate?.({ ...block.content, hourlyRate: Number(e.target.value) })} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Break (minutes)</label>
          <Input type="number" min={0} value={breakMinutes}
            onChange={(e) => onUpdate?.({ ...block.content, breakMinutes: Number(e.target.value) })} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Start Time</label>
          <Input value={formatTime(startTime)} disabled placeholder="Auto-captured" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">End Time</label>
          <Input value={formatTime(endTime)} disabled placeholder="Auto-captured" />
        </div>
      </div>
    </div>
  )
}
