export type DocumentType = "estimate_page" | "contract" | "invoice" | "work_order";

export type DocumentStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "signed"
  | "paid"
  | "void"
  | "published";

export const DOC_TYPE_LABELS: Record<DocumentType, string> = {
  estimate_page: "Estimate Page",
  contract: "Contract",
  invoice: "Invoice",
  work_order: "Work Order",
};

export const DOC_STATUS_COLORS: Record<DocumentStatus, string> = {
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  viewed: "bg-amber-100 text-amber-700",
  signed: "bg-green-100 text-green-700",
  paid: "bg-green-100 text-green-700",
  published: "bg-blue-100 text-blue-700",
  void: "bg-red-100 text-red-700",
};

export interface DocumentItem {
  id: string;
  type: DocumentType;
  name: string;
  status: DocumentStatus;
  entityType: "estimate" | "job";
  entityId: string;
  publicToken: string | null;
  createdAt: string;
}
