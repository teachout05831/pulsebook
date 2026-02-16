'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { IDLSettings } from '@/features/consultations/types'
import { IDL_DEFAULTS } from '@/features/consultations/types'

interface Props {
  settings: IDLSettings | undefined
  onChange: (partial: Partial<IDLSettings>) => void
}

export function IDLSettingsSection({ settings: raw, onChange }: Props) {
  const s = { ...IDL_DEFAULTS, ...raw }

  const toggles = [
    { key: 'enablePipeline' as const, label: 'Enable IDL Pipeline', description: 'Automatically process recordings into transcripts and AI estimates' },
    { key: 'autoGenerateEstimate' as const, label: 'Auto-Generate Estimate', description: 'Generate an AI estimate immediately after transcription completes' },
    { key: 'autoPopulatePage' as const, label: 'Auto-Populate Page', description: 'Fill the estimate page template with AI-generated content' },
    { key: 'enableLiveWidget' as const, label: 'Live Estimate Widget', description: 'Show a functional estimate builder during consultation calls' },
    { key: 'allowLiveApproval' as const, label: 'Allow Live Approval', description: 'Let customers approve and sign estimates during the call' },
    { key: 'notifyWhenReady' as const, label: 'Notify When Ready', description: 'Send a notification when the AI estimate is ready for review' },
  ]

  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold mb-1">Intelligent Document Layer</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Configure how consultations are automatically processed into estimates.
      </p>

      <div className="space-y-4">
        {toggles.map((toggle) => (
          <div key={toggle.key} className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm font-medium">{toggle.label}</div>
              <div className="text-xs text-muted-foreground">{toggle.description}</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={s[toggle.key] as boolean}
              onClick={() => onChange({ [toggle.key]: !s[toggle.key] })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                s[toggle.key] ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                s[toggle.key] ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        ))}

        <div className="flex items-center justify-between py-2">
          <div>
            <div className="text-sm font-medium">Default Pricing Model</div>
            <div className="text-xs text-muted-foreground">How AI estimates should structure pricing</div>
          </div>
          <Select value={s.defaultPricingModel} onValueChange={(v) => onChange({ defaultPricingModel: v as IDLSettings['defaultPricingModel'] })}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flat">Flat Rate</SelectItem>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="per_service">Per Service</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
