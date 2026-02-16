"use client";

import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router";
import { dataProvider } from "./dataProvider";
import { authProvider } from "./auth-provider";

interface RefineProviderProps {
  children: React.ReactNode;
}

export function RefineProvider({ children }: RefineProviderProps) {
  return (
    <Refine
      routerProvider={routerProvider}
      dataProvider={dataProvider}
      authProvider={authProvider}
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
        {
          name: "estimate-pages",
          list: "/estimate-pages",
          edit: "/estimate-pages/:id",
          show: "/estimate-pages/:id",
          meta: {
            label: "Estimate Pages",
            icon: "presentation",
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
    </Refine>
  );
}
