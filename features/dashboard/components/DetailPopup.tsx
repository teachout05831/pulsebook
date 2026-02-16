"use client";

import { Briefcase, DollarSign } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { DetailPopupData, SalesLeader } from "../types";

interface DetailPopupProps {
  data: DetailPopupData | null;
  isOpen: boolean;
  onClose: () => void;
}

function getInitials(name: string): string {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="h-3.5 w-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] text-slate-400">{label}</p>
        <p className="text-xs text-slate-700">{value}</p>
      </div>
    </div>
  );
}

export function DetailPopup({ data, isOpen, onClose }: DetailPopupProps) {
  if (!data) return null;

  const leader = data.item as SalesLeader;

  return (
    <Dialog open={isOpen} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-lg p-0 gap-0">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <span className="text-sm font-bold text-amber-700">{getInitials(leader.name)}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-slate-900 truncate">{leader.name}</h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700">
              Sales Leader
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <div className="grid grid-cols-2 gap-3">
            <InfoRow icon={Briefcase} label="Jobs Booked" value={String(leader.jobCount)} />
            <InfoRow icon={DollarSign} label="Total Revenue" value={formatCurrency(leader.revenue)} />
            <InfoRow icon={DollarSign} label="Avg Job Value" value={leader.jobCount > 0 ? formatCurrency(Math.round(leader.revenue / leader.jobCount)) : "—"} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 bg-slate-50 border-t rounded-b-lg">
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
