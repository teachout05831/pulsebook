"use client";

import { createContext, useContext } from "react";

interface PortalPreviewContextValue {
  isPreview: boolean;
  apiPrefix: string;
  customerId: string | null;
}

const PortalPreviewContext = createContext<PortalPreviewContextValue>({
  isPreview: false,
  apiPrefix: "/api/customer",
  customerId: null,
});

export function PortalPreviewProvider({
  customerId,
  children,
}: {
  customerId: string;
  children: React.ReactNode;
}) {
  return (
    <PortalPreviewContext.Provider
      value={{
        isPreview: true,
        apiPrefix: `/api/admin/portal-preview/${customerId}`,
        customerId,
      }}
    >
      {children}
    </PortalPreviewContext.Provider>
  );
}

export function usePortalPreview() {
  return useContext(PortalPreviewContext);
}
