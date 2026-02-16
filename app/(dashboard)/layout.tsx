import { AppShell } from "@/components/layout";
import { getActiveCompany, getUserCompanies } from "@/features/companies/queries";
import { getUser } from "@/features/auth/queries";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, activeCompany, userCompanies] = await Promise.all([
    getUser(),
    getActiveCompany(),
    getUserCompanies(),
  ]);

  return (
    <AppShell
      user={user}
      activeCompany={activeCompany}
      userCompanies={userCompanies}
    >
      {children}
    </AppShell>
  );
}
