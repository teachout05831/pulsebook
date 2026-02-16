"use client";

import { useState } from "react";
import { CreditCard, Lock, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import type { SectionProps } from "./sectionProps";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export function PaymentSection({ section, estimate, customer, pageId, isPreview }: SectionProps) {
  const title = (section.content.title as string) || "Secure Your Project";
  const depositAmount = section.content.depositAmount as number | null;
  const depositType = (section.content.depositType as string) || "flat";
  const variant = (section.settings.variant as string) || "standard";
  const acceptFullPayment = Boolean(section.settings.acceptFullPayment);

  const estimateTotal = estimate?.total ?? 0;
  const deposit =
    depositType === "percentage" && depositAmount
      ? estimateTotal * (depositAmount / 100)
      : depositAmount ?? estimateTotal * 0.1;
  const payableDeposit = Math.min(deposit, estimateTotal) || estimateTotal;

  const [tab, setTab] = useState<"deposit" | "full">("deposit");
  const [name, setName] = useState(customer?.name ?? "");
  const [email, setEmail] = useState(customer?.email ?? "");
  const [isPaying, setIsPaying] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const payAmount = tab === "full" ? estimateTotal : payableDeposit;

  async function handlePay() {
    if (isPreview) { toast("Payments available on the live page"); return; }
    if (!name || !email) { toast("Please fill in your name and email"); return; }
    setIsPaying(true);
    try {
      const res = await fetch(`/api/estimate-pages/${pageId}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: payAmount,
          depositOrFull: tab,
          customerEmail: email,
          customerName: name,
          provider: "internal",
        }),
      });
      if (!res.ok) { toast("Payment failed"); return; }
      const data = await res.json();
      if (data.success) { setIsPaid(true); }
      else { toast(data.error || "Payment failed"); }
    } catch { toast("Payment failed — please try again"); }
    finally { setIsPaying(false); }
  }

  if (isPaid) {
    return (
      <div className="w-full" style={{ padding: "var(--section-spacing, 2.5rem) 1rem" }}>
        <div className="max-w-md mx-auto text-center space-y-3">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
          <h3 className="text-xl font-semibold text-green-700">Payment received!</h3>
          <p className="text-sm text-gray-500">
            {formatCurrency(payAmount)} has been processed. You will receive a confirmation email shortly.
          </p>
        </div>
      </div>
    );
  }

  const formFields = (
    <div className="space-y-3">
      {acceptFullPayment && (
        <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: "var(--primary-color, #2563eb)" }}>
          <button onClick={() => setTab("deposit")} className="flex-1 py-2 text-sm font-medium transition-colors" style={{ background: tab === "deposit" ? "var(--primary-color, #2563eb)" : "transparent", color: tab === "deposit" ? "#fff" : "var(--primary-color, #2563eb)" }}>Pay Deposit</button>
          <button onClick={() => setTab("full")} className="flex-1 py-2 text-sm font-medium transition-colors" style={{ background: tab === "full" ? "var(--primary-color, #2563eb)" : "transparent", color: tab === "full" ? "#fff" : "var(--primary-color, #2563eb)" }}>Pay Full</button>
        </div>
      )}
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" style={{ borderRadius: "var(--border-radius, 0.5rem)" }} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" type="email" className="w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" style={{ borderRadius: "var(--border-radius, 0.5rem)" }} />
      <button onClick={handlePay} disabled={isPaying} className="w-full py-3 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60" style={{ background: "var(--primary-color, #2563eb)", borderRadius: "var(--border-radius, 0.5rem)" }}>
        <Lock className="h-4 w-4" />
        {isPaying ? "Processing..." : `Pay ${formatCurrency(payAmount)}`}
      </button>
      <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
        <Lock className="h-3 w-3" /> 256-bit SSL Encrypted
      </p>
    </div>
  );

  const amountDisplay = (
    <div className="text-center space-y-1">
      <div className="flex items-center justify-center gap-2">
        <CreditCard className="h-5 w-5" style={{ color: "var(--primary-color, #2563eb)" }} />
        <h2 className="text-xl sm:text-2xl" style={{ fontFamily: "var(--heading-font, inherit)", fontWeight: "var(--heading-weight, 700)" as string, color: "var(--primary-color, #1f2937)" }}>{title}</h2>
      </div>
      <p className="text-3xl font-bold" style={{ color: "var(--primary-color, #2563eb)" }}>{formatCurrency(payableDeposit)} deposit</p>
      {estimateTotal > 0 && <p className="text-sm text-gray-500">of {formatCurrency(estimateTotal)} total</p>}
    </div>
  );

  return (
    <div className="w-full" style={{ padding: "var(--section-spacing, 2.5rem) 1rem" }}>
      {variant === "split" ? (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">{amountDisplay}</div>
          <div className="border rounded-xl p-6 shadow-sm" style={{ borderRadius: "var(--border-radius, 0.5rem)" }}>{formFields}</div>
        </div>
      ) : (
        <div className="max-w-md mx-auto border rounded-xl p-6 shadow-sm space-y-5" style={{ borderRadius: "var(--border-radius, 0.5rem)" }}>
          {amountDisplay}
          {formFields}
        </div>
      )}
    </div>
  );
}
