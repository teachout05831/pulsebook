'use client'

import { useCallback } from 'react'

export interface GpsCoords {
  lat: number
  lng: number
}

export function useGps() {
  const capture = useCallback(async (): Promise<GpsCoords | null> => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return null
    return new Promise<GpsCoords | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve(null),
        { timeout: 5000, enableHighAccuracy: false }
      )
    })
  }, [])

  return { capture }
}
