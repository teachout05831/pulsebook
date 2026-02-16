'use client'

import { useState } from 'react'
import type { CoachingSuggestion, CoachCardType } from '../types'

interface CoachCardProps {
  suggestion: CoachingSuggestion
  onDismiss: (id: string) => void
  onUse: (id: string) => void
}

const TYPE_LABELS: Record<CoachCardType, string> = {
  stage_prompt: 'Stage Prompt',
  service_suggestion: 'Service Match',
  objection_response: 'Objection Response',
  closing_script: 'Closing Script',
  info_alert: 'Info',
}

const COLOR_CLASSES: Record<CoachCardType, {
  bg: string
  border: string
  label: string
}> = {
  stage_prompt: {
    bg: 'bg-blue-500/10',
    border: 'border-l-blue-500',
    label: 'text-blue-400',
  },
  service_suggestion: {
    bg: 'bg-green-500/10',
    border: 'border-l-green-500',
    label: 'text-green-400',
  },
  objection_response: {
    bg: 'bg-amber-500/10',
    border: 'border-l-amber-500',
    label: 'text-amber-400',
  },
  closing_script: {
    bg: 'bg-purple-500/10',
    border: 'border-l-purple-500',
    label: 'text-purple-400',
  },
  info_alert: {
    bg: 'bg-white/[0.04]',
    border: 'border-l-slate-600',
    label: 'text-slate-400',
  },
}

export function CoachCard({ suggestion, onDismiss, onUse }: CoachCardProps) {
  const [fading, setFading] = useState(false)
  const colors = COLOR_CLASSES[suggestion.type]

  const handleDismiss = () => {
    setFading(true)
    setTimeout(() => onDismiss(suggestion.id), 300)
  }

  const handleUse = () => {
    onUse(suggestion.id)
  }

  return (
    <div
      className={`mx-2.5 my-2 p-2.5 px-3 rounded-lg border-l-[3px] text-[0.7rem] leading-relaxed transition-opacity duration-300 ${colors.bg} ${colors.border} ${fading ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Type label */}
      <div className={`text-[0.58rem] font-bold uppercase tracking-wide mb-1 ${colors.label}`}>
        {TYPE_LABELS[suggestion.type]}
      </div>

      {/* Body */}
      <div className="text-white/60">
        <strong className="text-white/85">{suggestion.title}</strong>
        {' — '}
        {suggestion.body}
      </div>

      {/* Script text */}
      {suggestion.scriptText && (
        <div className="bg-black/20 rounded px-2 py-1.5 mt-1.5 italic text-white/50">
          &ldquo;{suggestion.scriptText}&rdquo;
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-1.5 mt-2">
        <button
          onClick={handleUse}
          className="px-2 py-0.5 rounded text-[0.6rem] font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          {suggestion.scriptText ? 'Use' : 'Got it'}
        </button>
        <button
          onClick={handleDismiss}
          className="px-2 py-0.5 rounded text-[0.6rem] font-semibold bg-white/[0.08] text-white/50 hover:bg-white/[0.12] transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}
