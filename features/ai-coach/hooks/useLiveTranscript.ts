'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { DailyCall } from '@daily-co/daily-js'
import type { TranscriptMessage } from '../types'

const MAX_MESSAGES = 500

interface UseLiveTranscriptOptions {
  callObject: DailyCall | null
  isHost: boolean
}

/**
 * Attaches to Daily.co transcription-message events and accumulates
 * live transcript messages. Caps at MAX_MESSAGES (drops oldest).
 */
export function useLiveTranscript({ callObject, isHost }: UseLiveTranscriptOptions) {
  const [messages, setMessages] = useState<TranscriptMessage[]>([])
  const [isTranscribing, setIsTranscribing] = useState(false)
  const counterRef = useRef(0)

  useEffect(() => {
    if (!callObject) return

    const handleTranscriptionMessage = (event: {
      text?: string
      timestamp?: number
      participantId?: string
      rawResponse?: unknown
    }) => {
      if (!event.text || event.text.trim().length === 0) return

      setIsTranscribing(true)
      counterRef.current += 1

      const localParticipant = callObject.participants()?.local
      const senderId = event.participantId || ''
      const senderIsHost = localParticipant
        ? senderId === localParticipant.session_id
        : false

      const message: TranscriptMessage = {
        id: `msg_${counterRef.current}_${Date.now()}`,
        speaker: senderIsHost ? 'You' : 'Customer',
        text: event.text,
        timestamp: event.timestamp || Date.now(),
        isHost: isHost ? senderIsHost : !senderIsHost,
      }

      setMessages((prev) => {
        const next = [...prev, message]
        return next.length > MAX_MESSAGES ? next.slice(-MAX_MESSAGES) : next
      })
    }

    const handleTranscriptionStarted = () => setIsTranscribing(true)
    const handleTranscriptionStopped = () => setIsTranscribing(false)

    callObject.on('transcription-message', handleTranscriptionMessage as never)
    callObject.on('transcription-started', handleTranscriptionStarted as never)
    callObject.on('transcription-stopped', handleTranscriptionStopped as never)

    return () => {
      callObject.off('transcription-message', handleTranscriptionMessage as never)
      callObject.off('transcription-started', handleTranscriptionStarted as never)
      callObject.off('transcription-stopped', handleTranscriptionStopped as never)
    }
  }, [callObject, isHost])

  const clearTranscript = useCallback(() => {
    setMessages([])
    counterRef.current = 0
  }, [])

  return { messages, isTranscribing, clearTranscript }
}
