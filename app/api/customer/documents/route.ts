import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCustomerUser } from "@/lib/auth/getCustomerUser";
import { getCustomerDocuments } from "@/features/customer-portal/queries/getCustomerDocuments";

const CDN_URL = process.env.BUNNY_CDN_URL || "";

export async function GET() {
  const supabase = await createClient();
  const customerUser = await getCustomerUser(supabase);
  if (!customerUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getCustomerDocuments(
      supabase,
      customerUser.customerId,
      customerUser.companyId
    );

    // snake_case → camelCase conversion here
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
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}
