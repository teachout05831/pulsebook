import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import { calculateCcFee } from "@/features/payments/utils/calculateCcFee";
import { logActivity } from "@/features/activity/utils/logActivity";

const PAYMENT_FIELDS = "id, company_id, customer_id, estimate_id, job_id, amount, method, status, reference_number, cc_fee_amount, cc_fee_rate, notes, received_by, payment_date, created_at";
const ALLOWED_METHODS = new Set(["cash", "check", "card", "bank_transfer", "other"]);

function convertPayment(d: Record<string, unknown>) {
  return {
    id: d.id, companyId: d.company_id, customerId: d.customer_id,
    estimateId: d.estimate_id || null, jobId: d.job_id || null,
    amount: d.amount, method: d.method, status: d.status,
    referenceNumber: d.reference_number || null,
    ccFeeAmount: d.cc_fee_amount || 0, ccFeeRate: d.cc_fee_rate || 0,
    notes: d.notes || null, receivedBy: d.received_by || null,
    paymentDate: d.payment_date, createdAt: d.created_at,
  };
}

export async function GET(req: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();
    const { searchParams } = new URL(req.url);
    const estimateId = searchParams.get("estimateId");
    const jobId = searchParams.get("jobId");

    let query = supabase.from("payments").select(PAYMENT_FIELDS).eq("company_id", companyId);
    if (estimateId) query = query.eq("estimate_id", estimateId);
    else if (jobId) query = query.eq("job_id", jobId);
    else return NextResponse.json({ error: "estimateId or jobId required" }, { status: 400 });

    const { data, error } = await query.order("created_at", { ascending: false }).limit(50);
    if (error) throw error;

    return NextResponse.json({ data: (data || []).map((d) => convertPayment(d as Record<string, unknown>)) }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.statusCode });
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { companyId, user, supabase } = await getAuthCompany();
    const body = await req.json();

    const { entityType, entityId, amount, method, paymentDate, referenceNumber, notes } = body;
    if (!entityType || !entityId) return NextResponse.json({ error: "entityType and entityId required" }, { status: 400 });
    if (!amount || amount <= 0) return NextResponse.json({ error: "Amount must be positive" }, { status: 400 });
    if (!method || !ALLOWED_METHODS.has(method)) return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    if (!paymentDate) return NextResponse.json({ error: "Payment date required" }, { status: 400 });

    const table = entityType === "estimate" ? "estimates" : "jobs";
    const fk = entityType === "estimate" ? "estimate_id" : "job_id";

    const { data: entity } = await supabase
      .from(table).select("id, company_id, customer_id, deposit_paid").eq("id", entityId).limit(1).single();
    if (!entity) return NextResponse.json({ error: "Entity not found" }, { status: 404 });
    if ((entity as Record<string, unknown>).company_id !== companyId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const ccFee = method === "card" ? calculateCcFee(amount) : { ccFeeAmount: 0, ccFeeRate: 0 };

    const { data: profile } = await supabase.from("users").select("full_name").eq("id", user.id).limit(1).single();
    const receivedBy = (profile as Record<string, unknown>)?.full_name || "Admin";

    const insertData: Record<string, unknown> = {
      company_id: companyId,
      customer_id: (entity as Record<string, unknown>).customer_id,
      [fk]: entityId,
      amount,
      method,
      status: "completed",
      reference_number: referenceNumber || null,
      cc_fee_amount: ccFee.ccFeeAmount,
      cc_fee_rate: ccFee.ccFeeRate,
      notes: notes || null,
      received_by: receivedBy,
      payment_date: paymentDate,
    };

    const { data: payment, error: insertError } = await supabase
      .from("payments").insert(insertData).select(PAYMENT_FIELDS).single();
    if (insertError) throw insertError;

    const currentPaid = ((entity as Record<string, unknown>).deposit_paid as number) || 0;
    const newDepositPaid = Math.round((currentPaid + amount) * 100) / 100;

    await supabase.from(table).update({ deposit_paid: newDepositPaid }).eq("id", entityId);

    // Get customer name for feed display
    const customerId = (entity as Record<string, unknown>).customer_id as string || null;
    let customerName: string | null = null;
    if (customerId) {
      const { data: cust } = await supabase.from("customers").select("name").eq("id", customerId).limit(1).single();
      customerName = (cust as Record<string, unknown>)?.name as string || null;
    }

    // Log activity on parent entity (fire-and-forget)
    const fmtAmount = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
    logActivity(supabase, {
      companyId, entityType: entityType as "estimate" | "job", entityId,
      action: "payment_received",
      description: `Payment of <strong>${fmtAmount}</strong> received (${method})`,
      metadata: { amount, method },
      performedBy: user.id, performedByName: receivedBy as string,
      customerId, customerName, amount,
    });

    return NextResponse.json({
      data: { payment: convertPayment(payment as Record<string, unknown>), newDepositPaid },
    });
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.statusCode });
    console.error("Error recording payment:", e);
    return NextResponse.json({ error: "Failed to record payment" }, { status: 500 });
  }
}
