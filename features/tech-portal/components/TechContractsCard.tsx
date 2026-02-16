"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, Loader2, CheckCircle2 } from "lucide-react";
import { useTechContracts } from "../hooks/useTechContracts";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  viewed: "bg-yellow-100 text-yellow-700",
  signed: "bg-green-100 text-green-700",
  paid: "bg-emerald-100 text-emerald-700",
  completed: "bg-emerald-100 text-emerald-700",
};

interface Props {
  jobId: string;
}

export function TechContractsCard({ jobId }: Props) {
  const { contracts, isLoading } = useTechContracts(jobId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (contracts.length === 0) return null;

  return (
    <Card>
      <CardContent className="pt-4 pb-3">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <p className="text-xs font-medium text-muted-foreground">Contracts</p>
        </div>
        <div className="space-y-2">
          {contracts.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-lg border p-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{c.templateName}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(c.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <Badge className={STATUS_COLORS[c.status] || "bg-gray-100"}>
                  {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                </Badge>
                {(c.status === "sent" || c.status === "viewed") && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`/sign/${c.signingToken}`, "_blank")}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Sign
                  </Button>
                )}
                {c.status === "signed" && (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
