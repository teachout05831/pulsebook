import { NextRequest, NextResponse } from 'next/server';
import { getAuthCompany, AuthError } from '@/lib/auth/getAuthCompany';
import type { DispatchSettings } from '@/features/dispatch-settings/types';
import { defaultDispatchSettings } from '@/features/dispatch-settings/types';

const VALID_VIEWS = ['timeline', 'list', 'kanban', 'cards', 'agenda', 'week', 'resource', 'dispatch', 'crew'];

export async function GET() {
  try {
    const { supabase, companyId } = await getAuthCompany();

    const { data, error } = await supabase
      .from('companies')
      .select('settings')
      .eq('id', companyId)
      .single();

    if (error) return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });

    const dispatch = data?.settings?.dispatch || {};

    // Filter out invalid view IDs (e.g. legacy 'calendar')
    const rawViews: string[] = dispatch.enabled_views || defaultDispatchSettings.enabledViews;
    const enabledViews = rawViews.filter((v: string) => VALID_VIEWS.includes(v));
    const safeEnabled = enabledViews.length > 0 ? enabledViews : defaultDispatchSettings.enabledViews;
    const rawDefault = dispatch.default_view || defaultDispatchSettings.defaultView;
    const safeDefault = safeEnabled.includes(rawDefault) ? rawDefault : safeEnabled[0];

    return NextResponse.json({
      enabledViews: safeEnabled,
      defaultView: safeDefault,
      showStatsBar: dispatch.show_stats_bar ?? defaultDispatchSettings.showStatsBar,
      showTechnicianFilter: dispatch.show_technician_filter ?? defaultDispatchSettings.showTechnicianFilter,
      allowDragDrop: dispatch.allow_drag_drop ?? defaultDispatchSettings.allowDragDrop,
      refreshInterval: dispatch.refresh_interval ?? defaultDispatchSettings.refreshInterval,
    }, {
      headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=120" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { supabase, companyId } = await getAuthCompany();
    const body: DispatchSettings = await request.json();

    // Filter to valid views only (strips out legacy/invalid IDs like 'calendar')
    const cleanedViews = (body.enabledViews || []).filter((v: string) => VALID_VIEWS.includes(v));
    if (cleanedViews.length === 0) {
      return NextResponse.json({ error: 'At least one valid view must be enabled' }, { status: 400 });
    }

    // Ensure defaultView is valid and enabled
    const defaultView = cleanedViews.includes(body.defaultView) ? body.defaultView : cleanedViews[0];

    // Fetch current settings
    const { data: current, error: fetchError } = await supabase
      .from('companies')
      .select('settings')
      .eq('id', companyId)
      .single();

    if (fetchError) return NextResponse.json({ error: 'Failed to fetch current settings' }, { status: 500 });

    // Merge dispatch settings into existing settings (snake_case for DB)
    const existingSettings = current?.settings || {};
    const updatedSettings = {
      ...existingSettings,
      dispatch: {
        enabled_views: cleanedViews,
        default_view: defaultView,
        show_stats_bar: body.showStatsBar,
        show_technician_filter: body.showTechnicianFilter,
        allow_drag_drop: body.allowDragDrop,
        refresh_interval: body.refreshInterval,
      },
    };

    const { error: updateError } = await supabase
      .from('companies')
      .update({ settings: updatedSettings })
      .eq('id', companyId);

    if (updateError) return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
