export type { TerminologySettings, EntityLabel } from "@/types/company";
export { defaultTerminologySettings } from "@/types/company";

export type TerminologyEntity = "estimate" | "job" | "customer" | "invoice" | "contract" | "estimatePage";

export const TERMINOLOGY_ENTITIES: {
  key: TerminologyEntity;
  defaultSingular: string;
  defaultPlural: string;
  suggestions: string[];
}[] = [
  { key: "estimate", defaultSingular: "Estimate", defaultPlural: "Estimates", suggestions: ["Quote", "Proposal", "Bid"] },
  { key: "job", defaultSingular: "Job", defaultPlural: "Jobs", suggestions: ["Work Order", "Task", "Service Call"] },
  { key: "customer", defaultSingular: "Customer", defaultPlural: "Customers", suggestions: ["Client", "Account", "Contact"] },
  { key: "invoice", defaultSingular: "Invoice", defaultPlural: "Invoices", suggestions: ["Bill", "Statement"] },
  { key: "contract", defaultSingular: "Contract", defaultPlural: "Contracts", suggestions: ["Agreement", "Service Agreement"] },
  { key: "estimatePage", defaultSingular: "Estimate Page", defaultPlural: "Estimate Pages", suggestions: ["Proposal Page", "Quote Page"] },
];
