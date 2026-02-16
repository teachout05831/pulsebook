"use client";

import type { SectionProps } from "./sectionProps";

interface TimelineStep {
  title: string;
  description: string;
  icon?: string;
}

const PLACEHOLDER_STEPS: TimelineStep[] = [
  { title: "Estimate Approved", description: "Once you approve, we lock in your pricing and schedule." },
  { title: "Schedule Date", description: "We coordinate a start date that works for your schedule." },
  { title: "Work Begins", description: "Our team arrives on time and gets to work on your project." },
  { title: "Project Complete", description: "We do a final walkthrough to make sure everything looks great." },
];

const STEP_ICONS = [
  <svg key="0" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  <svg key="1" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>,
  <svg key="2" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.384-3.077A1.5 1.5 0 015 10.788V5.25A2.25 2.25 0 017.25 3h9.5A2.25 2.25 0 0119 5.25v5.538a1.5 1.5 0 01-1.036 1.305l-5.384 3.077a1.5 1.5 0 01-1.16 0z" /></svg>,
  <svg key="3" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>,
];

export function TimelineSection({ section }: SectionProps) {
  const title = (section.content.title as string) || "What Happens Next";
  const steps = (section.content.steps as TimelineStep[] | undefined) ?? PLACEHOLDER_STEPS;

  return (
    <div className="w-full ep-animate" style={{ paddingTop: "var(--section-spacing, 2.5rem)", paddingBottom: "var(--section-spacing, 2.5rem)", paddingLeft: "1rem", paddingRight: "1rem" }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <span className="ep-section-label" style={{ color: "var(--primary-color)" }}>Process</span>
          <h2 className="text-xl sm:text-2xl" style={{ color: "var(--primary-color, #1f2937)" }}>
            {title}
          </h2>
        </div>

        <div className="relative max-w-xl mx-auto">
          {steps.map((step, index) => {
            const delayClass = index <= 3 ? `ep-animate-delay-${index}` : "";
            return (
              <div key={step.title} className={`relative flex gap-5 pb-10 last:pb-0 ep-animate ${delayClass}`}>
                {index < steps.length - 1 && (
                  <div className="absolute left-[21px] top-[48px] w-0.5 bottom-0" style={{ background: "var(--primary-color, #3b82f6)", opacity: 0.2 }} />
                )}
                <div
                  className="relative z-10 flex items-center justify-center shrink-0 w-[42px] h-[42px] rounded-full text-white"
                  style={{
                    background: `linear-gradient(135deg, var(--primary-color, #3b82f6), var(--secondary-color, var(--primary-color, #2563eb)))`,
                    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                  }}
                >
                  {STEP_ICONS[index % STEP_ICONS.length]}
                </div>
                <div className="flex-1 pt-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-semibold uppercase tracking-wider opacity-40">Step {index + 1}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-base mt-0.5">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
