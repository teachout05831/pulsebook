import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import { defaultCustomerPortalSettings } from "@/types/company";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    const { customerId } = await params;
    const { supabase, companyId } = await getAuthCompany();

    // Parallel fetch: customer, company, brand kit
    const [customerRes, companyRes, brandKitRes] = await Promise.all([
      supabase
        .from("customers")
        .select("id, name, email, phone, address")
        .eq("id", customerId)
        .eq("company_id", companyId)
        .single(),
      supabase
        .from("companies")
        .select("name, logo_url, settings")
        .eq("id", companyId)
        .single(),
      supabase
        .from("company_brand_kits")
        .select("primary_color")
        .eq("company_id", companyId)
        .limit(1)
        .single(),
    ]);

    if (!customerRes.data) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const settings = companyRes.data?.settings as Record<string, unknown> | null;
    const portalSettings = settings?.customerPortal
      ? { ...defaultCustomerPortalSettings, ...(settings.customerPortal as Record<string, unknown>) }
      : defaultCustomerPortalSettings;

    return NextResponse.json({
      data: {
        customerId,
        name: customerRes.data.name,
        email: customerRes.data.email,
        phone: customerRes.data.phone || null,
        address: customerRes.data.address || null,
        companyName: companyRes.data?.name || "",
        companyLogo: companyRes.data?.logo_url || null,
        primaryColor: brandKitRes.data?.primary_color || null,
        portalSettings,
      },
    }, {
      headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=60" }
    });
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    }
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}
