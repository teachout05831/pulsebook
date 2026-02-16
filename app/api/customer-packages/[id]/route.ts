import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

interface RouteParams { params: Promise<{ id: string }> }

const CP_FIELDS = "id, company_id, customer_id, package_id, job_id, visits_total, visits_used, amount_paid, payment_id, auto_renew, status, purchased_at, completed_at";

function convertCustomerPackage(d: Record<string, unknown>) {
  const pkg = Array.isArray(d.service_packages) ? d.service_packages[0] : d.service_packages;
  return {
    id: d.id, companyId: d.company_id, customerId: d.customer_id,
    packageId: d.package_id, packageName: (pkg as Record<string, unknown>)?.name || "",
    jobId: d.job_id || null, visitsTotal: d.visits_total, visitsUsed: d.visits_used,
    amountPaid: d.amount_paid, paymentId: d.payment_id || null,
    autoRenew: d.auto_renew || false, status: d.status,
    purchasedAt: d.purchased_at, completedAt: d.completed_at || null,
  };
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { companyId, supabase } = await getAuthCompany();

    const { data: existing } = await supabase
      .from("customer_packages").select("company_id").eq("id", id).single();
    if (!existing) return NextResponse.json({ error: "Customer package not found" }, { status: 404 });
    if (existing.company_id !== companyId) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    const u: Record<string, unknown> = {};
    if (body.status !== undefined) u.status = body.status;
    if (body.autoRenew !== undefined) u.auto_renew = body.autoRenew;
    if (body.status === "cancelled") u.completed_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("customer_packages").update(u).eq("id", id)
      .select(`${CP_FIELDS}, service_packages(name)`).single();
    if (error) throw error;

    return NextResponse.json({ data: convertCustomerPackage(data as Record<string, unknown>) });
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.statusCode });
    return NextResponse.json({ error: "Failed to update customer package" }, { status: 500 });
  }
}
