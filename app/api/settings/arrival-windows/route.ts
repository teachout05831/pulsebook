import { NextResponse } from "next/server";
import { getArrivalWindows } from "@/features/arrival-windows/queries/getArrivalWindows";
import { saveArrivalWindows } from "@/features/arrival-windows/actions/saveArrivalWindows";

export async function GET() {
  try {
    const windows = await getArrivalWindows();
    return NextResponse.json({ data: windows }, {
      headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=120" }
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch arrival windows" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const result = await saveArrivalWindows(body);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save arrival windows" }, { status: 500 });
  }
}
