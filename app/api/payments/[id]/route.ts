import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { companyId, supabase } = await getAuthCompany();
    const { id } = await params;
    const body = await req.json();

    if (body.status !== "voided") {
      return NextResponse.json({ error: "Only void operation is supported" }, { status: 400 });
    }

    const { data: payment } = await supabase
      .from("payments")
      .select("id, company_id, estimate_id, job_id, amount, status")
      .eq("id", id)
      .limit(1)
      .single();

    if (!payment) return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    if ((payment as Record<string, unknown>).company_id !== companyId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }
    if ((payment as Record<string, unknown>).status !== "completed") {
      return NextResponse.json({ error: "Only completed payments can be voided" }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from("payments").update({ status: "voided" }).eq("id", id);
    if (updateError) throw updateError;

    const entityType = (payment as Record<string, unknown>).estimate_id ? "estimate" : "job";
    const table = entityType === "estimate" ? "estimates" : "jobs";
    const entityId = ((payment as Record<string, unknown>).estimate_id || (payment as Record<string, unknown>).job_id) as string;
    const amount = (payment as Record<string, unknown>).amount as number;

    const { data: entity } = await supabase
      .from(table).select("deposit_paid").eq("id", entityId).limit(1).single();

    const currentPaid = ((entity as Record<string, unknown>)?.deposit_paid as number) || 0;
    const newDepositPaid = Math.max(0, Math.round((currentPaid - amount) * 100) / 100);

    await supabase.from(table).update({ deposit_paid: newDepositPaid }).eq("id", entityId);

    return NextResponse.json({
      data: { payment: { id, status: "voided" }, newDepositPaid },
    });
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.statusCode });
    console.error("Error voiding payment:", e);
    return NextResponse.json({ error: "Failed to void payment" }, { status: 500 });
  }
}
