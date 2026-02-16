import { createContext, useContext } from "react";
import type {
  DispatchView,
  DispatchJob,
  DispatchTechnician,
  DispatchCrew,
  DispatchStats,
  DispatchStatus,
  DispatchFilters,
  DispatchDateRange,
  ViewAccessResult,
} from "@/types/dispatch";

export interface DispatchContextValue {
  currentView: DispatchView;
  setCurrentView: (view: DispatchView) => void;
  viewAccess: ViewAccessResult;

  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  goToToday: () => void;
  goToPrevious: (unit?: "day" | "week" | "month") => void;
  goToNext: (unit?: "day" | "week" | "month") => void;
  dateRange: DispatchDateRange;
  dateRangePreference: "day" | "3day" | "week" | "custom";
  setDateRangePreference: (pref: "day" | "3day" | "week" | "custom") => void;
  customDateRange: DispatchDateRange | null;
  setCustomDateRange: (range: DispatchDateRange | null) => void;

  jobs: DispatchJob[];
  technicians: DispatchTechnician[];
  crews: DispatchCrew[];
  stats: DispatchStats;
  dispatchStatus: DispatchStatus;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;

  filters: DispatchFilters;
  setFilters: (filters: DispatchFilters) => void;
  updateFilter: <K extends keyof DispatchFilters>(key: K, value: DispatchFilters[K]) => void;
  clearFilters: () => void;

  selectedTechnicianIds: string[];
  setSelectedTechnicianIds: (ids: string[]) => void;
  toggleTechnician: (id: string) => void;

  updateJob: (jobId: string, updates: Partial<DispatchJob>) => Promise<void>;
  optimisticUpdateJobStatus: (jobId: string, status: DispatchJob["status"]) => void;
  optimisticAssignJob: (jobId: string, technicianId: string | null, technicianName: string | null) => void;
  optimisticAssignCrew: (jobId: string, crewId: string | null, crewName: string | null) => void;
  optimisticRescheduleJob: (jobId: string, date: string, time: string | null) => void;

  selectedJobId: string | null;
  setSelectedJobId: (id: string | null) => void;
  isDetailsPanelOpen: boolean;
  setIsDetailsPanelOpen: (open: boolean) => void;
  showMap: boolean;
  setShowMap: (show: boolean) => void;
}

export const DispatchContext = createContext<DispatchContextValue | null>(null);

export function useDispatch() {
  const context = useContext(DispatchContext);
  if (!context) {
    throw new Error("useDispatch must be used within a DispatchProvider");
  }
  return context;
}
