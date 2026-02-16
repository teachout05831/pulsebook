import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  return withApiAuth(request, async ({ userId, companyId, supabase }) => {
    const { data: company, error } = await supabase
      .from("companies")
      .select("id, name, slug, email, phone, address, city, state, zip_code, settings, created_at")
      .eq("id", companyId)
      .single();

    if (error || !company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const { data: user } = await supabase
      .from("users")
      .select("id, email, full_name")
      .eq("id", userId)
      .single();

    return NextResponse.json({
      data: {
        user: user ? {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
        } : null,
        company: {
          id: company.id,
          name: company.name,
          slug: company.slug,
          email: company.email,
          phone: company.phone,
          address: company.address,
          city: company.city,
          state: company.state,
          zipCode: company.zip_code,
          createdAt: company.created_at,
        },
      },
    }, {
      headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=120" }
    });
  });
}
