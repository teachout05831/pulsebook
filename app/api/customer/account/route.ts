import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCustomerUser } from "@/lib/auth/getCustomerUser";
import { updateCustomerProfile } from "@/features/customer-portal/actions/updateCustomerProfile";

export async function GET() {
  const supabase = await createClient();
  const customerUser = await getCustomerUser(supabase);
  if (!customerUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from("customers")
      .select("id, name, email, phone, address, city, state, zip_code")
      .eq("id", customerUser.customerId)
      .eq("company_id", customerUser.companyId)
      .single();

    if (error) throw error;

    // snake_case → camelCase conversion here
    return NextResponse.json({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        zipCode: data.zip_code || null,
      },
    }, {
      headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=60" }
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch account" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const customerUser = await getCustomerUser(supabase);
  if (!customerUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = await updateCustomerProfile(body);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update account" },
      { status: 500 }
    );
  }
}
