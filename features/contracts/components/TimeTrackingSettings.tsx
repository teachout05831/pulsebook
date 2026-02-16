'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, Clock, Save } from 'lucide-react'
import { toast } from 'sonner'
import { defaultTimeTrackingSettings } from '@/types/company'
import type { TimeTrackingSettings as TTS, StopReasonConfig } from '@/types/company'

export function TimeTrackingSettings() {
  const [settings, setSettings] = useState<TTS>(defaultTimeTrackingSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/company')
        if (!res.ok) return
        const json = await res.json()
        const ts = json.data?.settings?.timeTracking
        if (ts) setSettings({ ...defaultTimeTrackingSettings, ...ts })
      } finally { setIsLoading(false) }
    }
    load()
  }, [])

  const save = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/company')
      if (!res.ok) return
      const current = (await res.json()).data?.settings || {}
      const patchRes = await fetch('/api/company', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: { ...current, timeTracking: settings } }),
      })
      if (patchRes.ok) toast.success('Time tracking settings saved')
      else toast.error('Failed to save settings')
    } finally { setIsSaving(false) }
  }

  const update = (patch: Partial<TTS>) => setSettings(s => ({ ...s, ...patch }))
  const addReason = () => update({ stopReasons: [...settings.stopReasons, { label: '', billable: false }] })
  const removeReason = (i: number) => update({ stopReasons: settings.stopReasons.filter((_, j) => j !== i) })
  const updateReason = (i: number, p: Partial<StopReasonConfig>) => update({
    stopReasons: settings.stopReasons.map((r, j) => j === i ? { ...r, ...p } : r),
  })

  if (isLoading) return null

  const permOptions: { value: TTS['editPermission']; label: string }[] = [
    { value: 'crew_and_office', label: 'Crew + Office' },
    { value: 'office_only', label: 'Office Only' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" /> Time Tracking Settings
        </CardTitle>
        <CardDescription>
          Configure auto-stop, edit permissions, and stop reasons for crew time tracking.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Auto-stop timer</Label>
            <Switch checked={settings.autoStopEnabled} onCheckedChange={v => update({ autoStopEnabled: v })} />
          </div>
          {settings.autoStopEnabled && (
            <div className="flex items-center gap-2 pl-4">
              <Label className="text-sm text-muted-foreground">Stop after</Label>
              <Input type="number" min={1} max={24} className="w-20" value={settings.autoStopHours}
                onChange={e => update({ autoStopHours: Number(e.target.value) || 12 })} />
              <span className="text-sm text-muted-foreground">hours</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Label>Who can edit time entries?</Label>
          <div className="flex gap-2">
            {permOptions.map(o => (
              <Button key={o.value} size="sm"
                variant={settings.editPermission === o.value ? 'default' : 'outline'}
                onClick={() => update({ editPermission: o.value })}
              >{o.label}</Button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Link status updates to timer</Label>
            <p className="text-xs text-muted-foreground">Auto-start/stop timer on status step changes</p>
          </div>
          <Switch checked={settings.statusTimerLinkEnabled} onCheckedChange={v => update({ statusTimerLinkEnabled: v })} />
        </div>

        <div className="space-y-3">
          <Label>Stop reasons</Label>
          <p className="text-xs text-muted-foreground">When crew stops the timer, they pick a reason.</p>
          <div className="space-y-2">
            {settings.stopReasons.map((reason, i) => (
              <div key={`reason-${i}`} className="flex items-center gap-2">
                <Input className="flex-1" placeholder="Reason label" value={reason.label}
                  onChange={e => updateReason(i, { label: e.target.value })} />
                <div className="flex items-center gap-1.5 min-w-[90px]">
                  <Switch checked={reason.billable} onCheckedChange={v => updateReason(i, { billable: v })} />
                  <span className="text-xs text-muted-foreground">{reason.billable ? 'Billable' : 'Non-bill'}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeReason(i)}>
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={addReason}>
            <Plus className="h-4 w-4 mr-1" /> Add reason
          </Button>
        </div>

        <Button onClick={save} disabled={isSaving}>
          <Save className="h-4 w-4 mr-1" /> {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardContent>
    </Card>
  )
}
