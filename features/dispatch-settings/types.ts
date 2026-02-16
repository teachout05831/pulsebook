export interface DispatchSettings {
  enabledViews: string[];
  defaultView: string;
  showStatsBar: boolean;
  showTechnicianFilter: boolean;
  allowDragDrop: boolean;
  refreshInterval: number;
}

export const defaultDispatchSettings: DispatchSettings = {
  enabledViews: ['timeline', 'list'],
  defaultView: 'list',
  showStatsBar: true,
  showTechnicianFilter: true,
  allowDragDrop: true,
  refreshInterval: 30,
};
