import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import { getCustomerDocuments } from "@/features/customer-portal/queries/getCustomerDocuments";

const CDN_URL = process.env.BUNNY_CDN_URL || "";

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

    const data = await getCustomerDocuments(supabase, customerId, companyId);

    const documents = (data || []).map((doc: Record<string, unknown>) => ({
      id: doc.id,
      fileName: doc.file_name,
      fileType: doc.file_type || null,
      category: doc.category || null,
      url: doc.storage_path ? `${CDN_URL}/${doc.storage_path}` : null,
      createdAt: doc.created_at,
    }));

    return NextResponse.json({ data: documents }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    }
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}
