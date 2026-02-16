import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import { getCustomerContracts } from "@/features/customer-portal/queries/getCustomerContracts";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    const { customerId } = await params;
    const { supabase, companyId } = await getAuthCompany();

    const { data: customer } = await supabase
      .from("customers")
      .select("id")
      .eq("id", customerId)
      .eq("company_id", companyId)
      .single();

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const data = await getCustomerContracts(supabase, customerId, companyId);

    const contracts = (data || []).map((c: Record<string, unknown>) => {
      const template = c.contract_templates as { name: string } | null;
      return {
        id: c.id,
        templateName: template?.name || null,
        status: c.status,
        createdAt: c.created_at,
        signedAt: c.signed_at || null,
        signingToken: c.signing_token || null,
      };
    });

    return NextResponse.json({ data: contracts }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    }
    return NextResponse.json({ error: "Failed to fetch contracts" }, { status: 500 });
  }
}
