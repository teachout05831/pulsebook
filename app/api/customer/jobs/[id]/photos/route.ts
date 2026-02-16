import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCustomerUser } from "@/lib/auth/getCustomerUser";
import { uploadMedia } from "@/features/media/actions/uploadMedia";
import { defaultCustomerPortalSettings } from "@/types/company";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: jobId } = await params;
  const supabase = await createClient();
  const customerUser = await getCustomerUser(supabase);
  if (!customerUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if photo upload is allowed
  const { data: company } = await supabase
    .from("companies")
    .select("settings")
    .eq("id", customerUser.companyId)
    .single();

  const raw = company?.settings as Record<string, unknown> | null;
  const ps = raw?.customerPortal
    ? { ...defaultCustomerPortalSettings, ...(raw.customerPortal as Record<string, unknown>) }
    : defaultCustomerPortalSettings;

  if (!ps.allowPhotoUpload) {
    return NextResponse.json({ error: "Photo upload is disabled" }, { status: 403 });
  }

  // Ownership check: verify this job belongs to the customer
  const { data: job } = await supabase
    .from("jobs")
    .select("id")
    .eq("id", jobId)
    .eq("customer_id", customerUser.customerId)
    .eq("company_id", customerUser.companyId)
    .single();

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only images allowed" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadMedia({
    buffer, fileName: file.name, fileType: file.type, fileSize: file.size,
    companyId: customerUser.companyId, userId: customerUser.authUserId,
    context: "job", category: "photo", customerId: customerUser.customerId, jobId,
  });

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ data: result.data }, { status: 201 });
}
