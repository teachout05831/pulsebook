export type ActivityEntityType = "estimate" | "job" | "customer" | "payment";

export type ActivityAction =
  | "status_changed"
  | "updated"
  | "payment_received"
  | "created"
  | "scheduled"
  | "sent"
  | "completed"
  | "call"
  | "text"
  | "email"
  | "meeting"
  | "note";

export type ActivityCategory = "system" | "manual";

export interface ActivityEntry {
  id: string;
  entityType: ActivityEntityType;
  entityId: string;
  action: ActivityAction;
  description: string;
  metadata: Record<string, unknown> | null;
  performedBy: string | null;
  performedByName: string | null;
  customerId: string | null;
  customerName: string | null;
  category: ActivityCategory;
  amount: number | null;
  createdAt: string;
}

export const ACTION_DOT_COLORS: Record<string, string> = {
  created: "bg-blue-500",
  status_changed: "bg-amber-500",
  updated: "bg-slate-400",
  payment_received: "bg-green-500",
  scheduled: "bg-green-500",
  sent: "bg-purple-500",
  completed: "bg-emerald-500",
  call: "bg-indigo-500",
  text: "bg-cyan-500",
  email: "bg-purple-500",
  meeting: "bg-orange-500",
  note: "bg-slate-400",
};
