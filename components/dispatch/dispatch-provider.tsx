"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  DispatchView,
  DispatchFilters,
  defaultDispatchFilters,
} from "@/types/dispatch";
import { useViewAccess } from "@/hooks/use-view-access";
import { useDispatchData, useDateNavigation } from "@/hooks/use-dispatch-data";
import { useDispatchSettings } from "@/features/dispatch-settings/hooks/useDispatchSettings";
import { DispatchContext, type DispatchContextValue } from "./dispatch-context";
import { DispatchErrorBoundary } from "./DispatchErrorBoundary";

// Re-export useDispatch for backwards compatibility
export { useDispatch } from "./dispatch-context";

interface DispatchProviderProps {
  children: React.ReactNode;
}

export function DispatchProvider({ children }: DispatchProviderProps) {
  const [mounted, setMounted] = useState(false);
  const { settings: dispatchSettings } = useDispatchSettings();
  const viewAccess = useViewAccess({
    companySettings: {
      enabledViews: dispatchSettings.enabledViews as DispatchView[],
      defaultView: dispatchSettings.defaultView as DispatchView,
      showStatsBar: dispatchSettings.showStatsBar,
      showTechnicianFilter: dispatchSettings.showTechnicianFilter,
      allowDragDrop: dispatchSettings.allowDragDrop,
      refreshInterval: dispatchSettings.refreshInterval,
    },
  });

  const [currentView, setCurrentViewState] = useState<DispatchView>(viewAccess.effectiveDefaultView);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get("view") as DispatchView | null;
    if (viewParam && viewAccess.canAccess(viewParam)) setCurrentViewState(viewParam);
  }, [viewAccess]);

  const setCurrentView = useCallback((view: DispatchView) => {
    if (viewAccess.canAccess(view)) {
      setCurrentViewState(view);
      const url = new URL(window.location.href);
      url.searchParams.set("view", view);
      window.history.replaceState({}, "", url.toString());
    }
  }, [viewAccess]);

  const [dateRangePreference, setDateRangePreference] = useState<"day" | "3day" | "week" | "custom">("day");
  const [customDateRange, setCustomDateRange] = useState<import("@/types/dispatch").DispatchDateRange | null>(null);
  const { selectedDate, setSelectedDate, goToToday, goToPrevious, goToNext, getDateRange } = useDateNavigation();
  const dateRange = useMemo(
    () => dateRangePreference === "custom" && customDateRange ? customDateRange : getDateRange(dateRangePreference as "day" | "3day" | "week"),
    [getDateRange, dateRangePreference, customDateRange],
  );

  const [filters, setFilters] = useState<DispatchFilters>(defaultDispatchFilters);
  const [selectedTechnicianIds, setSelectedTechnicianIds] = useState<string[]>([]);

  const updateFilter = useCallback(<K extends keyof DispatchFilters>(key: K, value: DispatchFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(defaultDispatchFilters);
    setSelectedTechnicianIds([]);
  }, []);

  const toggleTechnician = useCallback((id: string) => {
    setSelectedTechnicianIds(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  }, []);

  const activeFilters = useMemo(() => ({ ...filters, technicianIds: selectedTechnicianIds }), [filters, selectedTechnicianIds]);

  const {
    jobs, technicians, crews, stats, dispatchStatus, isLoading, error, refetch,
    updateJob, optimisticUpdateJobStatus, optimisticAssignJob, optimisticAssignCrew, optimisticRescheduleJob,
  } = useDispatchData({ dateRange, filters: activeFilters, refreshInterval: viewAccess.companySettings.refreshInterval });

  // showMap is now just UI state, not tied to data fetching
  const [showMap, setShowMap] = useState(false);

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);

  const value: DispatchContextValue = useMemo(() => ({
    currentView, setCurrentView, viewAccess,
    selectedDate, setSelectedDate, goToToday, goToPrevious, goToNext, dateRange, dateRangePreference, setDateRangePreference, customDateRange, setCustomDateRange,
    jobs, technicians, crews, stats, dispatchStatus, isLoading, error, refetch,
    filters, setFilters, updateFilter, clearFilters, selectedTechnicianIds, setSelectedTechnicianIds, toggleTechnician,
    updateJob, optimisticUpdateJobStatus, optimisticAssignJob, optimisticAssignCrew, optimisticRescheduleJob,
    selectedJobId, setSelectedJobId, isDetailsPanelOpen, setIsDetailsPanelOpen, showMap, setShowMap,
  }), [
    currentView, setCurrentView, viewAccess, selectedDate, setSelectedDate, goToToday, goToPrevious, goToNext,
    dateRange, dateRangePreference, setDateRangePreference, customDateRange, setCustomDateRange, jobs, technicians, crews, stats, dispatchStatus,
    isLoading, error, refetch, filters, setFilters, updateFilter, clearFilters, selectedTechnicianIds,
    setSelectedTechnicianIds, toggleTechnician, updateJob, optimisticUpdateJobStatus, optimisticAssignJob,
    optimisticAssignCrew, optimisticRescheduleJob, selectedJobId, setSelectedJobId, isDetailsPanelOpen,
    setIsDetailsPanelOpen, showMap, setShowMap,
  ]);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col h-[calc(100vh-32px)]">
        <div className="h-[49px] bg-white border-b border-gray-200" />
        <div className="flex-1 bg-gray-50" />
      </div>
    );
  }

  return (
    <DispatchContext.Provider value={value}>
      <DispatchErrorBoundary>
        {children}
      </DispatchErrorBoundary>
    </DispatchContext.Provider>
  );
}
