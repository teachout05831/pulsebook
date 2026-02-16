import type { SupabaseClient } from "@supabase/supabase-js";

export interface TechSettings {
  showCustomerEmail: boolean;
  showCustomerPhone: boolean;
  showCustomerNotes: boolean;
  showContracts: boolean;
  showCrewNotes: boolean;
  showCustomerJobNotes: boolean;
  arrivalWindows?: { id: string; label: string; startTime: string; endTime: string }[];
}

const DEFAULT_SETTINGS: TechSettings = {
  showCustomerEmail: true,
  showCustomerPhone: true,
  showCustomerNotes: false,
  showContracts: true,
  showCrewNotes: true,
  showCustomerJobNotes: false,
};

export async function getTechSettings(supabase: SupabaseClient, companyId: string): Promise<TechSettings> {
  const { data: company } = await supabase
    .from("companies")
    .select("settings")
    .eq("id", companyId)
    .single();

  const techPortal = company?.settings?.techPortal || DEFAULT_SETTINGS;
  const arrivalWindows = company?.settings?.arrivalWindows || [];
  return { ...techPortal, arrivalWindows };
}

export function formatTechJob(j: any, settings: TechSettings) {
  const customer = Array.isArray(j.customers) ? j.customers[0] : j.customers;
  return {
    id: j.id,
    title: j.title,
    description: j.description,
    status: j.status,
    scheduledDate: j.scheduled_date,
    scheduledTime: j.scheduled_time,
    arrivalWindow: j.arrival_window
      ? (settings.arrivalWindows?.find((w) => w.id === j.arrival_window)?.label || j.arrival_window)
      : null,
    estimatedDuration: j.estimated_duration,
    address: j.address,
    notes: j.notes,
    crewNotes: settings.showCrewNotes ? (j.crew_notes || null) : undefined,
    crewFeedback: j.crew_feedback || null,
    customerNotes: settings.showCustomerJobNotes ? (j.customer_notes || null) : undefined,
    isCrewJob: !!j.assigned_crew_id,
    customer: {
      id: customer?.id || j.customer_id,
      name: customer?.name || "Customer",
      address: customer?.address || null,
      email: settings.showCustomerEmail ? (customer?.email || null) : undefined,
      phone: settings.showCustomerPhone ? (customer?.phone || null) : undefined,
      notes: settings.showCustomerNotes ? (customer?.notes || null) : undefined,
    },
  };
}
