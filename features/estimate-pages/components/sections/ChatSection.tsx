"use client";

import { useState } from "react";
import { MessageSquare, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import type { SectionProps } from "./sectionProps";

export function ChatSection({ section, customer, pageId, isPreview }: SectionProps) {
  const welcomeMessage = (section.content.welcomeMessage as string) || "Have questions? Send us a message!";
  const variant = (section.settings.variant as string) || "standard";

  const [name, setName] = useState(customer?.name ?? "");
  const [email, setEmail] = useState(customer?.email ?? "");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSend() {
    if (isPreview) { toast("Chat available on the live page"); return; }
    if (!message.trim()) { toast("Please enter a message"); return; }
    setIsSending(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      await fetch(`/api/estimate-pages/${pageId}/analytics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType: "chat_message", eventData: { name, email, message } }),
      }).catch(() => {});
      setIsSent(true);
    } finally { setIsSending(false); }
  }

  if (isSent) {
    return (
      <div className="w-full" style={{ padding: "var(--section-spacing, 2.5rem) 1rem" }}>
        <div className="max-w-md mx-auto text-center space-y-3">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
          <h3 className="text-xl font-semibold text-green-700">Message sent!</h3>
          <p className="text-sm text-gray-500">We&apos;ll respond shortly.</p>
        </div>
      </div>
    );
  }

  const inputStyle = { borderRadius: "var(--border-radius, 0.5rem)" };

  if (variant === "minimal") {
    return (
      <div className="w-full" style={{ padding: "var(--section-spacing, 2.5rem) 1rem" }}>
        <div className="max-w-2xl mx-auto space-y-3">
          <p className="text-sm text-gray-500 text-center">{welcomeMessage}</p>
          <div className="flex gap-2">
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." rows={1} className="flex-1 px-3 py-2.5 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" style={inputStyle} />
            <button onClick={handleSend} disabled={isSending} className="px-4 py-2.5 text-white transition-opacity hover:opacity-90 disabled:opacity-60" style={{ background: "var(--primary-color, #2563eb)", ...inputStyle }}>
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ padding: "var(--section-spacing, 2.5rem) 1rem" }}>
      <div className="max-w-lg mx-auto border rounded-xl shadow-sm overflow-hidden" style={{ borderRadius: "var(--border-radius, 0.5rem)" }}>
        <div className="flex items-center gap-2 px-4 py-3 text-white" style={{ background: "var(--primary-color, #2563eb)" }}>
          <MessageSquare className="h-4 w-4" />
          <span className="text-sm font-medium">Chat with Us</span>
        </div>
        <div className="p-4 space-y-4">
          <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-700 max-w-[80%]" style={{ borderRadius: "var(--border-radius, 0.5rem)" }}>
            {welcomeMessage}
          </div>
          <div className="space-y-3">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" style={inputStyle} />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" type="email" className="w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" style={inputStyle} />
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message..." rows={3} className="w-full px-3 py-2.5 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" style={inputStyle} />
            <button onClick={handleSend} disabled={isSending} className="w-full py-2.5 text-white text-sm font-medium flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60" style={{ background: "var(--primary-color, #2563eb)", ...inputStyle }}>
              <Send className="h-4 w-4" />
              {isSending ? "Sending..." : "Send Message"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
