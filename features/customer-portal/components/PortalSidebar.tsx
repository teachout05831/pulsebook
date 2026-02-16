"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Receipt,
  FileCheck,
  Calendar,
  FolderOpen,
  User,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { CustomerProfileData } from "../types";

interface Props {
  profile: CustomerProfileData | null;
}

const navItems = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/estimates", label: "Estimates", icon: FileText },
  { href: "/portal/jobs", label: "Jobs", icon: Briefcase },
  { href: "/portal/invoices", label: "Invoices", icon: Receipt },
  { href: "/portal/contracts", label: "Contracts", icon: FileCheck },
  { href: "/portal/appointments", label: "Appointments", icon: Calendar },
  { href: "/portal/documents", label: "Documents", icon: FolderOpen },
  { href: "/portal/account", label: "Account", icon: User },
];

export function PortalSidebar({ profile }: Props) {
  const pathname = usePathname();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/portal/login";
  };

  const isActive = (href: string) => {
    if (href === "/portal") return pathname === "/portal";
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden md:flex h-full w-64 flex-col border-r bg-white">
      <div className="border-b px-4 py-4">
        {profile?.companyLogo ? (
          <img
            src={profile.companyLogo}
            alt={profile.companyName}
            className="h-8 max-w-[160px] object-contain"
          />
        ) : (
          <span className="font-semibold text-sm">
            {profile?.companyName || "Customer Portal"}
          </span>
        )}
      </div>

      <nav className="flex-1 px-2 py-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive(href)
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t px-4 py-3">
        <div className="mb-2 text-xs text-muted-foreground truncate">
          {profile?.name || "Customer"}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
