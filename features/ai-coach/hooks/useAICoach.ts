'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import type { TranscriptMessage, CoachingSuggestion, CoachCatalogItem, SalesStage, AICoachSettings, CoachLibraryCustomization } from '../types'
import { detectStage } from '../utils/detectStage'
import { detectObjections } from '../utils/detectObjections'
import { matchServices } from '../utils/matchServices'
import { createObjectionCard, createServiceCard } from '../utils/createCards'
import { mergeCoachingCards, mergeStageConfigs, mergeObjectionPatterns } from '../utils/mergeCustomizations'

const AUTO_DISMISS_MS = 120_000
const MAX_VISIBLE = 3

interface UseAICoachOptions {
  messages: TranscriptMessage[]
  catalog: CoachCatalogItem[]
  settings: AICoachSettings
  customization?: CoachLibraryCustomization | null
}

export function useAICoach({ messages, catalog, settings, customization = null }: UseAICoachOptions) {
  const cards = useMemo(() => mergeCoachingCards(customization), [customization])
  const configs = useMemo(() => mergeStageConfigs(customization), [customization])
  const patterns = useMemo(() => mergeObjectionPatterns(customization), [customization])
  const [currentStage, setCurrentStage] = useState<SalesStage>('greeting')
  const [suggestions, setSuggestions] = useState<CoachingSuggestion[]>([])
  const objIds = useRef(new Set<string>())
  const svcIds = useRef(new Set<string>())
  const callStart = useRef(Date.now())
  const prevStage = useRef<SalesStage>('greeting')
  const prevCount = useRef(0)
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  useEffect(() => {
    if (!settings.enabled) return
    const initial: CoachingSuggestion[] = cards.greeting.map((c) => ({ ...c, createdAt: Date.now() }))
    if (customization?.companyContext) {
      initial.unshift({ id: 'ctx', type: 'info_alert', title: 'Company Context', body: customization.companyContext, stage: 'greeting', priority: 10, createdAt: Date.now(), dismissed: false })
    }
    setSuggestions(initial)
  }, [settings.enabled, cards, customization])

  useEffect(() => {
    if (!settings.enabled || messages.length === prevCount.current) return
    prevCount.current = messages.length

    if (settings.autoAdvanceStage) {
      const stage = detectStage(messages, currentStage, callStart.current, configs)
      if (stage !== prevStage.current) {
        setCurrentStage(stage)
        prevStage.current = stage
        const stageCards = (cards[stage] || []).map((c) => ({ ...c, createdAt: Date.now() }))
        if (stageCards.length) setSuggestions((p) => [...p, ...stageCards])
      }
    }

    if (settings.showObjectionResponses) {
      for (const obj of detectObjections(messages, objIds.current, patterns)) {
        objIds.current.add(obj.id)
        setSuggestions((p) => [...p, createObjectionCard(obj, currentStage)])
      }
    }

    if (settings.showServiceSuggestions) {
      for (const svc of matchServices(messages, catalog, svcIds.current)) {
        svcIds.current.add(svc.id)
        setSuggestions((p) => [...p, createServiceCard(svc, currentStage)])
      }
    }
  }, [messages, settings, catalog, currentStage, cards, configs, patterns])

  // Auto-dismiss after 2 minutes
  useEffect(() => {
    for (const card of suggestions.filter((s) => !s.dismissed)) {
      if (timers.current.has(card.id)) continue
      const t = setTimeout(() => {
        setSuggestions((p) => p.map((s) => (s.id === card.id ? { ...s, dismissed: true } : s)))
        timers.current.delete(card.id)
      }, AUTO_DISMISS_MS)
      timers.current.set(card.id, t)
    }
    return () => {
      timers.current.forEach((t) => clearTimeout(t))
      timers.current.clear()
    }
  }, [suggestions])

  const dismissCard = useCallback((id: string) => {
    setSuggestions((p) => p.map((s) => (s.id === id ? { ...s, dismissed: true } : s)))
  }, [])

  const useCard = useCallback((id: string) => {
    const card = suggestions.find((s) => s.id === id)
    if (card?.scriptText) navigator.clipboard.writeText(card.scriptText).catch(() => {})
    dismissCard(id)
  }, [suggestions, dismissCard])

  const visible = suggestions.filter((s) => !s.dismissed).slice(-MAX_VISIBLE)
  return { currentStage, suggestions: visible, dismissCard, useCard }
}
