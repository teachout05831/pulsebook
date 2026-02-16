import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ token: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { token } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("contract_instances")
    .select("id, company_id, template_id, job_id, customer_id, status, filled_blocks, template_snapshot, signing_token, sent_at, viewed_at, signed_at, paid_at, completed_at, created_at, updated_at")
    .eq("signing_token", token)
    .neq("status", "cancelled")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Contract not found" }, { status: 404 });
  }

  if (data.status === "sent") {
    await supabase
      .from("contract_instances")
      .update({
        status: "viewed",
        viewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);
  }

  return NextResponse.json({
    data: {
      id: data.id,
      companyId: data.company_id,
      templateId: data.template_id,
      jobId: data.job_id,
      customerId: data.customer_id,
      status: data.status === "sent" ? "viewed" : data.status,
      filledBlocks: data.filled_blocks,
      templateSnapshot: data.template_snapshot,
      signingToken: data.signing_token,
      sentAt: data.sent_at,
      viewedAt: data.status === "sent" ? new Date().toISOString() : data.viewed_at,
      signedAt: data.signed_at,
      paidAt: data.paid_at,
      completedAt: data.completed_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    },
  });
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { token } = await params;
  const supabase = await createClient();

  const body = await request.json();

  if (!body.blockId) {
    return NextResponse.json({ error: "blockId is required" }, { status: 400 });
  }
  if (!body.signerRole) {
    return NextResponse.json({ error: "signerRole is required" }, { status: 400 });
  }
  if (!body.signerName) {
    return NextResponse.json({ error: "signerName is required" }, { status: 400 });
  }
  if (!body.signatureData) {
    return NextResponse.json({ error: "signatureData is required" }, { status: 400 });
  }

  const { data: instance, error: instanceError } = await supabase
    .from("contract_instances")
    .select("id")
    .eq("signing_token", token)
    .neq("status", "cancelled")
    .single();

  if (instanceError || !instance) {
    return NextResponse.json({ error: "Contract not found" }, { status: 404 });
  }

  // Use server-side headers for IP/UA instead of trusting client
  const serverIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || null;
  const serverUa = request.headers.get("user-agent") || null;

  const { error } = await supabase
    .from("contract_signatures")
    .insert({
      contract_id: instance.id,
      block_id: body.blockId,
      signer_role: body.signerRole,
      signer_name: body.signerName,
      signer_email: body.signerEmail || null,
      signature_data: body.signatureData,
      stage: body.stage || null,
      ip_address: serverIp,
      user_agent: serverUa,
      gps_latitude: body.gpsLatitude || null,
      gps_longitude: body.gpsLongitude || null,
    });

  if (error) {
    return NextResponse.json({ error: "Failed to record signature" }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
