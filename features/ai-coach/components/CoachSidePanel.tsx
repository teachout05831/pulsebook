'use client'

import { useState, useEffect } from 'react'
import type { DailyCall } from '@daily-co/daily-js'
import type { CoachCatalogItem, AICoachSettings, CoachLibraryCustomization } from '../types'
import { useLiveTranscript } from '../hooks/useLiveTranscript'
import { useAICoach } from '../hooks/useAICoach'
import { CoachPanel } from './CoachPanel'
import { LiveTranscriptPanel } from './LiveTranscriptPanel'

type Tab = 'coach' | 'transcript' | 'notes'

interface CoachSidePanelProps {
  callObject: DailyCall | null
  catalog: CoachCatalogItem[]
  settings: AICoachSettings
  consultationId: string
  customization?: CoachLibraryCustomization | null
}

export function CoachSidePanel({
  callObject,
  catalog,
  settings,
  consultationId,
  customization = null,
}: CoachSidePanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('coach')
  const [notes, setNotes] = useState('')

  // Reset to coach tab if transcript tab becomes unavailable
  useEffect(() => {
    if (!settings.showTranscript && activeTab === 'transcript') {
      setActiveTab('coach')
    }
  }, [settings.showTranscript, activeTab])

  const { messages } = useLiveTranscript({ callObject, isHost: true })
  const { currentStage, suggestions, dismissCard, useCard } = useAICoach({
    messages,
    catalog,
    settings,
    customization,
  })

  // Persist notes to localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`coach-notes-${consultationId}`)
    if (saved) setNotes(saved)
  }, [consultationId])

  const handleNotesChange = (value: string) => {
    setNotes(value)
    localStorage.setItem(`coach-notes-${consultationId}`, value)
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'coach', label: 'Coach' },
    ...(settings.showTranscript ? [{ key: 'transcript' as Tab, label: 'Transcript' }] : []),
    { key: 'notes', label: 'Notes' },
  ]

  return (
    <div className="w-[360px] bg-[#111827] border-l border-white/[0.08] flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex border-b border-white/[0.06]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? 'text-white border-b-2 border-blue-500 bg-white/[0.04]'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            {tab.label}
            {tab.key === 'transcript' && messages.length > 0 && (
              <span className="ml-1.5 text-[0.58rem] text-white/30">
                ({messages.length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'coach' && (
          <CoachPanel
            currentStage={currentStage}
            suggestions={suggestions}
            onDismiss={dismissCard}
            onUse={useCard}
          />
        )}
        {activeTab === 'transcript' && (
          <LiveTranscriptPanel messages={messages} />
        )}
        {activeTab === 'notes' && (
          <div className="h-full p-3">
            <textarea
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Quick notes during the call..."
              className="w-full h-full bg-white/[0.04] border border-white/[0.08] rounded-lg p-3 text-xs text-white placeholder-white/30 resize-none focus:outline-none focus:border-blue-500/50"
            />
          </div>
        )}
      </div>
    </div>
  )
}
