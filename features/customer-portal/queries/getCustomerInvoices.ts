import type { SupabaseClient } from "@supabase/supabase-js";

export async function getCustomerInvoices(
  supabase: SupabaseClient,
  customerId: string,
  companyId: string
) {
  const { data, error } = await supabase
    .from("invoices")
    .select(
      "id, invoice_number, status, total, amount_paid, balance_due, due_date, created_at"
    )
    .eq("customer_id", customerId)
    .eq("company_id", companyId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return data;
}
