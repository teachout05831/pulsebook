import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import { getCustomerEstimates } from "@/features/customer-portal/queries/getCustomerEstimates";

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

    const data = await getCustomerEstimates(supabase, customerId, companyId);

    const estimates = (data || []).map((est: Record<string, unknown>) => {
      const pages = est.estimate_pages as
        | { public_token: string }[]
        | { public_token: string }
        | null;
      const token = Array.isArray(pages)
        ? pages[0]?.public_token
        : (pages as { public_token: string } | null)?.public_token;

      return {
        id: est.id,
        estimateNumber: est.estimate_number,
        status: est.status,
        total: est.total,
        createdAt: est.created_at,
        publicToken: token || null,
      };
    });

    return NextResponse.json({ data: estimates }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    }
    return NextResponse.json({ error: "Failed to fetch estimates" }, { status: 500 });
  }
}
