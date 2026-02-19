"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConsultationLinkDisplayProps {
  link: string;
  consultationId: string;
}

export function ConsultationLinkDisplay({
  link,
}: ConsultationLinkDisplayProps) {
  const [copiedCustomer, setCopiedCustomer] = useState(false);
  const [copiedHost, setCopiedHost] = useState(false);

  const hostLink = `${link}?role=host`;

  async function handleCopyCustomer() {
    await navigator.clipboard.writeText(link);
    setCopiedCustomer(true);
    setTimeout(() => setCopiedCustomer(false), 2000);
  }

  async function handleCopyHost() {
    await navigator.clipboard.writeText(hostLink);
    setCopiedHost(true);
    setTimeout(() => setCopiedHost(false), 2000);
  }

  function handleJoinAsHost() {
    window.open(hostLink, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-1.5">Customer Link</p>
        <div
          onClick={handleCopyCustomer}
          className="rounded-lg bg-muted/50 border px-3 py-2 cursor-pointer hover:bg-muted/80 transition-colors"
        >
          <p className="text-[11px] font-mono text-muted-foreground break-all select-all leading-relaxed">
            {link}
          </p>
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground mb-1.5">Host Link</p>
        <div
          onClick={handleCopyHost}
          className="rounded-lg bg-muted/50 border px-3 py-2 cursor-pointer hover:bg-muted/80 transition-colors"
        >
          <p className="text-[11px] font-mono text-muted-foreground break-all select-all leading-relaxed">
            {hostLink}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button onClick={handleCopyCustomer} variant="outline" size="sm">
          {copiedCustomer ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <>
              <Users className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Customer</span>
            </>
          )}
        </Button>
        <Button onClick={handleCopyHost} variant="outline" size="sm">
          {copiedHost ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Host</span>
            </>
          )}
        </Button>
        <Button onClick={handleJoinAsHost} size="sm">
          <ExternalLink className="h-3.5 w-3.5 mr-1" />
          <span className="text-xs">Join</span>
        </Button>
      </div>
    </div>
  );
}
