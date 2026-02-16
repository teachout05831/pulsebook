'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { SalesAsset } from '../types';

export function useAssetsByIds(ids: string[]) {
  const [assets, setAssets] = useState<SalesAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const idsKey = ids.join(',');
  const prevIdsKey = useRef(idsKey);

  const fetchByIds = useCallback(async () => {
    if (!ids.length) {
      setAssets([]);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/estimate-pages/videos/batch?ids=${ids.join(',')}`);
      const json = await res.json();
      if (res.ok) setAssets(json.data || []);
    } catch {
      // silent - in-call context should not break on fetch failure
    } finally {
      setIsLoading(false);
    }
  }, [idsKey]);

  useEffect(() => {
    if (idsKey !== prevIdsKey.current || assets.length === 0) {
      prevIdsKey.current = idsKey;
      fetchByIds();
    }
  }, [fetchByIds, idsKey, assets.length]);

  return { assets, isLoading, refresh: fetchByIds };
}
