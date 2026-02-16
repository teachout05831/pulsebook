import { NextResponse } from "next/server";
import { getTerminology } from "@/features/terminology/queries/getTerminology";
import { saveTerminology } from "@/features/terminology/actions/saveTerminology";

export async function GET() {
  try {
    const terminology = await getTerminology();
    return NextResponse.json({ data: terminology }, {
      headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=120" }
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch terminology" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const result = await saveTerminology(body);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save terminology" }, { status: 500 });
  }
}
