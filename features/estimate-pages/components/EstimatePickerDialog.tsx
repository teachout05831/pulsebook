"use client";

import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { toast } from "sonner";

interface Estimate {
  id: string;
  estimateNumber: string;
  customerName: string;
  total: number;
  status: string;
  pageCount: number;
  pageStatus: string | null;
}

interface EstimatePickerDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (estimateId: string) => void;
}

const fmtUSD = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export function EstimatePickerDialog({ open, onClose, onSelect }: EstimatePickerDialogProps) {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) return;
    setIsLoading(true);
    fetch("/api/estimates?_limit=50&_sort=created_at&_order=desc")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((json) => setEstimates(json.data || []))
      .catch(() => toast.error("Failed to load estimates"))
      .finally(() => setIsLoading(false));
  }, [open]);

  const filtered = estimates.filter((e) =>
    e.estimateNumber.toLowerCase().includes(search.toLowerCase())
    || e.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select an Estimate</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by number or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No estimates found</p>
        ) : (
          <div className="space-y-1.5 max-h-[50vh] overflow-y-auto">
            {filtered.map((est) => (
              <button
                key={est.id}
                type="button"
                onClick={() => onSelect(est.id)}
                className="flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors hover:bg-muted/50"
              >
                <div>
                  <p className="text-sm font-medium">{est.estimateNumber}</p>
                  <p className="text-xs text-muted-foreground">{est.customerName}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <p className="text-sm font-medium">{fmtUSD(est.total)}</p>
                  <div className="flex items-center gap-1">
                    {est.pageCount > 0 && (
                      <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                        Has Page
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs capitalize">{est.status}</Badge>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
