import { NextResponse } from "next/server";
import { getEstimateSettings } from "@/features/estimate-settings/queries/getEstimateSettings";
import { saveEstimateSettings } from "@/features/estimate-settings/actions/saveEstimateSettings";

export async function GET() {
  try {
    const settings = await getEstimateSettings();
    return NextResponse.json({ data: settings }, {
      headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=120" }
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const result = await saveEstimateSettings(body);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
