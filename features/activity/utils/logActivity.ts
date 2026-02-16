import type { SupabaseClient } from "@supabase/supabase-js";
import type { ActivityEntityType, ActivityCategory } from "../types";

interface LogActivityInput {
  companyId: string;
  entityType: ActivityEntityType;
  entityId: string;
  action: string;
  description: string;
  metadata?: Record<string, unknown>;
  performedBy?: string | null;
  performedByName?: string | null;
  customerId?: string | null;
  customerName?: string | null;
  category?: ActivityCategory;
  amount?: number | null;
}

export async function logActivity(
  supabase: SupabaseClient,
  input: LogActivityInput
): Promise<void> {
  try {
    await supabase.from("activity_log").insert({
      company_id: input.companyId,
      entity_type: input.entityType,
      entity_id: input.entityId,
      action: input.action,
      description: input.description,
      metadata: input.metadata || null,
      performed_by: input.performedBy || null,
      performed_by_name: input.performedByName || null,
      customer_id: input.customerId || null,
      customer_name: input.customerName || null,
      category: input.category || "system",
      amount: input.amount || null,
    });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}
