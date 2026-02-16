"use client";

import { Settings, Calendar } from "lucide-react";

interface Props {
  settings: {
    allowInstantApproval: boolean;
    requireDeposit: boolean;
    depositAmount: number | null;
    depositType: string;
  };
  expiresAt: string | null;
  status: string;
}

function formatDate(iso: string | null): string {
  if (!iso) return "No expiration";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function PageSettingsCard({ settings, expiresAt, status }: Props) {
  const depositLabel = settings.requireDeposit
    ? settings.depositType === "percentage"
      ? `${settings.depositAmount || 0}% deposit required`
      : `$${(settings.depositAmount || 0).toLocaleString()} deposit required`
    : "No deposit required";

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Settings className="w-4 h-4 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-900">Page Settings</h3>
      </div>
      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">Status</span>
          <span className="font-medium text-slate-700 capitalize">{status}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Approval</span>
          <span className="font-medium text-slate-700">
            {settings.allowInstantApproval ? "Instant" : "Manual review"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Deposit</span>
          <span className="font-medium text-slate-700">{depositLabel}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Expires
          </span>
          <span className="font-medium text-slate-700">{formatDate(expiresAt)}</span>
        </div>
      </div>
    </div>
  );
}
