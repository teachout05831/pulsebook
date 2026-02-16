'use client'

import { useState, useEffect, useRef } from 'react'
import type { TranscriptMessage } from '../types'

interface LiveTranscriptPanelProps {
  messages: TranscriptMessage[]
}

export function LiveTranscriptPanel({ messages }: LiveTranscriptPanelProps) {
  const [search, setSearch] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const userScrolledUp = useRef(false)

  // Auto-scroll to bottom on new messages (unless user scrolled up)
  useEffect(() => {
    if (!userScrolledUp.current && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages.length])

  const handleScroll = () => {
    if (!scrollRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    userScrolledUp.current = scrollHeight - scrollTop - clientHeight > 40
  }

  const filtered = search.trim()
    ? messages.filter((m) =>
        m.text.toLowerCase().includes(search.toLowerCase())
      )
    : messages

  const formatTime = (ts: number) => {
    const d = new Date(ts)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search bar */}
      <div className="px-3 py-2 border-b border-white/[0.06]">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search transcript..."
          className="w-full bg-white/[0.06] border border-white/[0.08] rounded px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50"
        />
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-3 py-2 space-y-2"
      >
        {filtered.length === 0 ? (
          <div className="text-white/30 text-xs text-center mt-8">
            {messages.length === 0
              ? 'Waiting for transcription to start...'
              : 'No messages match your search'}
          </div>
        ) : (
          filtered.map((msg) => (
            <div key={msg.id} className="text-xs">
              <div className="flex items-baseline gap-2 mb-0.5">
                <span
                  className={`font-semibold text-[0.65rem] ${
                    msg.isHost ? 'text-blue-400' : 'text-green-400'
                  }`}
                >
                  {msg.speaker}
                </span>
                <span className="text-white/20 text-[0.58rem]">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
              <div className="text-white/60 leading-relaxed">
                {msg.text}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
