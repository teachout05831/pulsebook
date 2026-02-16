export type { DropdownOption, CustomDropdowns } from "@/types/company";
export { defaultCustomDropdowns } from "@/types/company";

export type DropdownCategory = "serviceTypes" | "sources" | "leadStatuses";

export const DROPDOWN_CATEGORIES: {
  key: DropdownCategory;
  label: string;
  description: string;
}[] = [
  { key: "serviceTypes", label: "Service Types", description: "Types of services your company offers" },
  { key: "sources", label: "Sources", description: "How customers find your company" },
  { key: "leadStatuses", label: "Lead Statuses", description: "Stages of your sales pipeline" },
];
