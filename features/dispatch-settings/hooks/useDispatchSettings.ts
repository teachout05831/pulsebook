'use client';

import { useState, useEffect } from 'react';
import type { DispatchSettings } from '../types';
import { defaultDispatchSettings } from '../types';

export function useDispatchSettings() {
  const [settings, setSettings] = useState<DispatchSettings>(defaultDispatchSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchSettings() {
      try {
        const res = await fetch('/api/dispatch-settings');
        if (!res.ok) return;
        const data: DispatchSettings = await res.json();
        if (!cancelled) {
          setSettings(data);
          setIsLoaded(true);
        }
      } catch {
        if (!cancelled) setIsLoaded(true);
      }
    }
    fetchSettings();
    return () => { cancelled = true; };
  }, []);

  return { settings, isLoaded };
}
