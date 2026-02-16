import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import type { ListViewSettings } from "@/types/list-view";
import { defaultListViewSettings } from "@/types/list-view";

// GET - Load saved list view settings
export async function GET() {
  try {
    const { supabase, companyId } = await getAuthCompany();

    const { data, error } = await supabase
      .from("companies")
      .select("settings")
      .eq("id", companyId)
      .single();

    if (error) return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });

    const settings = (data?.settings as Record<string, unknown>) || {};
    const listViewSettings = (settings.listViewSettings as ListViewSettings) || defaultListViewSettings;

    return NextResponse.json({ listViewSettings }, {
      headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=120" }
    });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.statusCode });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PATCH - Update saved list view settings
export async function PATCH(request: NextRequest) {
  try {
    const { supabase, companyId } = await getAuthCompany();
    const body = await request.json();
    const { listViewSettings } = body;

    if (!listViewSettings || typeof listViewSettings !== "object") {
      return NextResponse.json({ error: "listViewSettings object is required" }, { status: 400 });
    }

    // Read current settings first (ownership check — we already verified companyId via getAuthCompany)
    const { data: current, error: readError } = await supabase
      .from("companies")
      .select("settings")
      .eq("id", companyId)
      .single();

    if (readError || !current) return NextResponse.json({ error: "Company not found" }, { status: 404 });

    const existingSettings = (current.settings as Record<string, unknown>) || {};
    const updatedSettings = { ...existingSettings, listViewSettings };

    const { error: updateError } = await supabase
      .from("companies")
      .update({ settings: updatedSettings })
      .eq("id", companyId);

    if (updateError) return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });

    return NextResponse.json({ listViewSettings });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.statusCode });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
