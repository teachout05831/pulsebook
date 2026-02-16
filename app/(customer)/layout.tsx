"use client";

import { PortalSidebar, PortalBottomNav } from "@/features/customer-portal";
import { useCustomerProfile } from "@/features/customer-portal/hooks/useCustomerProfile";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = useCustomerProfile();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <PortalSidebar profile={profile} />
      <main className="flex-1 overflow-y-auto px-4 py-4 pb-20 md:px-6 md:py-6 md:pb-6">
        {children}
      </main>
      <PortalBottomNav />
    </div>
  );
}
