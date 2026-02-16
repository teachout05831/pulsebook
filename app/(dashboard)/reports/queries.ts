import { getAuthCompany } from "@/lib/auth/getAuthCompany";
import type { Job, Invoice, Customer } from "@/types";

interface ReportsData {
  jobs: Job[];
  invoices: Invoice[];
  customers: Customer[];
}

export async function getReportsData(): Promise<ReportsData> {
  const { companyId, supabase } = await getAuthCompany();

  // Fetch all data in parallel for speed
  const [jobsResult, invoicesResult, customersResult] = await Promise.all([
    supabase
      .from("jobs")
      .select("id, customer_id, title, status, scheduled_date, created_at")
      .eq("company_id", companyId)
      .order("scheduled_date", { ascending: false })
      .limit(500),
    supabase
      .from("invoices")
      .select("id, customer_id, status, issue_date, total, amount_paid")
      .eq("company_id", companyId)
      .order("issue_date", { ascending: false })
      .limit(500),
    supabase
      .from("customers")
      .select("id, name")
      .eq("company_id", companyId)
      .limit(500),
  ]);

  // Transform to camelCase
  const jobs: Job[] = (jobsResult.data || []).map((j) => ({
    id: j.id,
    customerId: j.customer_id,
    title: j.title,
    status: j.status,
    scheduledDate: j.scheduled_date,
    createdAt: j.created_at,
  })) as Job[];

  const invoices: Invoice[] = (invoicesResult.data || []).map((inv) => ({
    id: inv.id,
    customerId: inv.customer_id,
    status: inv.status,
    issueDate: inv.issue_date,
    total: inv.total,
    amountPaid: inv.amount_paid,
  })) as Invoice[];

  const customers: Customer[] = (customersResult.data || []).map((c) => ({
    id: c.id,
    name: c.name,
  })) as Customer[];

  return { jobs, invoices, customers };
}
