import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCustomerUser } from "@/lib/auth/getCustomerUser";
import { defaultCustomerPortalSettings } from "@/types/company";

export async function GET() {
  const supabase = await createClient();
  const customerUser = await getCustomerUser(supabase);
  if (!customerUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parallel fetch: customer details, company (with settings), brand kit
  const [customerRes, companyRes, brandKitRes] = await Promise.all([
    supabase
      .from("customers")
      .select("phone, address")
      .eq("id", customerUser.customerId)
      .eq("company_id", customerUser.companyId)
      .single(),
    supabase
      .from("companies")
      .select("name, logo_url, settings")
      .eq("id", customerUser.companyId)
      .single(),
    supabase
      .from("company_brand_kits")
      .select("primary_color")
      .eq("company_id", customerUser.companyId)
      .limit(1)
      .single(),
  ]);

  const settings = companyRes.data?.settings as Record<string, unknown> | null;
  const portalSettings = settings?.customerPortal
    ? { ...defaultCustomerPortalSettings, ...(settings.customerPortal as Record<string, unknown>) }
    : defaultCustomerPortalSettings;

  return NextResponse.json({
    data: {
      customerId: customerUser.customerId,
      name: customerUser.name,
      email: customerUser.email,
      phone: customerRes.data?.phone || null,
      address: customerRes.data?.address || null,
      companyName: companyRes.data?.name || "",
      companyLogo: companyRes.data?.logo_url || null,
      primaryColor: brandKitRes.data?.primary_color || null,
      portalSettings,
    },
  }, {
    headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=120" }
  });
}
