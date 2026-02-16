"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  notes: {
    internalNotes: string;
    customerNotes: string;
    crewNotes: string;
    crewFeedback: string;
  };
  onNoteChange: (key: "internalNotes" | "customerNotes" | "crewNotes" | "crewFeedback", value: string) => void;
}

function Dot({ show }: { show: boolean }) {
  if (!show) return null;
  return <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-red-500" />;
}

export function NotesCard({ notes, onNoteChange }: Props) {
  return (
    <Card className="overflow-hidden">
      <Tabs defaultValue="internal">
        <div className="border-b">
          <TabsList className="w-full justify-start bg-transparent h-auto p-0 rounded-none">
            <TabsTrigger value="internal" className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-slate-800 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 text-[13px] font-medium text-slate-400 data-[state=active]:text-slate-800">
              Internal<Dot show={!!notes.internalNotes} />
            </TabsTrigger>
            <TabsTrigger value="customer" className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-slate-800 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 text-[13px] font-medium text-slate-400 data-[state=active]:text-slate-800">
              Customer<Dot show={!!notes.customerNotes} />
            </TabsTrigger>
            <TabsTrigger value="crew" className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-slate-800 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 text-[13px] font-medium text-slate-400 data-[state=active]:text-slate-800">
              Crew Notes
            </TabsTrigger>
            <TabsTrigger value="feedback" className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-slate-800 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 text-[13px] font-medium text-slate-400 data-[state=active]:text-slate-800">
              Crew Feedback
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="px-5 pb-5">
          <TabsContent value="internal" className="mt-3">
            <p className="text-[11px] text-slate-400 italic mb-2">Note (Visible to office only)</p>
            <Textarea className="min-h-[150px] text-sm" value={notes.internalNotes} onChange={(e) => onNoteChange("internalNotes", e.target.value)} placeholder="Internal notes..." />
          </TabsContent>
          <TabsContent value="customer" className="mt-3">
            <p className="text-[11px] text-slate-400 italic mb-2">Visible to customer</p>
            <Textarea className="min-h-[150px] text-sm" value={notes.customerNotes} onChange={(e) => onNoteChange("customerNotes", e.target.value)} placeholder="Customer-facing notes..." />
          </TabsContent>
          <TabsContent value="crew" className="mt-3">
            <p className="text-[11px] text-slate-400 italic mb-2">Instructions for the crew</p>
            <Textarea className="min-h-[150px] text-sm" value={notes.crewNotes} onChange={(e) => onNoteChange("crewNotes", e.target.value)} placeholder="Crew instructions..." />
          </TabsContent>
          <TabsContent value="feedback" className="mt-3">
            <p className="text-[11px] text-slate-400 italic mb-2">Crew feedback (read-only)</p>
            <div className="min-h-[150px] rounded-md border bg-slate-50 p-3 text-sm text-slate-400">
              {notes.crewFeedback || "No crew feedback yet."}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
}
