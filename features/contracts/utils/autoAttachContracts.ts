import type { SupabaseClient } from "@supabase/supabase-js";

interface AutoAttachInput {
  companyId: string;
  entityType: "estimate" | "job";
  entityId: string;
  customerId: string | null;
  pricingModel: string;
  userId: string;
}

export async function autoAttachContracts(
  supabase: SupabaseClient,
  input: AutoAttachInput
): Promise<void> {
  try {
    if (!input.customerId) return;

    const { data: templates } = await supabase
      .from("contract_templates")
      .select("id, blocks, applies_to")
      .eq("company_id", input.companyId)
      .eq("is_active", true)
      .eq("attachment_mode", "auto")
      .limit(10);

    if (!templates || templates.length === 0) return;

    const matching = templates.filter(
      (t) =>
        !t.applies_to ||
        t.applies_to.length === 0 ||
        t.applies_to.includes(input.pricingModel)
    );

    for (const tmpl of matching) {
      const signingToken = crypto.randomUUID();
      await supabase.from("contract_instances").insert({
        company_id: input.companyId,
        template_id: tmpl.id,
        job_id: input.entityId,
        customer_id: input.customerId,
        filled_blocks: tmpl.blocks || [],
        template_snapshot: tmpl,
        signing_token: signingToken,
        created_by: input.userId,
      });
    }
  } catch (err) {
    console.error("Auto-attach contracts failed:", err);
  }
}
