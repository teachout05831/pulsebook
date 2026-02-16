// Column definitions for the leads table

export interface LeadsColumnDef {
  id: string;
  label: string;
  defaultVisible: boolean;
  alwaysVisible?: boolean;
}

export const LEADS_TABLE_COLUMNS: LeadsColumnDef[] = [
  { id: "id", label: "#", defaultVisible: true },
  { id: "leadStatus", label: "Lead Status", defaultVisible: true },
  { id: "name", label: "Name", defaultVisible: true, alwaysVisible: true },
  { id: "email", label: "Email", defaultVisible: false },
  { id: "phone", label: "Phone", defaultVisible: false },
  { id: "serviceType", label: "Service Type", defaultVisible: true },
  { id: "serviceDate", label: "Service Date", defaultVisible: true },
  { id: "estimatedValue", label: "Est. Value", defaultVisible: true },
  { id: "source", label: "Source", defaultVisible: true },
  { id: "address", label: "Address", defaultVisible: true },
  { id: "lastContactDate", label: "Last Contact", defaultVisible: true },
  { id: "assignedTo", label: "Assigned To", defaultVisible: false },
  { id: "tags", label: "Tags", defaultVisible: false },
  { id: "createdAt", label: "Created Date", defaultVisible: false },
  { id: "accountBalance", label: "Account Balance", defaultVisible: false },
  { id: "followUpDate", label: "Follow-up Date", defaultVisible: false },
];

export const DEFAULT_VISIBLE_COLUMNS = LEADS_TABLE_COLUMNS
  .filter((c) => c.defaultVisible)
  .map((c) => c.id);
