"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { SectionProps } from "./sectionProps";

interface FAQItem {
  question: string;
  answer: string;
}

const PLACEHOLDER_ITEMS: FAQItem[] = [
  { question: "How long will the project take?", answer: "Timelines vary by project scope. We will provide a detailed schedule once the estimate is approved." },
  { question: "What payment methods do you accept?", answer: "We accept credit cards, checks, and bank transfers. Payment terms are outlined in the estimate." },
  { question: "Do you offer a warranty?", answer: "Yes, all of our work comes with a satisfaction guarantee. Specific warranty details are included with your estimate." },
];

export function FAQSection({ section }: SectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const title = (section.content.title as string) || "Frequently Asked Questions";
  const items = (section.content.items as FAQItem[] | undefined) ?? PLACEHOLDER_ITEMS;
  const variant = (section.settings.variant as string) || "accordion";

  return (
    <div className="w-full bg-gray-50/80 ep-animate" style={{ paddingTop: "var(--section-spacing, 2.5rem)", paddingBottom: "var(--section-spacing, 2.5rem)", paddingLeft: "1rem", paddingRight: "1rem" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="ep-section-label" style={{ color: "var(--primary-color)" }}>FAQ</span>
          <h2 className="text-xl sm:text-2xl" style={{ color: "var(--primary-color, #1f2937)" }}>
            {title}
          </h2>
        </div>

        {variant === "two-column" ? (
          <TwoColumnLayout items={items} />
        ) : (
          <AccordionLayout items={items} openIndex={openIndex} onToggle={(i) => setOpenIndex((prev) => (prev === i ? null : i))} />
        )}
      </div>
    </div>
  );
}

function AccordionLayout({ items, openIndex, onToggle }: { items: FAQItem[]; openIndex: number | null; onToggle: (i: number) => void }) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={item.question}
            className="overflow-hidden transition-all duration-200"
            style={{
              background: "var(--card-bg, white)",
              border: "1px solid var(--card-border, #e5e7eb)",
              borderRadius: "var(--border-radius, 0.5rem)",
              boxShadow: isOpen ? "var(--card-shadow, 0 1px 3px rgba(0,0,0,0.1))" : "none",
              borderLeft: isOpen ? "3px solid var(--primary-color, #3b82f6)" : "3px solid transparent",
            }}
          >
            <button
              type="button"
              className="flex items-center justify-between w-full px-5 py-4 text-left gap-3"
              onClick={() => onToggle(index)}
              aria-expanded={isOpen}
            >
              <span className="font-medium text-gray-900 text-base">{item.question}</span>
              <ChevronDown
                className="h-4 w-4 shrink-0 text-gray-500 transition-transform duration-300"
                style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>
            <div
              className="transition-all duration-300 ease-in-out overflow-hidden"
              style={{ maxHeight: isOpen ? "600px" : "0px", opacity: isOpen ? 1 : 0 }}
            >
              <div className="px-5 pb-4">
                <p className="text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TwoColumnLayout({ items }: { items: FAQItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item, index) => (
        <div
          key={item.question}
          className="p-5"
          style={{
            background: "var(--card-bg, white)",
            border: "1px solid var(--card-border, #e5e7eb)",
            borderRadius: "var(--border-radius, 0.5rem)",
            boxShadow: "var(--card-shadow, 0 1px 3px rgba(0,0,0,0.1))",
          }}
        >
          <h3 className="font-medium text-gray-900 text-base mb-2">{item.question}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
        </div>
      ))}
    </div>
  );
}
