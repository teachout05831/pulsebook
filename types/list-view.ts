export interface SavedListView {
  id: string;
  name: string;
  columnIds: string[];
  sortField: string | null;
  sortOrder: "asc" | "desc";
  filters: {
    statuses: string[];
    crewIds: string[];
    technicianIds: string[];
  };
  isDefault: boolean;
}

export interface ListViewSettings {
  savedViews: SavedListView[];
  activeViewId: string | null;
  defaultColumnIds: string[];
}

export const DEFAULT_COLUMN_IDS = [
  "scheduledTime", "jobCustomer", "address", "technician", "status", "duration",
];

export const defaultListViewSettings: ListViewSettings = {
  savedViews: [],
  activeViewId: null,
  defaultColumnIds: DEFAULT_COLUMN_IDS,
};
