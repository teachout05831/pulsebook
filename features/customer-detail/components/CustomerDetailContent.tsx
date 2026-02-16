"use client";

import { Loader2 } from "lucide-react";
import {
  OverviewTab,
  SalesTab,
  EstimatesTab,
  JobsTab,
  InvoicesTab,
  FilesTab,
  NotesTab,
} from "./tabs";
import type { CustomerTab, CustomerStats } from "../types";
import type { Job } from "@/types/job";
import type { Estimate } from "@/types/estimate";
import type { Invoice } from "@/types/invoice";
import type { Customer } from "@/types/customer";

interface CustomerDetailContentProps {
  activeTab: CustomerTab;
  customer: Customer;
  customerId: string;
  stats: CustomerStats;
  upcomingJobs: Job[];
  jobs: Job[];
  estimates: Estimate[];
  invoices: Invoice[];
  tabsLoading: Record<string, boolean>;
  refetchCustomer: () => void;
  refetchJobs: () => void;
  refetchEstimates: () => void;
  refetchInvoices: () => void;
}

function TabLoader() {
  return (
    <div className="flex h-48 items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

export function CustomerDetailContent({
  activeTab, customer, customerId, stats, upcomingJobs,
  jobs, estimates, invoices, tabsLoading,
  refetchCustomer, refetchJobs, refetchEstimates, refetchInvoices,
}: CustomerDetailContentProps) {
  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 bg-gray-50">
      {activeTab === "overview" && (
        <OverviewTab
          stats={stats}
          upcomingJobs={upcomingJobs}
          customerPhone={customer.phone}
          customerEmail={customer.email}
          customFields={customer.customFields}
          isLoadingJobs={tabsLoading.jobs}
        />
      )}
      {activeTab === "sales" && (
        <SalesTab
          customer={customer}
          customerId={customerId}
          customerName={customer.name}
          onRefresh={refetchCustomer}
        />
      )}
      {activeTab === "estimates" && (
        tabsLoading.estimates ? <TabLoader /> : (
          <EstimatesTab
            estimates={estimates}
            customerId={customerId}
            customerName={customer.name}
            onRefresh={refetchEstimates}
          />
        )
      )}
      {activeTab === "jobs" && (
        tabsLoading.jobs ? <TabLoader /> : (
          <JobsTab
            jobs={jobs}
            customerId={customerId}
            customerName={customer.name}
            onRefresh={refetchJobs}
          />
        )
      )}
      {activeTab === "invoices" && (
        tabsLoading.invoices ? <TabLoader /> : (
          <InvoicesTab
            invoices={invoices}
            customerId={customerId}
            onRefresh={refetchInvoices}
          />
        )
      )}
      {activeTab === "files" && <FilesTab customerId={customerId} />}
      {activeTab === "notes" && <NotesTab customerId={customerId} />}
    </div>
  );
}
