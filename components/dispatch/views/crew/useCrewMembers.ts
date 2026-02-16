"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import type { DispatchCrew, DispatchTechnician } from "@/types/dispatch";

export function useCrewMembers(crews: DispatchCrew[], technicians: DispatchTechnician[], selectedDate: Date) {
  const [localCrews, setLocalCrews] = useState<DispatchCrew[]>(crews);
  useEffect(() => { setLocalCrews(crews); }, [crews]);

  const rosterDate = selectedDate.toISOString().split("T")[0];

  const availableTechs = useMemo(() => {
    const assignedIds = new Set<string>();
    localCrews.forEach(c => c.members.forEach(m => assignedIds.add(m.id)));
    return technicians.filter(t => t.isActive && !assignedIds.has(t.id));
  }, [localCrews, technicians]);

  const handleAddMember = useCallback((crewId: string, tech: DispatchTechnician) => {
    setLocalCrews(prev => prev.map(c => {
      if (c.databaseId !== crewId) return c;
      if (c.members.some(m => m.databaseId === tech.databaseId)) return c;
      return { ...c, members: [...c.members, tech] };
    }));
    fetch("/api/crews/roster/member", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ crewId, date: rosterDate, teamMemberId: tech.databaseId, action: "add" }),
    }).then(res => {
      if (!res.ok) throw new Error("Failed");
    }).catch(() => {
      setLocalCrews(prev => prev.map(c => {
        if (c.databaseId !== crewId) return c;
        return { ...c, members: c.members.filter(m => m.databaseId !== tech.databaseId) };
      }));
    });
  }, [rosterDate]);

  const handleRemoveMember = useCallback((crewId: string, memberId: string) => {
    let removedTech: DispatchTechnician | undefined;
    setLocalCrews(prev => prev.map(c => {
      if (c.databaseId !== crewId) return c;
      removedTech = c.members.find(m => m.databaseId === memberId);
      return { ...c, members: c.members.filter(m => m.databaseId !== memberId) };
    }));
    fetch("/api/crews/roster/member", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ crewId, date: rosterDate, teamMemberId: memberId, action: "remove" }),
    }).then(res => {
      if (!res.ok) throw new Error("Failed");
    }).catch(() => {
      if (removedTech) {
        const tech = removedTech;
        setLocalCrews(prev => prev.map(c => {
          if (c.databaseId !== crewId) return c;
          if (c.members.some(m => m.databaseId === tech.databaseId)) return c;
          return { ...c, members: [...c.members, tech] };
        }));
      }
    });
  }, [rosterDate]);

  return { localCrews, availableTechs, handleAddMember, handleRemoveMember };
}
