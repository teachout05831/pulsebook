'use client'

import { MarketingNav } from '../MarketingNav'
import { MarketingFooter } from '../MarketingFooter'
import { ContactFormDialog } from '../ContactFormDialog'
import { FeatureIcon } from '../FeatureIcon'
import type { TemplateProps } from '../../types'

export function SplitTemplate({ features }: TemplateProps) {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav variant="light" />

      {/* Hero — split layout */}
      <section className="grid min-h-[80vh] lg:grid-cols-2">
        <div className="flex items-center px-8 py-20 md:px-16">
          <div className="max-w-lg">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Everything your service team needs
            </h1>
            <p className="mt-6 text-lg text-slate-600">
              Schedule jobs, send estimates, manage crews, and collect payments — all from Pulsebook.
            </p>
            <div className="mt-10">
              <ContactFormDialog triggerClassName="h-12 px-8 text-base" />
            </div>
          </div>
        </div>

        {/* Decorative panel */}
        <div className="relative hidden overflow-hidden bg-blue-600 lg:block">
          <div className="absolute left-8 top-16 h-40 w-64 rounded-2xl bg-blue-500/60" />
          <div className="absolute bottom-24 right-12 h-48 w-48 rounded-2xl bg-blue-700/60" />
          <div className="absolute left-1/2 top-1/2 h-32 w-80 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white/10" />
          <div className="absolute bottom-12 left-16 h-24 w-40 rounded-2xl bg-blue-400/40" />
          <div className="absolute right-8 top-32 h-20 w-20 rounded-full bg-white/10" />
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-2xl font-bold text-slate-900">
            Built for service businesses
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border-l-4 border-l-blue-600 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <FeatureIcon name={feature.icon} className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="mb-2 font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <h2 className="mb-4 text-2xl font-bold text-slate-900">Ready to simplify?</h2>
        <p className="mb-8 text-slate-600">Request a demo and see Pulsebook in action.</p>
        <ContactFormDialog triggerClassName="h-12 px-8 text-base" />
      </section>

      <MarketingFooter variant="light" />
    </div>
  )
}
