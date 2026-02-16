'use client'

import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { useCoachSettings } from '../hooks/useCoachSettings'
import { useCoachLibrary } from '../hooks/useCoachLibrary'
import { CompanyContextSection } from './CompanyContextSection'
import { StageScriptsEditor } from './StageScriptsEditor'
import { StageKeywordsEditor } from './StageKeywordsEditor'
import { ObjectionEditor } from './ObjectionEditor'

const TOGGLES = [
  { key: 'enabled' as const, label: 'Enable AI Coach', description: 'Show the coaching side panel during consultation calls' },
  { key: 'showTranscript' as const, label: 'Show Live Transcript', description: 'Display real-time call transcription in the side panel' },
  { key: 'showServiceSuggestions' as const, label: 'Service Suggestions', description: 'Suggest catalog services when keywords are mentioned' },
  { key: 'showObjectionResponses' as const, label: 'Objection Responses', description: 'Show response scripts when customer objections are detected' },
  { key: 'autoAdvanceStage' as const, label: 'Auto-Advance Stage', description: 'Automatically detect and advance the sales stage' },
]

export function CoachSettingsSection() {
  const { settings, isLoading, updateSettings } = useCoachSettings()
  const { library, isLoading: libLoading, isSaving, saveLibrary, resetToDefaults } = useCoachLibrary()
  const [confirmReset, setConfirmReset] = useState(false)

  if (isLoading || libLoading) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-muted rounded w-32" />
          <div className="h-4 bg-muted rounded w-64" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold mb-1">AI Sales Coach</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Real-time coaching during consultation calls. Only visible to the host.
        </p>
        <div className="space-y-4">
          {TOGGLES.map((toggle) => (
            <div key={toggle.key} className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium">{toggle.label}</div>
                <div className="text-xs text-muted-foreground">{toggle.description}</div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings[toggle.key]}
                onClick={() => updateSettings({ [toggle.key]: !settings[toggle.key] })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings[toggle.key] ? 'bg-primary' : 'bg-muted'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings[toggle.key] ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {settings.enabled && (
        <>
          <CompanyContextSection library={library} onSave={saveLibrary} isSaving={isSaving} />
          <StageScriptsEditor library={library} onSave={saveLibrary} />
          <StageKeywordsEditor library={library} onSave={saveLibrary} />
          <ObjectionEditor library={library} onSave={saveLibrary} />
          <div className="flex items-center justify-end gap-3">
            {confirmReset ? (
              <>
                <span className="text-xs text-destructive">This will remove all customizations. Are you sure?</span>
                <button onClick={() => { resetToDefaults(); setConfirmReset(false) }} className="text-xs font-medium text-destructive hover:text-destructive/80">Yes, reset</button>
                <button onClick={() => setConfirmReset(false)} className="text-xs font-medium text-muted-foreground hover:text-foreground">Cancel</button>
              </>
            ) : (
              <button onClick={() => setConfirmReset(true)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors">
                <RotateCcw className="h-3.5 w-3.5" /> Reset All Customizations
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
