import { NextResponse } from "next/server";
import { getCustomDropdowns } from "@/features/custom-dropdowns/queries/getCustomDropdowns";
import { saveCustomDropdowns } from "@/features/custom-dropdowns/actions/saveCustomDropdowns";

export async function GET() {
  try {
    const dropdowns = await getCustomDropdowns();
    return NextResponse.json({ data: dropdowns }, {
      headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=120" }
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch dropdowns" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const result = await saveCustomDropdowns(body);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save dropdowns" }, { status: 500 });
  }
}
