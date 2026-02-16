"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLeads } from "../hooks/useLeads";
import { claimLead } from "../actions/claimLead";
import { NewLeadsTableRow } from "./NewLeadsTableRow";
import { NewLeadCard } from "./NewLeadCard";
import { BulkActionBar } from "./BulkActionBar";
import type { Customer } from "@/types/customer";

interface NewLeadsTableProps {
  searchQuery?: string;
  onAddLead: () => void;
}

export function NewLeadsTable({ searchQuery, onAddLead }: NewLeadsTableProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isClaiming, setIsClaiming] = useState(false);
  const [assignTo, setAssignTo] = useState("myself");
  const [teamMembers, setTeamMembers] = useState<Array<{ id: string; name: string }>>([]);

  const { leads, total, isLoading, refetch } = useLeads({ leadStatus: "new", search: searchQuery });

  useEffect(() => {
    fetch("/api/team-members?active=true")
      .then((res) => res.json())
      .then((json) => {
        if (json.data) setTeamMembers(json.data.map((m: { id: string; name: string }) => ({ id: m.id, name: m.name })));
      })
      .catch(() => {});
  }, []);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === leads.length) setSelected(new Set());
    else setSelected(new Set(leads.map((l: Customer) => l.id)));
  };

  const handleClaimSelected = async () => {
    if (selected.size === 0) return;
    setIsClaiming(true);
    const teamMemberId = assignTo !== "myself" ? assignTo : undefined;
    for (const id of Array.from(selected)) { await claimLead(id, teamMemberId); }
    setSelected(new Set());
    setAssignTo("myself");
    setIsClaiming(false);
    refetch();
  };

  const handleRowClick = (lead: Customer) => {
    router.push(`/customers/${lead.id}?tab=sales&from=my-leads`);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <select className="px-3 py-2 border rounded-lg text-sm bg-white">
            <option>All Sources</option><option>Website</option><option>Referral</option><option>Google Ads</option><option>Equate Media</option>
          </select>
          <select className="px-3 py-2 border rounded-lg text-sm bg-white">
            <option>Today</option><option>This Week</option><option>This Month</option><option>All Time</option>
          </select>
        </div>
        <Button onClick={onAddLead}><Plus className="h-4 w-4 mr-2" /> Add Lead</Button>
      </div>

      <BulkActionBar selectedCount={selected.size} assignTo={assignTo} onAssignToChange={setAssignTo} teamMembers={teamMembers} isClaiming={isClaiming} onClaim={handleClaimSelected} onClear={() => setSelected(new Set())} />

      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {leads.map((lead: Customer) => (
          <NewLeadCard key={lead.id} lead={lead} isSelected={selected.has(lead.id)} onToggleSelect={toggleSelect} onRowClick={handleRowClick} />
        ))}
        {leads.length === 0 && <Card className="p-8 text-center text-muted-foreground">No new leads found</Card>}
      </div>

      {/* Desktop table view */}
      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="w-10 p-4"><input type="checkbox" className="h-4 w-4 rounded cursor-pointer" checked={leads.length > 0 && selected.size === leads.length} onChange={toggleAll} /></th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Lead</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Source</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Service</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Date</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Est. Value</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead: Customer) => (
                <NewLeadsTableRow key={lead.id} lead={lead} isSelected={selected.has(lead.id)} onToggleSelect={toggleSelect} onRowClick={handleRowClick} />
              ))}
              {leads.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No new leads found</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-4 border-t">
          <span className="text-sm text-muted-foreground">Showing {leads.length} of {total} leads</span>
        </div>
      </Card>
    </div>
  );
}
