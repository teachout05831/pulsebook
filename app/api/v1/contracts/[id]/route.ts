import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/api-auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  return withApiAuth(request, async ({ companyId, supabase }) => {
    const { data, error } = await supabase
      .from("contract_instances")
      .select("id, template_id, job_id, customer_id, status, filled_blocks, signing_token, sent_at, viewed_at, signed_at, paid_at, completed_at, created_at, updated_at")
      .eq("id", id)
      .eq("company_id", companyId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        id: data.id, templateId: data.template_id,
        jobId: data.job_id, customerId: data.customer_id,
        status: data.status, filledBlocks: data.filled_blocks,
        signingToken: data.signing_token,
        sentAt: data.sent_at, viewedAt: data.viewed_at,
        signedAt: data.signed_at, paidAt: data.paid_at,
        completedAt: data.completed_at,
        createdAt: data.created_at, updatedAt: data.updated_at,
      },
    }, {
      headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=60" }
    });
  });
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  return withApiAuth(request, async ({ companyId, supabase }) => {
    const body = await request.json();

    const updateData: Record<string, unknown> = {};
    if (body.status !== undefined) updateData.status = body.status;
    if (body.filledBlocks !== undefined) updateData.filled_blocks = body.filledBlocks;

    const { data, error } = await supabase
      .from("contract_instances")
      .update(updateData)
      .eq("id", id)
      .eq("company_id", companyId)
      .select("id, template_id, job_id, customer_id, status, signing_token, sent_at, viewed_at, signed_at, paid_at, completed_at, created_at, updated_at")
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        id: data.id, templateId: data.template_id,
        jobId: data.job_id, customerId: data.customer_id,
        status: data.status, signingToken: data.signing_token,
        sentAt: data.sent_at, viewedAt: data.viewed_at,
        signedAt: data.signed_at, paidAt: data.paid_at,
        completedAt: data.completed_at,
        createdAt: data.created_at, updatedAt: data.updated_at,
      },
    });
  });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  return withApiAuth(request, async ({ companyId, supabase }) => {
    const { data: existing } = await supabase
      .from("contract_instances")
      .select("id")
      .eq("id", id)
      .eq("company_id", companyId)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }

    const { error } = await supabase
      .from("contract_instances")
      .delete()
      .eq("id", id)
      .eq("company_id", companyId);

    if (error) {
      return NextResponse.json({ error: "Failed to delete contract" }, { status: 500 });
    }

    return NextResponse.json({ data: { id, deleted: true } });
  });
}
