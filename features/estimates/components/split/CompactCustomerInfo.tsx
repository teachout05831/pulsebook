"use client";

import { User, Mail, Phone, UserCheck } from "lucide-react";
import type { EstimateDetail } from "@/types/estimate";

interface Props {
  estimate: EstimateDetail;
}

export function CompactCustomerInfo({ estimate }: Props) {
  return (
    <div className="bg-white rounded-lg border p-2.5">
      <h3 className="text-xs font-semibold mb-1.5">Customer Info</h3>
      <div className="space-y-1.5">
        {/* Customer Name */}
        <div className="flex items-center gap-1.5">
          <User className="w-3 h-3 text-slate-400 flex-shrink-0" />
          <span className="text-[11px] text-slate-700 truncate">{estimate.customerName}</span>
        </div>

        {/* Email */}
        {estimate.customerEmail && (
          <div className="flex items-center gap-1.5">
            <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span className="text-[11px] text-slate-600 truncate">{estimate.customerEmail}</span>
          </div>
        )}

        {/* Phone */}
        {estimate.customerPhone && (
          <div className="flex items-center gap-1.5">
            <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span className="text-[11px] text-slate-600">{estimate.customerPhone}</span>
          </div>
        )}

        {/* Sales Rep */}
        {estimate.salesPersonName && (
          <div className="flex items-center gap-1.5 pt-1.5 mt-1.5 border-t">
            <UserCheck className="w-3 h-3 text-blue-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[9px] text-slate-400 uppercase">Sales Rep</div>
              <div className="text-[11px] text-slate-700 truncate">{estimate.salesPersonName}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
