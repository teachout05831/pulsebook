import { NextResponse } from "next/server";
import { updateRosterMember } from "@/features/crews/actions/updateRosterMember";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.crewId || !body.date || !body.teamMemberId || !body.action) {
      return NextResponse.json(
        { error: "crewId, date, teamMemberId, and action are required" },
        { status: 400 }
      );
    }

    if (body.action !== "add" && body.action !== "remove") {
      return NextResponse.json(
        { error: "action must be 'add' or 'remove'" },
        { status: 400 }
      );
    }

    const result = await updateRosterMember(
      body.crewId,
      body.date,
      body.teamMemberId,
      body.action
    );

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update roster member" },
      { status: 500 }
    );
  }
}
