// Column definitions for the contracts list table

export interface ContractsColumnDef {
  id: string;
  label: string;
  defaultVisible: boolean;
  alwaysVisible?: boolean;
}

export const CONTRACTS_TABLE_COLUMNS: ContractsColumnDef[] = [
  { id: "contract", label: "Contract", defaultVisible: true, alwaysVisible: true },
  { id: "customer", label: "Customer", defaultVisible: true },
  { id: "job", label: "Job", defaultVisible: true },
  { id: "status", label: "Status", defaultVisible: true },
  { id: "signedDate", label: "Signed Date", defaultVisible: true },
  { id: "created", label: "Created", defaultVisible: true },
  { id: "actions", label: "Actions", defaultVisible: true },
  { id: "templateType", label: "Template Type", defaultVisible: false },
  { id: "estimate", label: "Estimate", defaultVisible: false },
];

export const DEFAULT_CONTRACTS_COLUMNS = CONTRACTS_TABLE_COLUMNS
  .filter((c) => c.defaultVisible)
  .map((c) => c.id);
