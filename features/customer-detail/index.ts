// Components
export { CustomerDetailPage } from "./components/CustomerDetailPage";
export { CustomerHeader } from "./components/CustomerHeader";
export { CustomerTabs } from "./components/CustomerTabs";
export { LeadProfileView } from "./components/LeadProfileView";

// Hooks
export { useCustomerData } from "./hooks/useCustomerData";
export { useCustomerStats } from "./hooks/useCustomerStats";
export { useCustomerTabs } from "./hooks/useCustomerTabs";

// Types
export type {
  CustomerTab,
  LeadTab,
  CustomerStats,
  CustomerStatus,
  CustomerNote,
  CustomerFile,
  ActivityItem,
  CreateNoteInput,
  LeadQuickStatsData,
  JobsFilterStatus,
} from "./types";
