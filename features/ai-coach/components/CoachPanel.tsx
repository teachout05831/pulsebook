'use client'

import type { SalesStage, CoachingSuggestion } from '../types'
import { StageIndicator } from './StageIndicator'
import { CoachCard } from './CoachCard'

interface CoachPanelProps {
  currentStage: SalesStage
  suggestions: CoachingSuggestion[]
  onDismiss: (id: string) => void
  onUse: (id: string) => void
}

export function CoachPanel({
  currentStage,
  suggestions,
  onDismiss,
  onUse,
}: CoachPanelProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Stage indicator at top */}
      <StageIndicator currentStage={currentStage} />

      {/* Coaching cards */}
      <div className="flex-1 overflow-y-auto">
        {suggestions.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-white/30 text-xs px-4 text-center">
            <div>
              <div className="text-lg mb-2">🎧</div>
              <div>Listening for coaching opportunities...</div>
              <div className="mt-1 text-white/20">
                Cards will appear as the conversation progresses
              </div>
            </div>
          </div>
        ) : (
          <div className="py-1">
            {suggestions.map((suggestion) => (
              <CoachCard
                key={suggestion.id}
                suggestion={suggestion}
                onDismiss={onDismiss}
                onUse={onUse}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
