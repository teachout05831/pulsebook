import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import { inviteTech } from "@/features/tech-portal/actions";

export async function POST(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const body = await request.json();
    const { teamMemberId, password } = body;

    if (!teamMemberId) {
      return NextResponse.json(
        { error: "teamMemberId is required" },
        { status: 400 }
      );
    }

    const result = await inviteTech(
      supabase,
      companyId,
      teamMemberId,
      password
    );

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      tempPassword: result.tempPassword,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
