import { NextResponse } from "next/server";
import { dispatchSchedule } from "@/features/crews/actions/dispatchSchedule";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.date) {
      return NextResponse.json({ error: "date is required" }, { status: 400 });
    }

    const result = await dispatchSchedule(body.date, body.notes);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });

    return NextResponse.json({ success: true, dispatchedAt: result.dispatchedAt });
  } catch {
    return NextResponse.json({ error: "Failed to dispatch schedule" }, { status: 500 });
  }
}
