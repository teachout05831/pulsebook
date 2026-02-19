"use client";

import { useState, useCallback } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DateTimePickerProps {
  value?: string;
  onChange: (iso: string) => void;
  submitLabel?: string;
  onSubmit?: () => void;
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = ["00", "15", "30", "45"];

function parseInitial(value?: string) {
  if (!value) {
    const now = new Date();
    now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15, 0, 0);
    return { date: now, hour: now.getHours() % 12 || 12, minute: pad(now.getMinutes()), period: now.getHours() >= 12 ? "PM" : "AM" };
  }
  const d = new Date(value);
  return { date: d, hour: d.getHours() % 12 || 12, minute: pad(d.getMinutes()), period: d.getHours() >= 12 ? "PM" : "AM" };
}

function pad(n: number): string { return n < 10 ? `0${n}` : `${n}`; }

function toISO(date: Date, hour: number, minute: string, period: string): string {
  const d = new Date(date);
  let h = hour;
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  d.setHours(h, parseInt(minute), 0, 0);
  return d.toISOString();
}

export function DateTimePicker({ value, onChange, submitLabel, onSubmit }: DateTimePickerProps) {
  const initial = parseInitial(value);
  const [selectedDate, setSelectedDate] = useState<Date>(initial.date);
  const [hour, setHour] = useState(String(initial.hour));
  const [minute, setMinute] = useState(initial.minute);
  const [period, setPeriod] = useState(initial.period);

  const emitChange = useCallback((d: Date, h: string, m: string, p: string) => {
    onChange(toISO(d, parseInt(h), m, p));
  }, [onChange]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    emitChange(date, hour, minute, period);
  };

  const handleHour = (v: string) => { setHour(v); emitChange(selectedDate, v, minute, period); };
  const handleMinute = (v: string) => { setMinute(v); emitChange(selectedDate, hour, v, period); };
  const handlePeriod = (v: string) => { setPeriod(v); emitChange(selectedDate, hour, minute, v); };

  return (
    <div className="space-y-3">
      <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} className="rounded-md border p-2" />
      <div className="flex items-center gap-2">
        <Select value={hour} onValueChange={handleHour}>
          <SelectTrigger className="w-[70px]"><SelectValue /></SelectTrigger>
          <SelectContent>{HOURS.map((h) => <SelectItem key={h} value={String(h)}>{h}</SelectItem>)}</SelectContent>
        </Select>
        <span className="text-muted-foreground font-medium">:</span>
        <Select value={minute} onValueChange={handleMinute}>
          <SelectTrigger className="w-[70px]"><SelectValue /></SelectTrigger>
          <SelectContent>{MINUTES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={period} onValueChange={handlePeriod}>
          <SelectTrigger className="w-[70px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {onSubmit && (
        <Button size="sm" className="w-full" onClick={onSubmit}>{submitLabel || "Save"}</Button>
      )}
    </div>
  );
}
