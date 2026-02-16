import { Eye, Send, CheckCircle, Clock, Ban, Flag } from "lucide-react";
import type { ContractStatus } from "../types";

export const STATUS_CONFIG: Record<ContractStatus, { label: string; class: string; icon: React.ReactNode }> = {
  draft: { label: "Draft", class: "bg-gray-100 text-gray-700", icon: <Clock className="h-3 w-3 mr-1" /> },
  sent: { label: "Sent", class: "bg-blue-100 text-blue-700", icon: <Send className="h-3 w-3 mr-1" /> },
  viewed: { label: "Viewed", class: "bg-yellow-100 text-yellow-700", icon: <Eye className="h-3 w-3 mr-1" /> },
  signed: { label: "Signed", class: "bg-green-100 text-green-700", icon: <CheckCircle className="h-3 w-3 mr-1" /> },
  paid: { label: "Paid", class: "bg-emerald-100 text-emerald-700", icon: <CheckCircle className="h-3 w-3 mr-1" /> },
  completed: { label: "Completed", class: "bg-purple-100 text-purple-700", icon: <Flag className="h-3 w-3 mr-1" /> },
  cancelled: { label: "Cancelled", class: "bg-red-100 text-red-700", icon: <Ban className="h-3 w-3 mr-1" /> },
};

export function formatContractDate(d: string | null) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
