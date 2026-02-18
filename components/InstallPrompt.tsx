'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Download, X, Share } from 'lucide-react'

const DISMISS_KEY = 'sp_install_dismiss'
const DISMISS_DAYS = 7

function isDismissed(): boolean {
  if (typeof window === 'undefined') return true
  const ts = localStorage.getItem(DISMISS_KEY)
  if (!ts) return false
  return Date.now() - Number(ts) < DISMISS_DAYS * 86400000
}

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) && !('standalone' in window.navigator && (window.navigator as unknown as { standalone: boolean }).standalone)
}

function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches
}

export function InstallPrompt() {
  const [show, setShow] = useState(false)
  const [iosMode, setIosMode] = useState(false)
  const deferredRef = useRef<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if (isStandalone() || isDismissed()) return

    if (isIos()) {
      setIosMode(true)
      setShow(true)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      deferredRef.current = e as BeforeInstallPromptEvent
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredRef.current) return
    deferredRef.current.prompt()
    const result = await deferredRef.current.userChoice
    if (result.outcome === 'accepted') setShow(false)
    deferredRef.current = null
  }

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()))
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:hidden">
      <div className="rounded-xl border bg-white shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-sm font-semibold">Install Pulsebook</p>
            {iosMode ? (
              <p className="text-xs text-muted-foreground mt-1">
                Tap <Share className="inline h-3 w-3 -mt-0.5" /> then &quot;Add to Home Screen&quot;
              </p>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">
                Add to your home screen for the best experience
              </p>
            )}
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={handleDismiss}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        {!iosMode && (
          <Button size="sm" className="w-full mt-3" onClick={handleInstall}>
            <Download className="h-4 w-4 mr-1" /> Install
          </Button>
        )}
      </div>
    </div>
  )
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}
