import { NextResponse } from "next/server";
import { getDailyRoster } from "@/features/crews/queries/getDailyRoster";
import { saveDailyRoster } from "@/features/crews/actions/saveDailyRoster";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

    const roster = await getDailyRoster(date);

    // Convert snake_case → camelCase
    const data = roster.map((r) => ({
      id: r.id,
      crewId: r.crew_id,
      rosterDate: r.roster_date,
      teamMemberId: r.team_member_id,
      memberName: (r as Record<string, unknown>).team_members
        ? ((r as Record<string, unknown>).team_members as Record<string, unknown>).name
        : "Unknown",
      isPresent: r.is_present,
      isFillIn: r.is_fill_in,
    }));

    return NextResponse.json({ data }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch roster" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.date) {
      return NextResponse.json({ error: "date is required" }, { status: 400 });
    }

    // Convert camelCase → snake_case for entries
    const entries = (body.entries || []).map((e: Record<string, unknown>) => ({
      crew_id: e.crewId,
      team_member_id: e.teamMemberId,
      is_present: e.isPresent ?? true,
      is_fill_in: e.isFillIn ?? false,
    }));

    const result = await saveDailyRoster(body.date, entries);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save roster" }, { status: 500 });
  }
}
