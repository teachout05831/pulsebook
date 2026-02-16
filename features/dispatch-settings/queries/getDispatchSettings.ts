import { createClient } from '@/lib/supabase/server';
import type { DispatchSettings } from '../types';
import { defaultDispatchSettings } from '../types';

const VALID_VIEWS = ['timeline', 'list', 'kanban', 'cards', 'agenda', 'week', 'resource', 'dispatch', 'crew'];

export async function getDispatchSettings(): Promise<DispatchSettings> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: userData } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .limit(1)
    .single();

  if (!userData?.active_company_id) throw new Error('No active company');

  const { data, error } = await supabase
    .from('companies')
    .select('settings')
    .eq('id', userData.active_company_id)
    .limit(1)
    .single();

  if (error) throw error;

  const d = data?.settings?.dispatch || {};

  // Filter out invalid view IDs (e.g. legacy 'calendar')
  const rawViews: string[] = d.enabled_views || d.enabledViews || defaultDispatchSettings.enabledViews;
  const enabledViews = rawViews.filter((v: string) => VALID_VIEWS.includes(v));
  const safeEnabled = enabledViews.length > 0 ? enabledViews : defaultDispatchSettings.enabledViews;
  const rawDefault = d.default_view || d.defaultView || defaultDispatchSettings.defaultView;
  const safeDefault = safeEnabled.includes(rawDefault) ? rawDefault : safeEnabled[0];

  return {
    enabledViews: safeEnabled,
    defaultView: safeDefault,
    showStatsBar: d.show_stats_bar ?? d.showStatsBar ?? defaultDispatchSettings.showStatsBar,
    showTechnicianFilter: d.show_technician_filter ?? d.showTechnicianFilter ?? defaultDispatchSettings.showTechnicianFilter,
    allowDragDrop: d.allow_drag_drop ?? d.allowDragDrop ?? defaultDispatchSettings.allowDragDrop,
    refreshInterval: d.refresh_interval ?? d.refreshInterval ?? defaultDispatchSettings.refreshInterval,
  };
}
