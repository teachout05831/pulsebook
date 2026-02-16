"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConsultationLinkDisplayProps {
  link: string;
  consultationId: string;
}

export function ConsultationLinkDisplay({
  link,
  consultationId,
}: ConsultationLinkDisplayProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleJoinAsHost() {
    window.open(link, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-3 py-2">
        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
        <p className="text-sm text-green-600 dark:text-green-400">
          Consultation room created successfully.
        </p>
      </div>

      <p className="text-sm text-muted-foreground">
        Share this link with your customer to start the video consultation.
      </p>

      {/* Link display with inline copy */}
      <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2.5">
        <span className="flex-1 text-sm font-mono truncate select-all">
          {link}
        </span>
        <button
          onClick={handleCopy}
          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <Button onClick={handleCopy} variant="outline" className="flex-1">
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-1.5 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-1.5" />
              Copy Link
            </>
          )}
        </Button>
        <Button onClick={handleJoinAsHost} className="flex-1">
          <ExternalLink className="h-4 w-4 mr-1.5" />
          Join as Host
        </Button>
      </div>
    </div>
  );
}
