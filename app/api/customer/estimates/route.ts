import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCustomerUser } from "@/lib/auth/getCustomerUser";
import { getCustomerEstimates } from "@/features/customer-portal/queries/getCustomerEstimates";

export async function GET() {
  const supabase = await createClient();
  const customerUser = await getCustomerUser(supabase);
  if (!customerUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getCustomerEstimates(
      supabase,
      customerUser.customerId,
      customerUser.companyId
    );

    // snake_case → camelCase conversion here
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
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch estimates" },
      { status: 500 }
    );
  }
}
