"use client";

import { useRouter } from "next/navigation";
import { Plus, FileText, UserPlus, BarChart3 } from "lucide-react";

const ACTIONS = [
  { label: "New Job", icon: Plus, href: "/jobs/new", color: "bg-blue-50 hover:bg-blue-100 text-blue-700" },
  { label: "New Estimate", icon: FileText, href: "/estimates/new", color: "bg-purple-50 hover:bg-purple-100 text-purple-700" },
  { label: "Add Customer", icon: UserPlus, href: "/customers/new", color: "bg-green-50 hover:bg-green-100 text-green-700" },
  { label: "Reports", icon: BarChart3, href: "/reports", color: "bg-amber-50 hover:bg-amber-100 text-amber-700" },
];

export function QuickActions() {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-800">Quick Actions</h3>
      </div>
      <div className="p-3 grid grid-cols-2 gap-2">
        {ACTIONS.map(action => (
          <button
            key={action.label}
            onClick={() => router.push(action.href)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${action.color}`}
          >
            <action.icon className="h-4 w-4" />
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
