import { getReportsData } from "./queries";
import { ReportsClient } from "./ReportsClient";

export default async function ReportsPage() {
  const { jobs, invoices, customers } = await getReportsData();

  return (
    <ReportsClient
      jobs={jobs}
      invoices={invoices}
      customers={customers}
    />
  );
}
