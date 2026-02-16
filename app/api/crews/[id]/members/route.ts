import { NextResponse } from "next/server";
import { addCrewMember } from "@/features/crews/actions/addCrewMember";
import { removeCrewMember } from "@/features/crews/actions/removeCrewMember";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.teamMemberId) {
      return NextResponse.json({ error: "teamMemberId is required" }, { status: 400 });
    }

    const result = await addCrewMember(id, body.teamMemberId, body.isDefault ?? true);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });

    return NextResponse.json({ data: result.data });
  } catch {
    return NextResponse.json({ error: "Failed to add member" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.teamMemberId) {
      return NextResponse.json({ error: "teamMemberId is required" }, { status: 400 });
    }

    const result = await removeCrewMember(id, body.teamMemberId);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to remove member" }, { status: 500 });
  }
}
