"use client";

import { FileText, FileSignature, Receipt, FileSpreadsheet, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DocumentItem, DocumentType } from "../types";
import { DOC_TYPE_LABELS, DOC_STATUS_COLORS } from "../types";

const TYPE_ICONS: Record<DocumentType, typeof FileText> = {
  estimate_page: FileText,
  contract: FileSignature,
  invoice: Receipt,
  work_order: FileSpreadsheet,
};

function getViewUrl(doc: DocumentItem): string | null {
  if (!doc.publicToken) return null;
  if (doc.type === "estimate_page") return `/e/${doc.publicToken}`;
  if (doc.type === "contract") return `/contracts/sign/${doc.publicToken}`;
  return null;
}

interface Props {
  document: DocumentItem;
}

export function DocumentRow({ document: doc }: Props) {
  const Icon = TYPE_ICONS[doc.type];
  const viewUrl = getViewUrl(doc);
  const dateStr = new Date(doc.createdAt).toLocaleDateString();

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-0">
      <div className="shrink-0 w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
        <Icon className="h-4 w-4 text-slate-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium truncate">{doc.name}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${DOC_STATUS_COLORS[doc.status]}`}>
            {doc.status}
          </Badge>
          <span className="text-[11px] text-slate-400">{dateStr}</span>
        </div>
      </div>
      {viewUrl && (
        <a href={viewUrl} target="_blank" rel="noopener noreferrer"
          className="shrink-0 text-slate-400 hover:text-blue-600 transition-colors">
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}
