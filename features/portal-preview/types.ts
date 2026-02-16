export type PreviewTab =
  | "dashboard"
  | "estimates"
  | "jobs"
  | "job-detail"
  | "invoices"
  | "contracts"
  | "appointments"
  | "documents"
  | "account";

export interface PortalPreviewProps {
  customerId: string;
  customerName: string;
}
