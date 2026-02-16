"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Eye, BarChart3, Copy, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PAGE_STATUS_LABELS, PAGE_STATUS_COLORS, type EstimatePageStatus } from "../types";
import { EstimatePickerDialog } from "./EstimatePickerDialog";
import { TemplatePicker } from "./templates/TemplatePicker";

interface PageRow {
  id: string; publicToken: string; status: EstimatePageStatus;
  createdAt: string; estimateNumber: string; estimateTotal: number; customerName: string;
}

const LIMIT = 10;
const FILTERS = [
  ["all", "All Statuses"], ["draft", "Draft"], ["published", "Published"],
  ["viewed", "Viewed"], ["approved", "Approved"], ["declined", "Declined"],
] as const;
const fmtUSD = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export function EstimatePageDashboard() {
  const router = useRouter();
  const [pages, setPages] = useState<PageRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pg, setPg] = useState(1);
  const [status, setStatus] = useState("all");
  const [epOpen, setEpOpen] = useState(false);
  const [selEstId, setSelEstId] = useState<string | null>(null);

  const fetchPages = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ _page: String(pg), _limit: String(LIMIT) });
      if (status !== "all") params.set("status", status);
      const res = await fetch(`/api/estimate-pages?${params}`);
      if (!res.ok) throw new Error("fetch failed");
      const json = await res.json();
      setPages(json.data || []);
      setTotal(json.total || 0);
    } catch {
      toast.error("Failed to load estimate pages");
    } finally { setLoading(false); }
  }, [pg, status]);

  useEffect(() => { fetchPages(); }, [fetchPages]);

  const lastPg = Math.max(1, Math.ceil(total / LIMIT));
  const copyLink = async (token: string) => {
    await navigator.clipboard.writeText(`${window.location.origin}/e/${token}`);
    toast.success("Public link copied to clipboard");
  };

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Estimate Pages</CardTitle>
            <CardDescription>Manage shareable estimate pages for your customers</CardDescription>
          </div>
          <Button onClick={() => setEpOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Page
          </Button>
        </div>
        <div className="pt-2">
          <Select value={status} onValueChange={(v) => { setStatus(v); setPg(1); }}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Filter status" /></SelectTrigger>
            <SelectContent>
              {FILTERS.map(([val, label]) => <SelectItem key={val} value={val}>{label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead><TableHead>Estimate #</TableHead>
              <TableHead>Status</TableHead><TableHead className="text-right">Total</TableHead>
              <TableHead>Created</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>{Array.from({ length: 6 }).map((_, j) => (
                <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
              ))}</TableRow>
            )) : pages.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No estimate pages found
              </TableCell></TableRow>
            ) : pages.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.customerName || "\u2014"}</TableCell>
                <TableCell>{p.estimateNumber || "\u2014"}</TableCell>
                <TableCell>
                  <Badge className={PAGE_STATUS_COLORS[p.status]} variant="outline">
                    {PAGE_STATUS_LABELS[p.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{fmtUSD(p.estimateTotal)}</TableCell>
                <TableCell>{fmtDate(p.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => router.push(`/estimate-pages/${p.id}`)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" asChild>
                      <a href={`/e/${p.publicToken}`} target="_blank" rel="noopener noreferrer"><Eye className="h-4 w-4" /></a>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => copyLink(p.publicToken)}><Copy className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => router.push(`/estimate-pages/${p.id}/analytics`)}><BarChart3 className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {lastPg > 1 && (
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-muted-foreground">Page {pg} of {lastPg} ({total} total)</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={pg <= 1} onClick={() => setPg(pg - 1)}>Previous</Button>
              <Button variant="outline" size="sm" disabled={pg >= lastPg} onClick={() => setPg(pg + 1)}>Next</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
    <EstimatePickerDialog open={epOpen} onClose={() => setEpOpen(false)}
      onSelect={(id) => { setEpOpen(false); setSelEstId(id); }} />
    <TemplatePicker open={!!selEstId} onClose={() => setSelEstId(null)}
      estimateId={selEstId || ""} onCreated={(pageId) => { setSelEstId(null); fetchPages(); router.push(`/estimate-pages/${pageId}`); }} />
    </>
  );
}
