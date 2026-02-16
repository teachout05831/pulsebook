"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useCustomerData } from "../hooks/useCustomerData";
import { useCustomerStats } from "../hooks/useCustomerStats";
import { useCustomerTabs } from "../hooks/useCustomerTabs";
import { CustomerHeader } from "./CustomerHeader";
import { CustomerTabs } from "./CustomerTabs";
import { CustomerDetailContent } from "./CustomerDetailContent";
import { LeadProfileView } from "./LeadProfileView";
import type { CustomerTab, CustomerDetailProps } from "../types";
import type { Job } from "@/types/job";
import { CreateConsultationModal } from "@/features/consultations/components/CreateConsultationModal";

export function CustomerDetailPage({ customerId }: CustomerDetailProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as CustomerTab) || "overview";
  const from = searchParams.get("from");
  const [activeTab, setActiveTab] = useState<CustomerTab>(initialTab);
  const [showConsultation, setShowConsultation] = useState(false);

  const { customer, isLoading, isError, refetchCustomer } = useCustomerData(customerId);
  const { stats, counts } = useCustomerStats(customerId);
  const {
    jobs, estimates, invoices, tabsLoading, loadTabData,
    refetchJobs, refetchEstimates, refetchInvoices,
  } = useCustomerTabs(customerId);

  useEffect(() => { loadTabData(activeTab); }, [activeTab, loadTabData]);

  const urlTab = searchParams.get("tab") as CustomerTab;
  useEffect(() => {
    if (urlTab && urlTab !== activeTab) setActiveTab(urlTab);
  }, [urlTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTabChange = (tab: CustomerTab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (isLoading || (!customer && !isError)) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !customer) {
    return (
      <Card><CardContent className="py-12 text-center">
        <p className="text-destructive">Failed to load customer. The customer may not exist.</p>
      </CardContent></Card>
    );
  }

  const viewMode = searchParams.get("view");
  if (customer.status === "lead" && viewMode !== "full") {
    return (
      <LeadProfileView
        customer={customer} customerId={customerId} from={from}
        estimates={estimates} tabsLoading={tabsLoading} loadTabData={loadTabData}
        counts={counts} refetchCustomer={refetchCustomer} refetchEstimates={refetchEstimates}
      />
    );
  }

  const upcomingJobs = jobs.filter(
    (j: Job) => j.status === "scheduled" || j.status === "in_progress"
  );

  return (
    <div className="flex flex-col min-h-screen">
      <CustomerHeader
        customer={{ ...customer, balanceDue: stats?.balanceDue }}
        from={from}
        onEdit={() => router.push(`/customers/${customerId}/edit`)}
        onNewJob={() => router.push(`/jobs/new?customerId=${customerId}`)}
        onConsultation={() => setShowConsultation(true)}
        onPortalAccessChange={refetchCustomer}
      />
      <CustomerTabs activeTab={activeTab} onTabChange={handleTabChange} counts={counts} />
      <CustomerDetailContent
        activeTab={activeTab} customer={customer} customerId={customerId}
        stats={stats} upcomingJobs={upcomingJobs} jobs={jobs}
        estimates={estimates} invoices={invoices} tabsLoading={tabsLoading}
        refetchCustomer={refetchCustomer} refetchJobs={refetchJobs}
        refetchEstimates={refetchEstimates} refetchInvoices={refetchInvoices}
      />
      <CreateConsultationModal
        open={showConsultation} onClose={() => setShowConsultation(false)}
        customerId={customerId} customerName={customer.name}
      />
    </div>
  );
}
