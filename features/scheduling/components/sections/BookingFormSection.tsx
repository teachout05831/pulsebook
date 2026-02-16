"use client";

import { useState } from "react";
import { User, Mail, Phone, MapPin, MessageSquare, CheckCircle, Loader2 } from "lucide-react";
import type { SectionProps } from "@/features/estimate-pages/components/sections/sectionProps";
import { useBooking } from "../BookingProvider";

export function BookingFormSection({ section }: SectionProps) {
  const booking = useBooking();
  const heading = (section.content.heading as string) || "Your Information";
  const description = (section.content.description as string) || "Please provide your contact details to confirm your booking";
  const requirePhone = section.content.requirePhone !== false;
  const requireEmail = section.content.requireEmail !== false;
  const requireAddress = section.content.requireAddress === true;

  if (!booking) return <FormPreview heading={heading} description={description} requirePhone={requirePhone} requireEmail={requireEmail} requireAddress={requireAddress} />;
  return <LiveForm heading={heading} description={description} requirePhone={requirePhone} requireEmail={requireEmail} requireAddress={requireAddress} />;
}

interface FormProps { heading: string; description: string; requirePhone: boolean; requireEmail: boolean; requireAddress: boolean }

function LiveForm({ heading, description, requirePhone, requireEmail, requireAddress }: FormProps) {
  const booking = useBooking()!;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedService = booking.services.find(s => s.id === booking.flow.selectedServiceId);

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Name is required"); return; }
    if (requireEmail && !email.trim()) { setError("Email is required"); return; }
    setSubmitting(true); setError(null);
    try {
      const res = await fetch(`/api/scheduling/public/${booking.token}/book`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName: name, customerEmail: email || undefined, customerPhone: phone || undefined, customerAddress: address || undefined, serviceTypeId: booking.flow.selectedServiceId, preferredDate: booking.flow.selectedDate, preferredTime: booking.flow.selectedTime, notes: notes || undefined }),
      });
      if (res.ok) setSuccess(true);
      else { const json = await res.json().catch(() => ({})); setError(json.error || "Booking failed"); }
    } catch { setError("Network error"); } finally { setSubmitting(false); }
  };

  if (success) return (
    <div className="w-full" style={{ padding: "var(--section-spacing, 2.5rem) 1rem" }}>
      <div className="max-w-2xl mx-auto text-center py-12">
        <CheckCircle className="h-16 w-16 mx-auto mb-4" style={{ color: "var(--primary-color, #22c55e)" }} />
        <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-muted-foreground mb-6">We'll send a confirmation to {email || "your email"}.</p>
        <button onClick={() => { setSuccess(false); setName(""); setEmail(""); setPhone(""); setAddress(""); setNotes(""); booking.reset(); }}
          className="px-6 py-2 text-sm font-medium border rounded hover:bg-gray-50" style={{ borderRadius: "var(--border-radius, 0.375rem)" }}>Book Another</button>
      </div>
    </div>
  );

  return (
    <div className="w-full" style={{ padding: "var(--section-spacing, 2.5rem) 1rem" }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <span className="ep-section-label" style={{ color: "var(--primary-color)" }}>Book</span>
          <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--primary-color, #1f2937)" }}>{heading}</h2>
          {description && <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">{description}</p>}
        </div>
        {selectedService && (
          <div className="mb-4 p-3 border rounded-lg bg-gray-50 text-sm">
            <strong>{selectedService.name}</strong> &middot; {booking.flow.selectedDate} at {booking.flow.selectedTime}
          </div>
        )}
        <div className="border p-6 space-y-4" style={{ borderRadius: "var(--border-radius, 0.5rem)" }}>
          <FieldRow icon={User} label="Full Name" required><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Smith" className="w-full px-3 py-2 text-sm border rounded" style={{ borderRadius: "var(--border-radius, 0.375rem)" }} /></FieldRow>
          {requireEmail && <FieldRow icon={Mail} label="Email" required><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" className="w-full px-3 py-2 text-sm border rounded" style={{ borderRadius: "var(--border-radius, 0.375rem)" }} /></FieldRow>}
          {requirePhone && <FieldRow icon={Phone} label="Phone" required><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 123-4567" className="w-full px-3 py-2 text-sm border rounded" style={{ borderRadius: "var(--border-radius, 0.375rem)" }} /></FieldRow>}
          {requireAddress && <FieldRow icon={MapPin} label="Address"><input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Main St" className="w-full px-3 py-2 text-sm border rounded" style={{ borderRadius: "var(--border-radius, 0.375rem)" }} /></FieldRow>}
          <FieldRow icon={MessageSquare} label="Notes" optional><textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any details..." rows={3} className="w-full px-3 py-2 text-sm border rounded resize-none" style={{ borderRadius: "var(--border-radius, 0.375rem)" }} /></FieldRow>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <button onClick={handleSubmit} disabled={submitting} className="w-full px-5 py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-50 flex items-center justify-center gap-2" style={{ background: "var(--primary-color, #2563eb)", borderRadius: "var(--border-radius, 0.375rem)" }}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}{submitting ? "Booking..." : "Book Appointment"}
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldRow({ icon: Icon, label, required, optional, children }: { icon: typeof User; label: string; required?: boolean; optional?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />{label}
        {required && <span className="text-red-500">*</span>}
        {optional && <span className="text-xs text-muted-foreground">(optional)</span>}
      </label>
      {children}
    </div>
  );
}

function FormPreview({ heading, description, requirePhone, requireEmail, requireAddress }: FormProps) {
  return (
    <div className="w-full" style={{ padding: "var(--section-spacing, 2.5rem) 1rem" }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <span className="ep-section-label" style={{ color: "var(--primary-color)" }}>Book</span>
          <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--primary-color, #1f2937)" }}>{heading}</h2>
          {description && <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">{description}</p>}
        </div>
        <div className="border p-6 space-y-4" style={{ borderRadius: "var(--border-radius, 0.5rem)" }}>
          <FieldRow icon={User} label="Full Name" required><input disabled placeholder="John Smith" className="w-full px-3 py-2 text-sm border rounded bg-gray-50 text-muted-foreground" /></FieldRow>
          {requireEmail && <FieldRow icon={Mail} label="Email" required><input disabled placeholder="john@example.com" className="w-full px-3 py-2 text-sm border rounded bg-gray-50 text-muted-foreground" /></FieldRow>}
          {requirePhone && <FieldRow icon={Phone} label="Phone" required><input disabled placeholder="(555) 123-4567" className="w-full px-3 py-2 text-sm border rounded bg-gray-50 text-muted-foreground" /></FieldRow>}
          {requireAddress && <FieldRow icon={MapPin} label="Address"><input disabled placeholder="123 Main St" className="w-full px-3 py-2 text-sm border rounded bg-gray-50 text-muted-foreground" /></FieldRow>}
          <FieldRow icon={MessageSquare} label="Notes" optional><textarea disabled placeholder="Any details..." rows={3} className="w-full px-3 py-2 text-sm border rounded bg-gray-50 text-muted-foreground resize-none" /></FieldRow>
          <button disabled className="w-full px-5 py-3 text-sm font-semibold text-white disabled:opacity-50" style={{ background: "var(--primary-color, #2563eb)", borderRadius: "var(--border-radius, 0.375rem)" }}>Book Appointment</button>
          <p className="text-center text-xs text-muted-foreground italic">Booking form will be active once booking is enabled</p>
        </div>
      </div>
    </div>
  );
}
