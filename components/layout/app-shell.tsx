"use client";

import { Sidebar } from "./sidebar";
import { TerminologyProvider } from "@/components/providers/terminology-provider";
import type { AuthUser } from "@/features/auth";
import type { Company, UserCompany } from "@/features/companies";
import type { TerminologySettings } from "@/types/company";

interface AppShellProps {
  children: React.ReactNode;
  user: AuthUser | null;
  activeCompany: Company | null;
  userCompanies: UserCompany[];
}

export function AppShell({ children, user, activeCompany, userCompanies }: AppShellProps) {
  const terminology = (activeCompany?.settings as Record<string, unknown>)?.terminology as
    Partial<TerminologySettings> | undefined;

  return (
    <TerminologyProvider settings={terminology}>
      <div className="min-h-screen bg-slate-50">
        <Sidebar user={user} activeCompany={activeCompany} userCompanies={userCompanies} />
        <main className="md:pl-60">
          <div className="p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </TerminologyProvider>
  );
}
