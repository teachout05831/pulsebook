import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const body = await request.json();
    const { customerId } = body;

    if (!customerId) {
      return NextResponse.json(
        { error: "customerId is required" },
        { status: 400 }
      );
    }

    // Verify customer belongs to company and has portal access
    const { data: customer } = await supabase
      .from("customers")
      .select("id, company_id, user_id, email")
      .eq("id", customerId)
      .single();

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    if (customer.company_id !== companyId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }
    if (!customer.user_id) {
      return NextResponse.json(
        { error: "Customer does not have portal access" },
        { status: 400 }
      );
    }
    if (!customer.email) {
      return NextResponse.json(
        { error: "Customer has no email" },
        { status: 400 }
      );
    }

    // Generate magic link via admin API
    const adminClient = createAdminClient();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4000";

    const { data: linkData, error: linkError } =
      await adminClient.auth.admin.generateLink({
        type: "magiclink",
        email: customer.email,
        options: { redirectTo: `${baseUrl}/auth/callback?next=/portal` },
      });

    if (linkError || !linkData?.properties?.action_link) {
      return NextResponse.json(
        { error: "Failed to generate login link" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: linkData.properties.action_link });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
