import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import { calculateCcFee } from "@/features/payments/utils/calculateCcFee";

const CP_FIELDS = "id, company_id, customer_id, package_id, job_id, visits_total, visits_used, amount_paid, payment_id, auto_renew, status, purchased_at, completed_at";
const ALLOWED_METHODS = new Set(["cash", "check", "card", "bank_transfer", "other"]);

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

export async function GET(req: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");
    const status = searchParams.get("status");

    if (!customerId) return NextResponse.json({ error: "customerId required" }, { status: 400 });

    let query = supabase
      .from("customer_packages")
      .select(`${CP_FIELDS}, service_packages(name)`)
      .eq("company_id", companyId)
      .eq("customer_id", customerId);

    if (status) query = query.eq("status", status);

    const { data, error } = await query.order("purchased_at", { ascending: false }).limit(20);
    if (error) throw error;

    return NextResponse.json({ data: (data || []).map((d) => convertCustomerPackage(d as Record<string, unknown>)) }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.statusCode });
    return NextResponse.json({ error: "Failed to fetch customer packages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { companyId, user, supabase } = await getAuthCompany();
    const body = await req.json();

    const { customerId, packageId, paymentMethod, paymentDate, autoRenew, referenceNumber, notes } = body;
    if (!customerId || !packageId) return NextResponse.json({ error: "customerId and packageId required" }, { status: 400 });
    if (!paymentMethod || !ALLOWED_METHODS.has(paymentMethod)) return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    if (!paymentDate) return NextResponse.json({ error: "Payment date required" }, { status: 400 });

    // Verify customer ownership
    const { data: customer } = await supabase.from("customers").select("id, company_id").eq("id", customerId).limit(1).single();
    if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    if (customer.company_id !== companyId) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    // Fetch package template
    const { data: pkg } = await supabase
      .from("service_packages").select("id, company_id, name, visit_count, total_price")
      .eq("id", packageId).limit(1).single();
    if (!pkg) return NextResponse.json({ error: "Package not found" }, { status: 404 });
    if (pkg.company_id !== companyId) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    const ccFee = paymentMethod === "card" ? calculateCcFee(pkg.total_price) : { ccFeeAmount: 0, ccFeeRate: 0 };

    // Get user name for received_by
    const { data: profile } = await supabase.from("users").select("full_name").eq("id", user.id).limit(1).single();
    const receivedBy = (profile as Record<string, unknown>)?.full_name || "Admin";

    // Create payment record
    const { data: payment, error: payErr } = await supabase.from("payments").insert({
      company_id: companyId, customer_id: customerId,
      amount: pkg.total_price, method: paymentMethod, status: "completed",
      reference_number: referenceNumber || null, notes: notes || null,
      cc_fee_amount: ccFee.ccFeeAmount, cc_fee_rate: ccFee.ccFeeRate,
      received_by: receivedBy, payment_date: paymentDate,
    }).select("id").single();
    if (payErr) throw payErr;

    // Create customer package record
    const { data: cp, error: cpErr } = await supabase.from("customer_packages").insert({
      company_id: companyId, customer_id: customerId, package_id: packageId,
      visits_total: pkg.visit_count, amount_paid: pkg.total_price,
      payment_id: payment.id, auto_renew: autoRenew || false, status: "active",
    }).select(`${CP_FIELDS}, service_packages(name)`).single();
    if (cpErr) throw cpErr;

    return NextResponse.json({ data: { customerPackage: convertCustomerPackage(cp as Record<string, unknown>) } });
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.statusCode });
    console.error("Error purchasing package:", e);
    return NextResponse.json({ error: "Failed to purchase package" }, { status: 500 });
  }
}
