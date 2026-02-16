import { NextRequest, NextResponse } from "next/server";
import { getPublicSchedulingPage } from "@/features/scheduling/queries/getPublicSchedulingPage";

export async function GET(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  try {
    const data = await getPublicSchedulingPage(token);
    if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ data }, {
      headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" }
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
