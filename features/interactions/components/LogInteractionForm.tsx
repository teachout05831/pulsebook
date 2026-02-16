"use client";

import { useState } from "react";
import { Phone, MessageSquare, Mail, Users, StickyNote, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { InteractionType, InteractionDirection, InteractionOutcome, CreateInteractionInput } from "../types";

const TYPE_OPTIONS: { id: InteractionType; label: string; icon: React.ElementType }[] = [
  { id: "call", label: "Call", icon: Phone },
  { id: "text", label: "Text", icon: MessageSquare },
  { id: "email", label: "Email", icon: Mail },
  { id: "meeting", label: "Meeting", icon: Users },
  { id: "note", label: "Note", icon: StickyNote },
];

const DIRECTION_TYPES: InteractionType[] = ["call", "text", "email"];

interface LogInteractionFormProps {
  defaultType?: InteractionType;
  onSubmit: (input: Omit<CreateInteractionInput, "customerId">) => Promise<{ success?: boolean; error?: string }>;
  onCancel?: () => void;
}

export function LogInteractionForm({ defaultType, onSubmit, onCancel }: LogInteractionFormProps) {
  const [type, setType] = useState<InteractionType>(defaultType || "call");
  const [direction, setDirection] = useState<InteractionDirection>("outbound");
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [outcome, setOutcome] = useState<InteractionOutcome | "">("");
  const [duration, setDuration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showDirection = DIRECTION_TYPES.includes(type);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    const input: Omit<CreateInteractionInput, "customerId"> = {
      type,
      ...(showDirection && { direction }),
      ...(subject && { subject }),
      ...(details && { details }),
      ...(outcome && { outcome }),
      ...(duration && type === "call" && { durationSeconds: parseInt(duration) * 60 }),
    };
    const result = await onSubmit(input);
    setIsSubmitting(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSubject(""); setDetails(""); setOutcome(""); setDuration("");
      onCancel?.();
    }
  };

  return (
    <div className="border rounded-lg bg-gray-50/50 p-4 space-y-3">
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
        {TYPE_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              onClick={() => setType(opt.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                type === opt.id ? "bg-blue-100 text-blue-700 border border-blue-200" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />{opt.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        {showDirection && (
          <Select value={direction} onValueChange={(v) => setDirection(v as InteractionDirection)}>
            <SelectTrigger className="w-full sm:w-32 h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="outbound">Outbound</SelectItem>
              <SelectItem value="inbound">Inbound</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Input placeholder="Subject (optional)" value={subject} onChange={(e) => setSubject(e.target.value)} className="h-9 flex-1" />
      </div>

      <Textarea placeholder="Details..." value={details} onChange={(e) => setDetails(e.target.value)} rows={3} className="resize-none" />

      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <Select value={outcome} onValueChange={(v) => setOutcome(v as InteractionOutcome)}>
          <SelectTrigger className="w-full sm:w-44 h-9"><SelectValue placeholder="Outcome (optional)" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="positive">Positive</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="no_answer">No Answer</SelectItem>
            <SelectItem value="follow_up_needed">Needs Follow-up</SelectItem>
          </SelectContent>
        </Select>
        {type === "call" && (
          <Input type="number" placeholder="Duration (min)" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full sm:w-32 h-9" />
        )}
        <div className="flex gap-2 ml-auto">
          {onCancel && <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>}
          <Button size="sm" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}Save
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
