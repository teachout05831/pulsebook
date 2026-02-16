import { NextRequest, NextResponse } from "next/server";
import { getPublicConsultation } from "@/features/consultations/queries/getPublicConsultation";

// GET /api/consultations/public/[token] - Get public consultation data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const data = await getPublicConsultation(token);

  if (!data) {
    return NextResponse.json({ error: "Consultation not found" }, { status: 404 });
  }

  return NextResponse.json({ data }, {
    headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" }
  });
}
