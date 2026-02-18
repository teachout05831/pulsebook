"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import { useTerminology } from "@/components/providers/terminology-provider";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  ScrollText,
  Receipt,
  BarChart3,
  Settings,
  Menu,
  Truck,
  Calendar,
  CreditCard,
  Target,
  ChevronLeft,
  LogOut,
  Presentation,
  LayoutTemplate,
  CalendarPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CompanySwitcher } from "@/features/companies";
import { signOut } from "@/features/auth";
import type { AuthUser } from "@/features/auth";
import type { Company, UserCompany } from "@/features/companies";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  badgeColor?: "red" | "green";
  activePrefix?: string;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

function buildNavSections(t: ReturnType<typeof useTerminology>): NavSection[] {
  return [
    {
      items: [
        { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
      ],
    },
    {
      title: "Sales",
      items: [
        { label: "Sales / Leads", href: "/sales", icon: <Target className="h-5 w-5" /> },
        { label: t.estimate.plural, href: "/estimates", icon: <FileText className="h-5 w-5" /> },
        { label: t.estimatePage.plural, href: "/estimate-pages", icon: <Presentation className="h-5 w-5" /> },
        { label: "Page Templates", href: "/estimate-pages/templates", icon: <LayoutTemplate className="h-5 w-5" /> },
        { label: "Online Booking", href: "/scheduling", icon: <CalendarPlus className="h-5 w-5" /> },
      ],
    },
    {
      title: "Operations",
      items: [
        { label: t.job.plural, href: "/jobs", icon: <Briefcase className="h-5 w-5" /> },
        { label: "Calendar", href: "/jobs/calendar", icon: <Calendar className="h-5 w-5" /> },
        { label: "Dispatch", href: "/jobs/dispatch", icon: <Truck className="h-5 w-5" /> },
        { label: t.contract.plural, href: "/contracts", icon: <ScrollText className="h-5 w-5" /> },
      ],
    },
    {
      title: "Finance",
      items: [
        { label: t.invoice.plural, href: "/invoices", icon: <Receipt className="h-5 w-5" /> },
        { label: "Payments", href: "/payments", icon: <CreditCard className="h-5 w-5" /> },
      ],
    },
    {
      title: "CRM",
      items: [
        { label: t.customer.plural, href: "/customers", icon: <Users className="h-5 w-5" /> },
        { label: "Reports", href: "/reports", icon: <BarChart3 className="h-5 w-5" /> },
      ],
    },
    {
      items: [
        { label: "Settings", href: "/settings/company", activePrefix: "/settings", icon: <Settings className="h-5 w-5" /> },
      ],
    },
  ];
}

interface SidebarProps {
  user: AuthUser | null;
  activeCompany: Company | null;
  userCompanies: UserCompany[];
}

function getInitials(name: string | null | undefined): string {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Sidebar({ user, activeCompany, userCompanies }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const t = useTerminology();
  const navSections = useMemo(() => buildNavSections(t), [t]);

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "fixed top-4 left-4 z-50 md:hidden bg-slate-900 text-white hover:bg-slate-800 hover:text-white shadow-lg",
          isOpen && "left-[216px]"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <ChevronLeft className={cn("h-5 w-5", !isOpen && "hidden")} />
        <Menu className={cn("h-5 w-5", isOpen && "hidden")} />
      </Button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-60 bg-slate-900 text-white transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center px-5 border-b border-slate-800">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-semibold text-lg">Pulsebook</span>
          </Link>
        </div>

        {/* Company Switcher */}
        {activeCompany && userCompanies.length > 0 && (
          <div className="px-3 py-3 border-b border-slate-800">
            <CompanySwitcher activeCompany={activeCompany} userCompanies={userCompanies} />
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-2">
              {section.title && (
                <div className="px-5 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                const matchPath = item.activePrefix || item.href;
                const isActive = pathname === matchPath || pathname?.startsWith(`${matchPath}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 mx-3 px-3 py-2.5 text-sm font-medium transition-all rounded-lg border-l-[3px]",
                      isActive
                        ? "bg-blue-600/20 text-white border-l-blue-500"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white border-l-transparent"
                    )}
                  >
                    {item.icon}
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "px-2 py-0.5 text-xs font-semibold rounded-full",
                          item.badgeColor === "green"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-sm font-semibold">
              {getInitials(user?.fullName || user?.email)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {user?.fullName || user?.email || "User"}
              </div>
              <div className="text-xs text-slate-500 truncate">{user?.email}</div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white hover:bg-slate-800"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
