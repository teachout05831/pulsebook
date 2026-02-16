"use client";

import { use } from "react";
import { JobDetail } from "@/features/customer-portal/components/JobDetail";
import { useCustomerProfile } from "@/features/customer-portal/hooks/useCustomerProfile";
import { defaultCustomerPortalSettings } from "@/types/company";

export default function CustomerJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { profile } = useCustomerProfile();

  const settings = profile?.portalSettings ?? defaultCustomerPortalSettings;

  return (
    <JobDetail
      jobId={id}
      showPhotos={settings.showPhotos}
      showNotes={settings.showNotes}
      showCrewName={settings.showCrewName}
      allowPhotoUpload={settings.allowPhotoUpload}
    />
  );
}
