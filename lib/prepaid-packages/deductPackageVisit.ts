import type { SupabaseClient } from "@supabase/supabase-js";

interface DeductResult {
  deducted: boolean;
  visitsUsed?: number;
  visitsTotal?: number;
  renewed?: boolean;
}

export async function deductPackageVisit(
  supabase: SupabaseClient,
  companyId: string,
  customerId: string,
  jobId: string
): Promise<DeductResult> {
  // Find oldest active customer_package for this customer (FIFO)
  const { data: pkg } = await supabase
    .from("customer_packages")
    .select("id, visits_total, visits_used, auto_renew, package_id")
    .eq("customer_id", customerId)
    .eq("company_id", companyId)
    .eq("status", "active")
    .order("purchased_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!pkg) return { deducted: false };

  // Increment visits_used
  const newUsed = pkg.visits_used + 1;
  const isComplete = newUsed >= pkg.visits_total;

  await supabase
    .from("customer_packages")
    .update({
      visits_used: newUsed,
      job_id: jobId,
      ...(isComplete ? { status: "completed", completed_at: new Date().toISOString() } : {}),
    })
    .eq("id", pkg.id);

  let renewed = false;

  // Auto-renew if package is complete and auto_renew is enabled
  if (isComplete && pkg.auto_renew) {
    const { data: template } = await supabase
      .from("service_packages")
      .select("id, visit_count, total_price")
      .eq("id", pkg.package_id)
      .single();

    if (template) {
      await supabase.from("customer_packages").insert({
        company_id: companyId,
        customer_id: customerId,
        package_id: template.id,
        visits_total: template.visit_count,
        amount_paid: template.total_price,
        auto_renew: true,
        status: "active",
      });
      renewed = true;
    }
  }

  return { deducted: true, visitsUsed: newUsed, visitsTotal: pkg.visits_total, renewed };
}
