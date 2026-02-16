"use client";

import { useState, useEffect, useCallback } from "react";
import type { SavedListView, ListViewSettings } from "@/types/list-view";
import { defaultListViewSettings } from "@/types/list-view";

export function useListViewSettings() {
  const [settings, setSettings] = useState<ListViewSettings>(defaultListViewSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/dispatch/list-views");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setSettings(data.listViewSettings || defaultListViewSettings);
      } catch { /* fail silently */ } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const persist = useCallback(async (updated: ListViewSettings) => {
    setSettings(updated);
    await fetch("/api/dispatch/list-views", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listViewSettings: updated }),
    });
  }, []);

  const activeView = settings.savedViews.find((v) => v.id === settings.activeViewId) || null;

  const switchView = useCallback((viewId: string | null) => {
    persist({ ...settings, activeViewId: viewId });
  }, [settings, persist]);

  const saveView = useCallback((view: SavedListView) => {
    const existing = settings.savedViews.findIndex((v) => v.id === view.id);
    const views = [...settings.savedViews];
    if (existing >= 0) views[existing] = view; else views.push(view);
    persist({ ...settings, savedViews: views, activeViewId: view.id });
  }, [settings, persist]);

  const deleteView = useCallback((viewId: string) => {
    const views = settings.savedViews.filter((v) => v.id !== viewId);
    const activeId = settings.activeViewId === viewId ? null : settings.activeViewId;
    persist({ ...settings, savedViews: views, activeViewId: activeId });
  }, [settings, persist]);

  return { settings, views: settings.savedViews, activeView, switchView, saveView, deleteView, isLoading };
}
