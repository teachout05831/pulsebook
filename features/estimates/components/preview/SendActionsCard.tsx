"use client";

import { Mail, MessageSquare, Link2, Check, Loader2 } from "lucide-react";
import { useEstimateSend } from "../../hooks/useEstimateSend";

interface Props {
  pageId: string;
  publicToken: string;
  pageStatus: string;
  customerEmail: string | null;
  customerPhone: string | null;
}

export function SendActionsCard({ pageId, publicToken, pageStatus, customerEmail, customerPhone }: Props) {
  const { copyLink, sendEmail, sendText, copied, sending } = useEstimateSend({
    pageId, publicToken, pageStatus, customerEmail, customerPhone,
  });

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <h3 className="text-sm font-semibold text-slate-900 mb-3">Send to Customer</h3>
      <div className="space-y-2">
        <button
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-50"
          onClick={sendEmail}
          disabled={sending || !customerEmail}
        >
          {sending ? <Loader2 className="w-4 h-4 text-blue-500 animate-spin" /> : <Mail className="w-4 h-4 text-blue-500" />}
          Send via Email
        </button>
        <button
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-50"
          onClick={sendText}
          disabled={sending || !customerPhone}
        >
          <MessageSquare className="w-4 h-4 text-green-500" /> Send via Text
        </button>
        <button
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-md transition-colors"
          onClick={copyLink}
        >
          {copied
            ? <><Check className="w-4 h-4 text-green-500" /> Copied!</>
            : <><Link2 className="w-4 h-4 text-purple-500" /> Copy Link</>
          }
        </button>
      </div>
      {pageStatus === "draft" && (
        <p className="text-xs text-amber-600 mt-2">
          Page will be auto-published when sent.
        </p>
      )}
    </div>
  );
}
