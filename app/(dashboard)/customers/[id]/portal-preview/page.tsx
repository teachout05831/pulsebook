import { getAuthCompany } from "@/lib/auth/getAuthCompany";
import { redirect } from "next/navigation";
import { PortalPreviewClient } from "@/features/portal-preview";

export default async function PortalPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let customerName = "Customer";
  try {
    const { supabase, companyId } = await getAuthCompany();
    const { data } = await supabase
      .from("customers")
      .select("name")
      .eq("id", id)
      .eq("company_id", companyId)
      .single();

    if (!data) redirect(`/customers/${id}`);
    customerName = data.name;
  } catch {
    redirect("/customers");
  }

  return <PortalPreviewClient customerId={id} customerName={customerName} />;
}
