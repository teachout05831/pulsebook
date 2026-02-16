"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type NoteKey = "notes" | "customerNotes" | "crewNotes" | "crewFeedback";

interface NotesState {
  notes: string;
  customerNotes: string;
  crewNotes: string;
  crewFeedback: string;
}

interface Props {
  notes: NotesState;
  onNoteChange: (key: NoteKey, value: string) => void;
}

const TABS: { key: NoteKey; label: string }[] = [
  { key: "notes", label: "Internal" },
  { key: "customerNotes", label: "Customer" },
  { key: "crewNotes", label: "Crew Notes" },
  { key: "crewFeedback", label: "Feedback" },
];

export function JobNotesCard({ notes, onNoteChange }: Props) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-[13px] font-semibold mb-2">Notes</div>
        <Tabs defaultValue="notes">
          <TabsList className="h-7 p-0.5">
            {TABS.map((t) => (
              <TabsTrigger key={t.key} value={t.key} className="text-[11px] h-6 px-2">
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {TABS.map((t) => (
            <TabsContent key={t.key} value={t.key} className="mt-2">
              <Textarea
                className="text-[13px] min-h-[80px] resize-none"
                placeholder={`${t.label} notes...`}
                value={notes[t.key]}
                onChange={(e) => onNoteChange(t.key, e.target.value)}
                readOnly={t.key === "crewFeedback"}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
