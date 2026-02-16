import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    const { data, error } = await supabase
      .from("contract_instances")
      .select("id, company_id, template_id, job_id, customer_id, status, filled_blocks, template_snapshot, signing_token, sent_at, viewed_at, signed_at, paid_at, completed_at, created_at, updated_at")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Contract instance not found" }, { status: 404 });
    }

    if (data.company_id !== companyId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    return NextResponse.json({
      data: {
        id: data.id,
        companyId: data.company_id,
        templateId: data.template_id,
        jobId: data.job_id,
        customerId: data.customer_id,
        status: data.status,
        filledBlocks: data.filled_blocks,
        templateSnapshot: data.template_snapshot,
        signingToken: data.signing_token,
        sentAt: data.sent_at,
        viewedAt: data.viewed_at,
        signedAt: data.signed_at,
        paidAt: data.paid_at,
        completedAt: data.completed_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    }, {
      headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=60" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    const { data: existing } = await supabase
      .from("contract_instances")
      .select("company_id, status")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Contract instance not found" }, { status: 404 });
    }
    if (existing.company_id !== companyId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await request.json();
    const updates: Record<string, unknown> = {};

    if (body.status !== undefined) {
      updates.status = body.status;

      if (body.status === "sent" && existing.status !== "sent") {
        updates.sent_at = new Date().toISOString();
      }
      if (body.status === "viewed" && existing.status !== "viewed") {
        updates.viewed_at = new Date().toISOString();
      }
      if (body.status === "signed" && existing.status !== "signed") {
        updates.signed_at = new Date().toISOString();
      }
      if (body.status === "paid" && existing.status !== "paid") {
        updates.paid_at = new Date().toISOString();
      }
      if (body.status === "completed" && existing.status !== "completed") {
        updates.completed_at = new Date().toISOString();
      }
    }

    if (body.filledBlocks !== undefined) {
      updates.filled_blocks = body.filledBlocks;
    }

    updates.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from("contract_instances")
      .update(updates)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to update contract instance" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
