"use client";

import { Refine, type DataProvider } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router";
import { DevtoolsProvider, DevtoolsPanel } from "@refinedev/devtools";

// Placeholder data provider - will be replaced with actual API provider in CUST-001
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const placeholderDataProvider: DataProvider = {
  getList: async () => ({ data: [], total: 0 }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getOne: async () => ({ data: {} as any }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: async () => ({ data: {} as any }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: async () => ({ data: {} as any }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deleteOne: async () => ({ data: {} as any }),
  getApiUrl: () => "/api",
};

interface RefineProviderProps {
  children: React.ReactNode;
}

export function RefineProvider({ children }: RefineProviderProps) {
  return (
    <DevtoolsProvider>
      <Refine
        routerProvider={routerProvider}
        dataProvider={placeholderDataProvider}
        resources={[
          {
            name: "customers",
            list: "/customers",
            create: "/customers/new",
            edit: "/customers/:id",
            show: "/customers/:id",
            meta: {
              label: "Customers",
              icon: "users",
            },
          },
          {
            name: "jobs",
            list: "/jobs",
            create: "/jobs/new",
            edit: "/jobs/:id",
            show: "/jobs/:id",
            meta: {
              label: "Jobs",
              icon: "briefcase",
            },
          },
          {
            name: "estimates",
            list: "/estimates",
            create: "/estimates/new",
            edit: "/estimates/:id",
            show: "/estimates/:id",
            meta: {
              label: "Estimates",
              icon: "file-text",
            },
          },
          {
            name: "invoices",
            list: "/invoices",
            create: "/invoices/new",
            edit: "/invoices/:id",
            show: "/invoices/:id",
            meta: {
              label: "Invoices",
              icon: "dollar-sign",
            },
          },
        ]}
        options={{
          syncWithLocation: true,
          warnWhenUnsavedChanges: true,
          projectId: "servicepro",
        }}
      >
        {children}
        <DevtoolsPanel />
      </Refine>
    </DevtoolsProvider>
  );
}
