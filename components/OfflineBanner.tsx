'use client'

import { useState, useEffect } from 'react'
import { WifiOff, RefreshCw } from 'lucide-react'

interface Props {
  pendingSyncs?: number
}

export function OfflineBanner({ pendingSyncs = 0 }: Props) {
  const [isOnline, setIsOnline] = useState(true)
  const [showReconnect, setShowReconnect] = useState(false)

  useEffect(() => {
    setIsOnline(navigator.onLine)
    const goOnline = () => {
      setIsOnline(true)
      setShowReconnect(true)
      setTimeout(() => setShowReconnect(false), 3000)
    }
    const goOffline = () => { setIsOnline(false); setShowReconnect(false) }
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  if (isOnline && !showReconnect) return null

  if (isOnline && showReconnect) {
    return (
      <div className="bg-green-500 text-white text-center py-1.5 px-4 text-xs font-medium flex items-center justify-center gap-2">
        <RefreshCw className="h-3 w-3 animate-spin" />
        Back online{pendingSyncs > 0 ? ` — syncing ${pendingSyncs} changes...` : ''}
      </div>
    )
  }

  return (
    <div className="bg-amber-500 text-white text-center py-1.5 px-4 text-xs font-medium flex items-center justify-center gap-2">
      <WifiOff className="h-3 w-3" />
      You&apos;re offline — changes saved locally
      {pendingSyncs > 0 && <span className="bg-amber-600 rounded-full px-1.5 py-0.5 text-[10px]">{pendingSyncs}</span>}
    </div>
  )
}
