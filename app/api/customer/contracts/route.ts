import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCustomerUser } from "@/lib/auth/getCustomerUser";
import { getCustomerContracts } from "@/features/customer-portal/queries/getCustomerContracts";

export async function GET() {
  const supabase = await createClient();
  const customerUser = await getCustomerUser(supabase);
  if (!customerUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getCustomerContracts(
      supabase,
      customerUser.customerId,
      customerUser.companyId
    );

    // snake_case → camelCase conversion here
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
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch contracts" },
      { status: 500 }
    );
  }
}
