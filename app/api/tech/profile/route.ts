import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTechUser } from "@/lib/auth/getTechUser";

export async function GET() {
  const supabase = await createClient();

  const techUser = await getTechUser(supabase);
  if (!techUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: company } = await supabase
    .from("companies")
    .select("name, logo_url")
    .eq("id", techUser.companyId)
    .single();

  return NextResponse.json({
    data: {
      teamMemberId: techUser.teamMemberId,
      name: techUser.name,
      role: techUser.role,
      companyName: company?.name || "",
      companyLogo: company?.logo_url || null,
    },
  }, {
    headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=120" }
  });
}
