"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PortalPreviewProvider } from "../PortalPreviewContext";
import { PreviewBanner } from "./PreviewBanner";
import { PreviewSidebar } from "./PreviewSidebar";
import { PortalDashboard } from "@/features/customer-portal/components/PortalDashboard";
import { EstimatesList } from "@/features/customer-portal/components/EstimatesList";
import { JobsList } from "@/features/customer-portal/components/JobsList";
import { JobDetail } from "@/features/customer-portal/components/JobDetail";
import { InvoicesList } from "@/features/customer-portal/components/InvoicesList";
import { ContractsList } from "@/features/customer-portal/components/ContractsList";
import { AppointmentsList } from "@/features/customer-portal/components/AppointmentsList";
import { DocumentsList } from "@/features/customer-portal/components/DocumentsList";
import { AccountSettings } from "@/features/customer-portal/components/AccountSettings";
import { useCustomerProfile } from "@/features/customer-portal/hooks/useCustomerProfile";
import { defaultCustomerPortalSettings } from "@/types/company";
import type { PreviewTab } from "../types";

interface Props {
  customerId: string;
  customerName: string;
}

function PreviewContent({ customerId, customerName }: Props) {
  const router = useRouter();
  const { profile } = useCustomerProfile();
  const [activeTab, setActiveTab] = useState<PreviewTab>("dashboard");
  const [jobDetailId, setJobDetailId] = useState<string | null>(null);

  const settings = profile?.portalSettings ?? defaultCustomerPortalSettings;

  const handleTabChange = useCallback((tab: PreviewTab) => {
    setActiveTab(tab);
    setJobDetailId(null);
  }, []);

  const handleClose = useCallback(() => {
    router.push(`/customers/${customerId}`);
  }, [router, customerId]);

  // Intercept clicks on /portal/* links and convert to tab navigation
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/portal")) return;

      e.preventDefault();
      e.stopPropagation();

      // Parse the portal path to determine tab
      const path = href.replace("/portal", "").replace(/^\//, "");

      if (!path || path === "") {
        handleTabChange("dashboard");
      } else if (path.startsWith("jobs/")) {
        const id = path.replace("jobs/", "");
        setActiveTab("job-detail");
        setJobDetailId(id);
      } else {
        const tabMap: Record<string, PreviewTab> = {
          estimates: "estimates",
          jobs: "jobs",
          invoices: "invoices",
          contracts: "contracts",
          appointments: "appointments",
          documents: "documents",
          account: "account",
        };
        const tab = tabMap[path];
        if (tab) handleTabChange(tab);
      }
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [handleTabChange]);

  function renderContent() {
    switch (activeTab) {
      case "dashboard":
        return <PortalDashboard />;
      case "estimates":
        return <EstimatesList />;
      case "jobs":
        return <JobsList />;
      case "job-detail":
        return jobDetailId ? (
          <JobDetail
            jobId={jobDetailId}
            showPhotos={settings.showPhotos}
            showNotes={settings.showNotes}
            showCrewName={settings.showCrewName}
            allowPhotoUpload={false}
          />
        ) : (
          <JobsList />
        );
      case "invoices":
        return <InvoicesList />;
      case "contracts":
        return <ContractsList />;
      case "appointments":
        return <AppointmentsList />;
      case "documents":
        return <DocumentsList />;
      case "account":
        return <AccountSettings />;
      default:
        return <PortalDashboard />;
    }
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <PreviewBanner customerName={customerName} onClose={handleClose} />
      <div className="flex flex-1 overflow-hidden">
        <PreviewSidebar
          profile={profile}
          activeTab={activeTab === "job-detail" ? "jobs" : activeTab}
          onTabChange={handleTabChange}
        />
        <main className="flex-1 overflow-y-auto px-6 py-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export function PortalPreviewClient({ customerId, customerName }: Props) {
  return (
    <PortalPreviewProvider customerId={customerId}>
      <PreviewContent customerId={customerId} customerName={customerName} />
    </PortalPreviewProvider>
  );
}
